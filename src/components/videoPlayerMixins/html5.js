// import _ from 'lodash'
export const BRAND = 'html5'

export default {

  created () {
    if (this.brand === BRAND) {
      this.hls = new window.Hls({
        debug: false,
        autoStartLoad: false,
        startLevel: 0,
        // maxBufferLength: 30 * 60,
        // maxBufferSize: 300000,
        maxBufferHole: 0.6,
        maxFragLookUpTolerance: 0.6,
        abrBandWidthFactor: 0.9,
        abrBandWidthUpFactor: 0.8
      })
    }
  },

  watch: {
    hlsSource (source) {
      const media = this.hls.media
      if (media && (!this.hls.url || this.hls.url !== source.src)) {
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
        // console.log('setting CT: ', val)
        this.hls.media.currentTime = val
      }
    }
  },

  beforeDestroy () {
    // console.log('DESTROYING HLS')
    this.hls && this.hls.destroy()
  },

  methods: {
    setupListeners () {
      this.hls.on(window.Hls.Events.MEDIA_ATTACHED, () => {
        // console.log('MEDIA_ATTACHED')
        this.hls.loadSource(this.hlsSource.src)
      })

      this.hls.on(window.Hls.Events.MANIFEST_PARSED, (event, data) => {
        // console.log('MENIFEST_PASSED')
        // console.log('Pos: ', this.startPosition)
        this.hls.media.currentTime = this.startPosition
        // if (!this.paused) {
        // this.hls.currentLevel = 1
        this.hls.startLoad(this.startPosition)
        // }
        this.startPosition = 0
      })

      // this.hls.on(window.Hls.Events.FRAG_BUFFERED, (event, data) => {
      //   console.log(data)
      //   const buffer = data.stats.total
      //   this.$emit('bufferUpdate', buffer)
      // })
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
              const media = this.hls.media
              if (media) {
                this.hls.detachMedia()
                this.hls.attachMedia(media)
              }
              break
          }
        }
      })
    }
  },

  mounted () {
    if (this.brand === BRAND) {
      this.setupListeners()
      this.hls.attachMedia(this.$refs.video)

      // when sources change, realod media
      this.$watch('paused', paused => {
        const player = this.$refs.video
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
              if (this.hls.media.paused || this.hls.media.ended) {
                this.hls.media.play()
              } else {
                this.hls.media.pause()
              }
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
