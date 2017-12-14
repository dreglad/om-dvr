<template>
  <v-container fluid class="pa-0">
    <v-layout row wrap justify-center>
      <!-- left buttons -->
      <v-flex lg5 text-xs-right class="pa-0 ma-0 pt-1">
        <!-- <v-select
          :items="expandOptions"
          segmented
          style="width: 100px"
        /> -->
        <v-btn class="pa-0 ma-0"
          v-if="canExpandStart"
          @click="expandDuration(-60*30)"
        >
          &lt; 30m
        </v-btn>
        <v-btn class="pa-0 ma-0"
          v-if="canExpandStart"
          @click="expandDuration(-10*60)"
        >
          &lt; 10m
        </v-btn>
        <v-btn class="pa-0 ma-0"
          v-if="canExpandStart"
          @click="expandDuration(-5)"
        >
          &lt; 5s
        </v-btn>
        <v-btn class="pa-0 ma-0"
          :disabled="!playerSources.length || Math.floor(videoTime) == 0"
          @click="setPosition('start')"
        >
          <v-icon dark>subdirectory_arrow_right</v-icon>
        </v-btn>
        <v-btn class="pa-0 ma-0"
          :disabled="!playerSources.length || !videoTime"
          @click="rewind"
        >
          <v-icon dark>fast_rewind</v-icon>
        </v-btn>
      </v-flex>
      <!-- end left buttons

      <!-- center play/pause button -->
      <v-flex xs1 text-xs-center class="pa-0 ma-0" style="width: 40px !important">
        <v-btn fab color="secondary" class="pa-0 ma-0"
          v-if="!playing"
          @click="playing = true" 
          :disabled="!playerSources.length"
        >
          <v-icon dark v-if="Math.floor(videoTime) >= dvrDuration">replay</v-icon>
          <v-icon dark v-else >play_arrow</v-icon>
        </v-btn>
        <v-btn fab color="secondary" class="pa-0 ma-0"
          v-else
          @click="playing = false"
          :disabled="!playerSources.length"
        >
          <v-icon dark>pause</v-icon>
        </v-btn>
      </v-flex>
      <!-- end center play/pause button -->

      <!-- right edge buttons -->
      <v-flex lg5 text-xs-left class="pa-0 ma-0 pt-1">
        <v-btn
          :disabled="!playerSources.length || Math.floor(videoTime) >= dvrDuration"
          @click="forward"
          class="pa-0 ma-0"
        >
          <v-icon dark>fast_forward</v-icon>
        </v-btn>
        <v-btn
          :disabled="Math.floor(videoTime) >= dvrDuration || !videoTime"
          @click="setPosition('end')"
          class="pa-0 ma-0"
        >
          <v-icon dark>subdirectory_arrow_left</v-icon>
        </v-btn>
        <v-btn v-if="canExpandEnd" @click="expandDuration(+5)" class="pa-0 ma-0" :disabled="!playerSources.length">5s &gt;</v-btn>
        <v-btn v-if="canExpandEnd" @click="expandDuration(+10*60)" class="pa-0 ma-0" :disabled="!playerSources.length">10m &gt;</v-btn>
        <v-btn v-if="canExpandEnd" @click="expandDuration(+60*30)" class="pa-0 ma-0" :disabled="!playerSources.length">30m &gt;</v-btn>
      </v-flex>
    </v-layout>

    <v-layout row wrap class="pt-2" justify-space-between>
      <v-flex lg6 md12 text-xs-center class="pr-2" style="height: 400px; cursor: pointer;">
        <div
          v-if="playerSources.length"
          @click="playing = !playing"
        >
          <video-player
            ref="player"
            :sources="playerSources"
            brand="html5"
            :autoplay="true"
            :controls="true"
            width="100%"
            height="auto"
            @time="videoTimeUpdated"
            @play="playing = true"
            @pause="playing = false"
            :paused="!playing"
            :startPosition="playerStartPosition"
          />
        </div>
        <v-progress-circular v-else indeterminate />
      </v-flex>

      <v-flex lg3 md6 text-xs-right justify-right>
        <v-time-picker
          v-model="selectedTime"
          :allowed-hours="allowedHours"
          :allowed-minutes="allowedMinutes"
          format="24hr"
        />
      </v-flex>
      <v-flex lg3 md6 text-xs-center>
        <v-date-picker
          v-model="selectedDate"
          :allowed-dates="allowedDates"
          locale="es"
          :style="{ background: 'black', margin: '0 auto;' }"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
// import _ from 'lodash'
import videoPlayer from './VideoPlayer'
import { mapGetters, mapState, mapActions } from 'vuex'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)

export default {
  name: 'StreamNavigator',

  data () {
    return {
      seconds: 0,
      playing: false,
      videoTime: 0,
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
      'dvrStoreDetails'
    ]),
    ...mapGetters([
      'recordingUrl',
      'dvrAvailableMax',
      'dvrDuration'
    ]),

    playerSources () {
      // console.log(this.recordingUrl)
      return this.recordingUrl ? [{ src: this.recordingUrl, type: 'application/x-mpegURL' }] : []
    },

    durationDisplay () {
      return 'segundos (' + moment.duration(this.dvrDuration, 'seconds').humanize() + ')'
    },

    secondsPrefix () {
      return this.dvrStart ? moment(this.dvrStart).format('HH:mm:') : ''
    },

    selectedTime: {
      get () {
        if (this.dvrStart) {
          return moment(this.dvrStart).add(this.videoTime).format('HH:mm')
        } else {
          return moment().format('HH:mm')
        }
      },
      set (val) {
        this.setDvrStart(moment(`${this.selectedDate} ${val}:0`, 'YYYY-MM-DD HH:mm:s'))
      }
    },

    selectedDate: {
      get () {
        if (this.dvrStart) {
          return moment(this.dvrStart).add(this.videoTime).format('YYYY-MM-DD')
        } else {
          return moment().format('YYYY-MM-DD')
        }
      },
      set (val) {
        this.setDvrStart(moment(`${val} ${this.selectedTime}:0`, 'YYYY-MM-DD HH:mm:s'))
      }
    },

    currentSeconds: {
      get () {
        const cs = Math.floor(moment(this.dvrStart).add(this.videoTime, 'seconds').format('s')) % 60
        return cs
      },
      set (val) {
        this.setDvrStart(moment(`${this.selectedDate} ${this.selectedTime}:${val}`, 'YYYY-MM-DD HH:mm:s'))
      }
    },

    canExpandStart () {
      return this.playerSources.length && this.videoTime < 5
    },

    canExpandEnd () {
      // console.log(this.dvrDuration))
      if (this.videoTime) {
        const video = this.$refs.player && this.$refs.player.$refs.player
        if (video) {
          return (Math.ceil(video.currentTime) + 5 >= Math.floor(this.dvrDuration))
        }
      }
    }

  },

  methods: {
    ...mapActions([
      'setDvrDuration',
      'setDvrStart'
    ]),
    allowedDates (date) {
      return Object.values(this.dvrStoreDetails).some(store => {
        return moment(date, 'YYYY-MM-DD').range('day').overlaps(store.utcRange)
      })
    },

    rewind () {
      const video = this.$refs.player.$refs.player
      // video.pause()
      // video.stopLoad()
      if (!this.playing) {
        // video.play()
      }
      video.currentTime = 0
      // video.pause()
      // video.startLoad(0)
    },

    forward () {
      const video = this.$refs.player.$refs.player
      // video.pause()
      // video.currentTime = 0
      // console.log('a', video.duration)
      // video.play()
      // video.stopLoad()
      // console.log('aaaaa')
      // video.currentTime = 0
      // video.play()
      video.currentTime = video.duration - 0.6
      // video.startLoad(video.duration - 1)
      // this.videoTime = video.currentTime
      // console.log(video.currentTime)
      // video.pause()
    },

    allowedHours (hour) {
      return Object.values(this.dvrStoreDetails).some(store => {
        return moment(`${this.selectedDate} ${hour}:0`, 'YYYY-MM-DD H:m').range('hour').overlaps(store.utcRange)
      })
    },

    allowedMinutes (minute) {
      if (this.selectedDate && this.selectedTime) {
        const [ hour, , ] = this.selectedTime.split(':')
        return Object.values(this.dvrStoreDetails).some(store => {
          return store.utcRange.contains(moment(`${this.selectedDate} ${hour}:${minute}`, 'YYYY-MM-DD HH:m'))
        })
      }
      return false
    },

    setPosition (side) {
      if (side === 'start') {
        this.setDvrStart(moment(this.dvrStart).add(this.videoTime, 'seconds'))
        this.setDvrDuration(this.dvrDuration - this.videoTime)
      } else if (side === 'end') {
        // this.playing = false
        this.setDvrDuration(this.videoTime)
        this.playerStartPosition = this.videoTime - 1
        // this.playing = true
      }
    },

    videoTimeUpdated (time) {
      this.videoTime = time
    },

    expandDuration (time) {
      // const oldDuration = this.dvrDuration
      // console.log(time, 'ccc')
      // console.log(this.dvrDuration)
      this.setDvrDuration(this.dvrDuration + Math.abs(time))
      // console.log(this.dvrDuration)
      if (time < 0) {
        this.setDvrStart(moment(this.dvrStart).subtract(Math.abs(time), 'seconds'))
      } else {
        // this.playerStartPosition = oldDuration - 1
        this.playerStartPosition = this.dvrDuration - 1
      // this.playing = true
      }
    }

  },

  watch: {
    videoTime (value) {
      // console.log(value)
      // console.log(this.dvrDuration)
    }
  },

  components: {
    videoPlayer: videoPlayer
  }
}
</script>

<style>
  .video-player {
    width: 100%;
  }
</style>
