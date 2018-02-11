<template>
  <div>
  <v-container style="max-width: 1290px;">
    <v-layout row wrap>
      <v-flex lg5 md5 sm7 d-flex class="pa-2 pb-0">
        <DvrPlayer />
      </v-flex>
      <v-flex lg7 md7 sm5 d-flex class="pa-2 pb-0">
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

export default {
  name: 'PageRecorder',

  // mounted () {
  //   // const ESC_KEY = 27
  //   // document.addEventListener('keyup', (e) => {
  //   //   if (this.dialog && e.keyCode === ESC_KEY) {
  //   //     this.dialog = false
  //   //   }
  //   // })
  // },

  watch: {
    '$route': {
      handler (to, from) {
        const videoId = to.params.videoId
        if (videoId) {
          this.$store.commit('SET_VIDEOID', parseInt(to.params.videoId))
          this.$store.commit('SET_PLAYERMODE', 'video')
        } else {
          this.$store.commit('SET_PLAYERMODE', 'fragment')
        }
      },
      immediate: true
    }
  },

  components: {
    DvrPlayer,
    DvrPanel,
    DvrTimeline
  }
}
</script>
