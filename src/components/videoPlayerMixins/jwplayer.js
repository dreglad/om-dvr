export const BRAND = 'jwplayer'

export default {

  created () {
    if (this.brand === BRAND) {
      this.dependenciesLoaded = {
        jwplayer: false
      }
      this.injectJs('https://content.jwplatform.com/libraries/oSS05BCQ.js', () => {
        this.dependenciesLoaded.jwplayer = true
      })
    }
  },

  beforeDestroy () {
    if (this.brand === BRAND) {
      window.jwplayer(this.$refs.player).remove()
    }
  },

  mounted () {
    if (this.brand === BRAND) {
      // when all dependencies are loaded, setup player
      this.$watch('allDependenciesLoaded', (allLoaded) => {
        if (allLoaded) {
          // console.log(this.$refs.player)
          // console.log(this.sources)
          window.jwplayer(this.$refs.player).setup({
            sources: this.sources.map(src => ({ file: src.src })),
            width: this.width,
            height: this.height,
            controls: this.controls,
            autostart: this.autoplay
          })
          .on('time', ({ position }) => { this.$emit('time', position) })
          .on('play', () => { this.$emit('play') })
          .on('pause', () => { this.$emit('pause') })
          // when sources change, realod media

          this.$watch('sources', (sources) => {
            if (this.firstSource !== sources[0].src) {
              console.log('hls Source changed into player:', sources)
              this.firstSource = sources[0].src
              window.jwplayer(this.$refs.player).load(sources.map(src => ({ file: src.src })))
            }
          })
        }
      })
    }
  }

}
