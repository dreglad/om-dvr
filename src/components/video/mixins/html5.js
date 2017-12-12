// import _ from 'lodash'
export const BRAND = 'html5'

export default {

  created () {
    console.log('CREATES HLS')
    if (this.brand === BRAND) {
      this.hls = new window.Hls({
        debug: false,
        autoStartLoad: false,
        maxBufferLength: 30 * 60,
        maxBufferSize: 300000,
        maxBufferHole: 0.6,
        maxFragLookUpTolerance: 0.6,
        abrBandWidthFactor: 1.2,
        abrBandWidthUpFactor: 1.0
      })
    }
  },

  watch: {
    hlsSource (source) {
      console.log('Watched hlsSource, re-attaching new source')
      const media = this.hls.media
      if (media) {
        this.hls.detachMedia()
        this.hls.attachMedia(media)
      }
    }
  },

  computed: {
    currentTime: {
      get () {
        return this.hls.media.currentTime
      },
      set (val) {
        console.log('setting CT: ', val)
        this.hls.media.currentTime = val
      }
    }
  },

  beforeDestroy () {
    console.log('DESTROYING HLS')
    this.hls && this.hls.destroy()
  },

  methods: {
    setupListeners () {
      this.hls.on(window.Hls.Events.MEDIA_ATTACHED, () => {
        console.log('MEDIA_ATTACHED')
        this.hls.loadSource(this.hlsSource.src)
      })

      this.hls.on(window.Hls.Events.MANIFEST_PARSED, (event, data) => {
        console.log('MENIFEST_PASSED')
        console.log('Pos: ', this.startPosition)
        this.hls.media.currentTime = this.startPosition
        // if (!this.paused) {
        // this.hls.currentLevel = 1
        this.hls.startLoad(this.startPosition)
        // }
        this.startPosition = 0
      })

      this.hls.on(window.Hls.Events.ERROR, (event, data) => {
        console.log('HLS ERROR: ', data)
        if (data.fatal) {
          switch (data.type) {
            case window.Hls.ErrorTypes.NETWORK_ERROR:
              // try to recover network error
              console.log('fatal network error encountered, try to recover')
              this.hls.startLoad()
              break
            case window.Hls.ErrorTypes.MEDIA_ERROR:
              console.log('fatal media error encountered, try to recover')
              this.hls.recoverMediaError()
              break
            default:
              // cannot recover
              console.error('Cannot recover video error')
              this.hls.destroy()
              break
          }
        }
      })
    }
  },

  mounted () {
    console.log('MOUNTED')
    if (this.brand === BRAND) {
      this.setupListeners()
      this.hls.attachMedia(this.$refs.player)

      // when sources change, realod media
      this.$watch('paused', paused => {
        const player = this.$refs.player
        this.$nextTick(() => {
          paused ? player.pause() : player.play()
        })
      })

      const SPACE_KEY = 32
      const LEFT_KEY = 39
      const RIGHT_KEY = 37
      document.addEventListener('keydown', (e) => {
        if (this.hls.media && e.target === document.body) {
          switch (e.keyCode) {
            case SPACE_KEY:
              this.paused = !this.paused
              e.preventDefault()
              break
            case LEFT_KEY:
              this.hls.media.currentTime += (e.shiftKey ? 0.6 : 5)
              e.preventDefault()
              break
            case RIGHT_KEY:
              this.hls.media.currentTime += (e.shiftKey ? -0.6 : -5)
              e.preventDefault()
              break
          }
        }
      })
    }
  }
}
