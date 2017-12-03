  <template>
    <video-player
      v-if="sources.length"
      :sources="sources"
      brand="html5"
      :autoplay="true"
      height="auto"
      width="100%"
      :controls="true"
    />
  </template>

  <script>
  import { mapGetters, mapActions } from 'vuex'
  import VideoPlayer from './video/VideoPlayer'

  export default {
    name: 'AppLive',

    computed: {
      ...mapGetters([
        'liveUrl'
      ]),
      sources () {
        return this.liveUrl ? [{ src: this.liveUrl, type: 'application/x-mpegURL' }] : []
      }
    },

    methods: {
      ...mapActions([
        'requestDvrStores'
      ])
    },

    mounted () {
      // wowzaApi.getInstance(instance => { this.instance = instance })
    },

    created () {
      this.requestDvrStores()
    },

    components: {
      VideoPlayer
    }
  }
  </script>
