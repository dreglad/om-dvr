<template>
  <v-card class="elevation-6">
    <v-card-media>
      <div class="video-wrapper" :class="playerWrapperClasses">
        <VideoPlayer
          v-if="playerSources.length"
          ref="player"
          :sources="playerSources"
          :startPosition="playerStartPosition"
          :paused="!playing"
          :poster="videoPoster"
          :controls="userSettings.nativeVideoControls"
          :autoplay="true"
          :playsInline="true"
          @ended="playing = false"
          @pause="playing = false"
          @play="playing = true"
          @click.native="playing = !playing"
          @time="$store.commit('SET_VIDEOTIME', $event)"
          @progress="bufferUpdated"
          @durationchange="durationChanged"
        />
        <div v-else class="text-xs-center pa-3" style="margin-top: 6em">
          <v-progress-circular indeterminate />
        </div>
        <VideoProgressBar
          v-if="!userSettings.nativeVideoControls"
          ref="progressBar"
          :duration="duration"
          :currentTime="videoTime"
          :buffer="buffer"
          @seek="seek"
          @hover="$store.commit('SET_HOVERTIME', $event)"
          @dblClick="playing = !playing"
        />
        <DvrPlayerOverlay
          v-if="!userSettings.nativeVideoControls && videoSource && playerMode === 'fragment'"
          :duration="duration"
          @expand="expand"
          @truncate="truncate"
          @forward="forward"
          @rewind="rewind"
        />
      </div>
    </v-card-media>
    
    <DvrPlayerControls
      :duration="duration"
      @forward="forward"
      @rewind="rewind"
      @expand="expand"
      @truncate="truncate"
      @play="playing = true"
      @pause="playing = false"
    />
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
      playerStartPosition: 0,
      buffer: 0,
      clickPrevent: false
    }
  },

  activated () {
  },

  deactivated () {
    this.playing = false
  },

  computed: {
    ...mapState([
      'videoTime',
      'userSettings',
      'playerMode',
      'seekTo'
    ]),

    ...mapGetters([
      'dvrStart',
      'videoSource',
      'videoPoster'
    ]),

    playerWrapperClasses () {
      return {
        'hover-shadow': this.userSettings.videoHoverShadow && !this.userSettings.nativeVideoControls
      }
    },

    duration () {
      const [playerDuration, dvrDuration] = [this.$store.state.playerDuration, this.$store.getters.dvrDuration]
      return playerDuration || dvrDuration
    },

    playerSources () {
      if (!this.videoSource) return []
      else return [{ src: this.videoSource, type: 'application/x-mpegURL' }]
    },

    player () {
      if (this.$refs.player) {
        const player = this.$refs.player.$refs.video
        this.$store.commit('SET_PLAYERDURATION', player.duration)
        return player
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

    durationChanged (value) {
      this.playerStartPosition = 0
      this.$store.commit('SET_PLAYERDURATION', value)
    },

    seek (time) {
      this.$nextTick(() => {
        if (this.player && time >= 0) {
          this.player.currentTime = time
        }
      })
    },

    forward () {
      this.$nextTick(() => {
        this.player.currentTime = this.player.duration - 1.5
      })
    },

    rewind () {
      this.$nextTick(() => {
        this.player.currentTime = 0
      })
    },

    bufferUpdated () {
      this.$nextTick(() => {
        if (!this.player) return
        const buffered = this.player.buffered
        for (var i = 0; i < buffered.length; i++) {
          if (buffered.start(buffered.length - 1 - i) < this.player.currentTime) {
            this.buffer = buffered.end(buffered.length - 1 - i)
            break
          }
        }
      })
    },

    truncate (time) {
      if (time < 0) { // truncate to start
        time = Math.abs(time)
        this.playerStartPosition = 0
        this.setDvr({
          start: moment(this.dvrStart).add(time, 'seconds'),
          duration: this.duration - time
        })
      } else { // truncate to end
        this.playerStartPosition = time - 4.0
        this.setDvrDuration(time)
      }
    },

    expand (time) {
      this.setDvrDuration(this.duration + Math.abs(time))
      if (time < 0) {
        this.playerStartPosition = 0
        this.setDvrStart(moment(this.dvrStart).subtract(Math.abs(time), 'seconds'))
      } else {
        this.playerStartPosition = this.duration - 2
      }
    }
  },

  watch: {
    seekTo (val) {
      this.$nextTick(() => {
        this.seek(val)
      })
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
    /*z-index: -1;*/
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
</style>
