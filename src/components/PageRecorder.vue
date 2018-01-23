<template>
  <div>
  <v-container>
    <v-layout row wrap>
      <v-flex lg5 md6 d-flex class="pa-3 pb-0">
        <DvrPlayer />
      </v-flex>
      <v-flex lg7 md6 d-flex class="pa-3 pb-0">
        <DvrPanel />
      </v-flex>
    </v-layout>
    </v-container>
    <v-container fluid fill-height>
    <v-layout row>
      <v-flex xs12>
        <DvrTimeline />
      </v-flex>
    </v-layout>
  </v-container>
  </div>
</template>

<script>
import DvrPlayer from '@/components/DvrPlayer'
import DvrPanel from '@/components/DvrPanel'
import DvrTimeline from '@/components/DvrTimeline'
import { mapActions } from 'vuex'

export default {
  name: 'PageRecorder',

  data () {
    return {
      conversionsIntervalId: null,
      sceneChangesIntervalId: null
    }
  },

  methods: {
    ...mapActions([
      'requestDvrStores',
      'requestStores',
      'requestSceneChanges'
    ])
  },

  mounted () {
    // this.$store.dispatch('requestConversions')
    // this.conversionsIntervalId = setInterval(() => {
    //   this.$store.dispatch('requestConversions')
    // }, 5000)

    // this.$store.dispatch('requestSceneChanges')
    // this.sceneChangesIntervalId = setInterval(() => {
    //   this.$store.dispatch('requestSceneChanges')
    // }, 20000)
    // this.requestDvrStores(this.$route.params.stream)
    // this.requestStreams()

    // const ESC_KEY = 27
    // document.addEventListener('keyup', (e) => {
    //   if (this.dialog && e.keyCode === ESC_KEY) {
    //     this.dialog = false
    //   }
    // })
  },

  beforeDestroy () {
    // clearInterval(this.conversionsIntervalId)
    // clearInterval(this.sceneChangesIntervalId)
  },

  components: {
    DvrPlayer,
    DvrPanel,
    DvrTimeline
  }
}
</script>
