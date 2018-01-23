export const BRAND = 'videojs'

export default {

  data () {
    return {
      classObject: {
        'video-js': true,
        'vjs-default-skin': true
      },
      firstSource: null
    }
  },

  created () {
    if (this.brand === BRAND) {
      this.dependenciesLoaded = {
        videojs: false,
        videojshls: false
      }
      this.injectCss('http://vjs.zencdn.net/6.2.8/video-js.css')
      this.injectJs('http://vjs.zencdn.net/6.2.8/video.js', () => {
        this.dependenciesLoaded.videojs = true
        this.injectJs('https://cdnjs.cloudflare.com/ajax/libs/videojs-contrib-hls/5.12.2/videojs-contrib-hls.min.js', () => {
          this.dependenciesLoaded.videojshls = true
        })
      })
    }
  },

  mounted () {
    if (this.brand === BRAND) {
      // when all dependencies are loaded, setup player
      this.$watch('allDependenciesLoaded', (allLoaded) => {
        if (allLoaded) {
          window.videojs(this.$refs.player)
        }
      }, { deep: true })
      // when sources change, realod media
      this.$watch('sources', (sources) => {
        window.videojs(this.$refs.player).src(sources)
      })
    }
  }
}
