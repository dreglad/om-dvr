<template>
  <v-layout row>
    <v-flex lg12 align-content-end align-end>
      <video-player
        v-if="sources.length"
        :sources="sources"
        brand="html5"
        :autoplay="true"
        width="100%"
        style="max-width: 100%;"
        :controls="false"
      />
    </v-flex>
  </v-layout>
</template>

  <script>
  import { mapGetters } from 'vuex'
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

    components: {
      VideoPlayer
    }
  }
  </script>
