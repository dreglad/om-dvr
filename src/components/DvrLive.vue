<template>
  <v-dialog
    lazy
    v-model="isLive"
    :overlay="true"
    transition="fadein"
    width="80%"
    >
    <v-card color="black">
      <v-flex lg12 align-content-end align-end fill-height>
        <VideoPlayer
          :sources="sources"
          brand="html5"
          autoplay
          :controls="false"
        />
      </v-flex>
    </v-card>
  </v-dialog>
</template>

  <script>
  import { mapGetters } from 'vuex'
  import VideoPlayer from './VideoPlayer'

  export default {
    name: 'AppLive',

    computed: {
      ...mapGetters([
        'liveUrl'
      ]),
      sources () {
        return this.liveUrl ? [{ src: this.liveUrl, type: 'application/x-mpegURL' }] : []
      },
      isLive: {
        get () {
          return this.$store.state.isLive
        },
        set (value) {
          this.$store.commit('SET_ISLIVE', value)
        }
      }
    },

    mounted () {
      this.$store.commit('SET_PLAYING', false)
    },

    components: {
      VideoPlayer
    }
  }
  </script>
