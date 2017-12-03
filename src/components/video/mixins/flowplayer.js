export const BRAND = 'flowplayer'

export default {

  created () {
    if (this.brand === BRAND) {
      this.dependenciesLoaded = {
        flowplayer: false,
        flowplayerhls: false
      }
      this.noVideoTag = true
      this.injectCss('//releases.flowplayer.org/7.2.1/skin/skin.css')
      this.injectJs('//releases.flowplayer.org/7.2.1/flowplayer.js', () => {
        this.dependenciesLoaded.flowplayer = true
        this.injectJs('//releases.flowplayer.org/hlsjs/flowplayer.hlsjs.light.min.js', () => {
          this.dependenciesLoaded.flowplayerhls = true
        })
      })
    }
  },

  mounted () {
    if (this.brand === BRAND) {
      this.$watch('allDependenciesLoaded', (allLoaded) => {
        if (allLoaded) {
          window.flowplayer(this.$refs.playerWrapper, {
            clip: {
              sources: this.sources
            },
            aspect: '16:9',
            responsive: false,
            autoplay: this.autoplay
          })
        }
      }, { deep: true })
      // when sources change, realod media
      this.$watch('sources', (sources) => {
        window.flowplayer(this.$refs.playerWrapper).load(this.sources)
      })
    }
  }

}
