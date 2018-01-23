<template>
  <v-card class="elevation-6">
    <v-card-media>
      <div
        class="video-wrapper"
        :class="{ 'hover-shadow': userSettings.videoHoverShadow && !userSettings.nativeVideoControls }"
      >
        <VideoPlayer
          v-if="playerSources.length"
          ref="player"
          autoplay
          :sources="playerSources"
          :controls="userSettings.nativeVideoControls"
          :startPosition="playerStartPosition"
          :paused="!playing"
          @ended="playing = false"
          @pause="playing = false"
          @play="playing = true"
          @click.native="playing = !playing"
          @time="$store.commit('SET_VIDEO_TIME', $event)"
          @progress="bufferUpdated"
          @durationchange="durationChanged"
        />
        <div v-else class="text-xs-center pa-3" style="margin-top: 6em">
          <v-progress-circular indeterminate />
        </div>
        <VideoProgressBar
          ref="progressBar"
          v-if="!userSettings.nativeVideoControls"
          :duration="dvrDuration"
          :currentTime="videoTime"
          :buffer="buffer"
          @seek="seek"
          @hover="hoverTime = $event"
          @dblClick="playing = !playing"
        />
        <DvrPlayerOverlay
          v-if="!userSettings.nativeVideoControls && videoSource"
          @expandDuration="expandDuration"
          @
        />
      </div>
    </v-card-media>
    
    <DvrPlayerControls />
  </v-card>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import VideoPlayer from './VideoPlayer'
import DvrPlayerOverlay from './DvrPlayerOverlay'
import DvrPlayerControls from './DvrPlayerControls'
import VideoProgressBar from './VideoProgressBar'
import moment from 'moment'

export default {
  name: 'DvrPlayer',

  data () {
    return {
      isActive: true,
      playerStartPosition: 0,
      buffer: 0,
      clickPrevent: false
    }
  },

  activated () {
    this.isActive = true
  },

  deactivated () {
    this.$nextTick(() => {
      this.playing = false
      this.isActive = false
    })
  },

  computed: {
    ...mapState([
      'videoTime',
      'seekTo',
      'userSettings',
      'isLive'
    ]),

    ...mapGetters([
      'dvrStart',
      'dvrDuration',
      'videoSource',
      'selectedStream',
      'dvrRange'
    ]),

    playerSources () {
      if (!this.videoSource) return []
      else return [{ src: this.videoSource, type: 'application/x-mpegURL' }]
    },

    player () {
      if (this.$refs.player) {
        return this.$refs.player.$refs.video
      }
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

    pause () {
      this.$nextTick(() => {
        this.player.pause()
      })
    },

    durationChanged ($event) {
      console.log('duration: ', $event)
      this.$store.commit('SET_PLAYERDURATION', $event)
    },

    seek (time) {
      this.$nextTick(() => {
        if (!isNaN(time)) {
          this.player.currentTime = time
        }
      })
    },

    forward () {
      if (this.player) {
        this.player.currentTime = this.player.duration - 1.0
      }
    },

    rewind () {
      this.player.currentTime = 0
    },

    bufferUpdated () {
      if (this.player) {
        const buffered = this.player.buffered
        for (var i = 0; i < buffered.length; i++) {
          if (buffered.start(buffered.length - 1 - i) < this.player.currentTime) {
            this.buffer = buffered.end(buffered.length - 1 - i)
            break
          }
        }
      }
    },

    truncatePosition ({ side, time = null }) {
      switch (side) {
        case 'start':
          this.setDvr({
            start: moment(this.dvrStart).add(time || this.player.currentTime, 'seconds'),
            duration: this.dvrDuration - (time || this.player.currentTime)
          })
          this.playerStartPosition = 0
          break
        case 'end':
          this.setDvrDuration(time || this.player.currentTime)
          this.playerStartPosition = this.dvrDuration - 2
          break
      }
    },

    expandDuration (time) {
      this.setDvrDuration(this.dvrDuration + Math.abs(time))
      if (time < 0) {
        this.setDvrStart(moment(this.dvrStart).subtract(Math.abs(time), 'seconds'))
      } else {
        this.playerStartPosition = this.dvrDuration - 2
      }
    }

  },

  watch: {
    seekTo (val) {
      if (this.player) {
        this.player.currentTime = val
      }
    }
  },

  components: {
    DvrPlayerOverlay,
    DvrPlayerControls,
    VideoPlayer,
    VideoProgressBar
  }
}
</script>

<style>

  .fade-enter-active, .fade-leave-active {
    transition: opacity .4s ease;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

  .video-player {
    width: 100%;
  }

  .video-wrapper {
    position: relative;
    cursor: pointer;
    padding-bottom: 56.25%; /* 16:9 */
    height: 0;
    width: 100%;
  }

  .video-wrapper.hover-shadow video {
    opacity: 1;
    -webkit-transition: opacity 1.2s ease-in-out;
    -moz-transition: opacity 1.2s ease-in-out;
    transition: opacity 1.2s ease-in-out;
  }

  .video-wrapper.hover-shadow:hover video {
    opacity: 0.6;
    background: black;
    -webkit-transition: opacity 1s ease-in-out;
    -moz-transition: opacity 1s ease-in-out;
    transition: opacity 1s ease-in-out;
  }

  .video-wrapper .video-overlays {
    opacity: 0.65;
    -webkit-transition: opacity 1.2s ease-in-out;
    -moz-transition: opacity 1.2s ease-in-out;
    transition: opacity 1.2s ease-in-out;
  }

  .video-wrapper:hover .video-overlays {
    opacity: 1;
    -webkit-transition: opacity 1s ease-in-out;
    -moz-transition: opacity 1s ease-in-out;
    transition: opacity 1s ease-in-out;
  }

  .video-overlays {
    position: absolute;
    top: 0;
    width: 100%;
  }

  .video-overlays > div {
    opacity: 0.85;
    letter-spacing: 2px;
    width: 100px;
    margin: 1px;
    padding: 0 4px;
  }

  .video-overlays .current {
    width: 150px;
  }


  .video-overlays > div,
  .video-overlays .current span,
  .video-overlays .current img {
    background-color: #333;
    text-align: center;
    border: 1px solid #666;
    display: block;
  }

  .video-overlays .current span {
    border-bottom: none;
  }

  .video-overlays .current img {
    border-top: none;
    padding: 5px;
  }
  
  .video-overlays > div.start {
    position: absolute;
    left: 0;
  }

  .video-overlays > div.current {
    margin-right: auto;
    margin-left: auto;
    display: block;
  }

  .video-overlays > div.end {
    position: absolute;
    right: 0;
    top: 0;
    float: right;
  }
</style>
