<template>
  <div>
    <div v-if="videoSource" @click="playing = !playing" style="min-height: 350px;">
      <video-player
        ref="player"
        :sources="playerSources"
        :autoplay="true"
        :controls="true"
        :paused="!playing"
        :startPosition="playerStartPosition"
        @ended="playing = false"
        @pause="playing = false"
        @play="playing = true"
        @time="videoTimeUpdated"
        brand="html5"
        height="auto"
        width="100%"
      />
    </div>
    <v-progress-circular v-else indeterminate />

    <!-- control buttons -->
    <v-layout row wrap justify-center>
    <!-- left buttons -->
        <v-flex lg5 text-xs-right class="pa-0 ma-0 pt-1">
          <!-- <v-select
            :items="expandOptions"
            segmented
            style="width: 100px"
          /> -->
          <!-- <v-btn class="pa-0 ma-0" small
            v-if="canExpandStart"
            @click="expandDuration(-60*30)"
          >
            &lt; 30m
          </v-btn> -->
          <v-btn small icon class="pa-0 ma-0"
            v-if="canExpandStart" 
            @click="expandDuration(-10*60)"
          >&lt;60</v-btn>
          <v-btn small icon class="pa-0 ma-0"
            v-if="canExpandStart"
            @click="expandDuration(-5)"
          >&lt;5</v-btn>
          <v-btn style="min-width: 60px" small
            :disabled="!videoSource || Math.floor(videoTime) == 0"
            @click="setPosition('start')"
          ><v-icon dark>subdirectory_arrow_right</v-icon></v-btn>
          <v-btn style="min-width: 60px" small
            :disabled="!videoSource || !videoTime"
            @click="rewind"
          ><v-icon dark>fast_rewind</v-icon></v-btn>
        </v-flex>
        <!-- end left buttons -->

        <!-- center play/pause button -->
        <v-flex xs1 text-xs-center>
          <v-btn fab color="secondary" small
            v-if="!playing"
            @click="playing = true" 
            :disabled="!videoSource"
          >
            <v-icon dark v-if="Math.floor(videoTime) >= dvrDuration">replay</v-icon>
            <v-icon dark v-else >play_arrow</v-icon>
          </v-btn>
          <v-btn fab color="secondary" small
            v-else
            @click="playing = false"
            :disabled="!videoSource"
          >
            <v-icon dark>pause</v-icon>
          </v-btn>
        </v-flex>
        <!-- end center play/pause button -->

        <!-- right edge buttons -->
        <v-flex lg5 text-xs-left class="pa-0 ma-0 pt-1">
          <v-btn small
            :disabled="!videoSource || Math.floor(videoTime) >= dvrDuration"
            @click="forward"
            style="min-width: 60px"
          >
            <v-icon dark>fast_forward</v-icon>
          </v-btn>
          <v-btn small
            :disabled="Math.floor(videoTime) >= dvrDuration || !videoTime"
            @click="setPosition('end')"
            style="min-width: 60px"
          >
            <v-icon dark>subdirectory_arrow_left</v-icon>
          </v-btn>

          <v-btn small icon class="pa-0 ma-0"
            v-if="canExpandEnd"
            @click="expandDuration(+5)"
            :disabled="!videoSource"
          >
            5&gt;
          </v-btn>
          <v-btn v-if="canExpandEnd" small icon @click="expandDuration(+60)" class="pa-0 ma-0" :disabled="!videoSource">60&gt;</v-btn>
        </v-flex>
    </v-layout>
  </div>
</template>

<script>
import VideoPlayer from './VideoPlayer'
import { mapGetters, mapState, mapActions } from 'vuex'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)

export default {
  name: 'dvr-player',

  data () {
    return {
      playerStartPosition: 0,
      expandOptions: [
        { text: '1 seg', value: '1' },
        { text: '5 seg', value: '5' },
        { text: '10 seg', value: '10' }
      ]
    }
  },

  computed: {
    ...mapState([
      'dvrStart',
      'videoTime',
      'videoSource'
    ]),

    ...mapGetters([
      'dvrDuration',
      'videoSource',
      'selectedStream'
    ]),

    playerSources () {
      return this.videoSource ? [{ src: this.videoSource, type: 'application/x-mpegURL' }] : []
    },

    playing: {
      get () {
        return this.$store.state.playing
      },
      set (value) {
        this.$store.commit('SET_PLAYING', !!value)
      }
    }

  },

  methods: {
    ...mapActions([
      'setDvr',
      'setDvrDuration',
      'setDvrStart'
    ]),

    rewind () {
      this.$refs.player.$refs.player.currentTime = 0
    },

    forward () {
      const player = this.$refs.player.$refs.player
      player.currentTime = player.duration - 0.6
    },

    setPosition (side) {
      if (side === 'start') {
        this.setDvr({
          start: moment(this.dvrStart).add(this.videoTime, 'seconds'),
          duration: this.dvrDuration - this.videoTime
        })
      } else if (side === 'end') {
        // this.playing = false
        this.$store.dispatch('setDvrDuration', this.videoTime)
        // this.$store.commit('SET_DVRDURATION', this.videoTime)
        this.playerStartPosition = this.videoTime - 1
        // this.playing = true
      }
    },

    videoTimeUpdated (time) {
      this.$store.commit('SET_VIDEO_TIME', time)
    },

    expandDuration (time) {
      this.setDvrDuration(this.dvrDuration + Math.abs(time))
      if (time < 0) {
        this.setDvrStart(moment(this.dvrStart).subtract(Math.abs(time), 'seconds'))
      } else {
        this.playerStartPosition = this.dvrDuration - 1
      }
    },

    canExpandStart () {
      return this.videoSource && this.videoTime < 5
    },

    canExpandEnd () {
      if (this.videoTime) {
        const video = this.$refs.player && this.$refs.player.$refs.player
        if (video) {
          return (Math.ceil(video.currentTime) + 5 >= Math.floor(this.dvrDuration))
        }
      }
    }

  },

  components: {
    VideoPlayer
  }
}
</script>

<style>
  .video-player {
    width: 100%;
  }
</style>
