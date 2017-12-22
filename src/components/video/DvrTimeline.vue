<template>
  <div>

    <!-- timeline -->
    <timeline
      v-if="dvrStart && currentConversions"
      ref="timeline"
      :items="allItems"
      :options="options"
      :groups="groups"
      @doubleClick="(e) => focusItem(e.item, null, true)"
      @select="(items, e) => selected(items)"
      @timechanged="(e) => endSelected(e)"
    />

    <!-- Add new segment button -->
    <v-menu lazy offset-y top slot="activator"
      :close-on-content-click="false"
      transition="slide-y-reverse-transition"
      :nudge-right="40"
    >
      <v-btn small fab bottom right fixed
        slot="activator"
        style="margin-right: 48px"
      >
        <v-tooltip top :open-delay="2000">
          <v-icon slot="activator">settings_ethernet</v-icon>
          <span>Cambiar&nbsp;escala</span>
        </v-tooltip>
      </v-btn>
      <v-list>
        <v-list-tile>
          <v-list-tile-title>1 hora</v-list-tile-title>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-title>3 Horas</v-list-tile-title>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-title>1 día</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>

  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { Timeline } from 'vue2vis'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)
moment.locale('es')

export default {

  name: 'dvr-timeline',

  data () {
    return {
      timelineLoaded: false,
      groups: [{
        id: 'recording',
        content: 'Grabación',
        className: 'recordings'
      }, {
        id: 'conversions',
        content: 'Conversiones',
        className: 'conversions'
      }, {
        id: 'videos',
        content: 'Videos',
        className: 'videos'
      }],
      currentBar: null,
      endBar: null,
      startBar: null
    }
  },

  computed: {
    ...mapGetters([
      'currentConversions',
      'dvrDuration',
      'dvrAvailableMax',
      'dvrAvailableMin',
      'videoSource'
    ]),
    ...mapState([
      'dvrStart',
      'videoTime',
      'streamId'
    ]),

    options () {
      return {
        editable: { updateTime: true },
        configure: false,
        groupEditable: true,
        max: moment(this.dvrAvailableMax).add(15, 'minutes'),
        min: moment(this.dvrAvailableMin).subtract(15, 'minutes'),
        itemsAlwaysDraggable: true,
        zoomMin: 10000,
        zoomMax: 172800000,
        showCurrentTime: false,
        margin: {
          item: 0
        },
        moment: moment,
        start: this.dvrAvailableMax,
        onInitialDrawComplete: (initial) => {
          this.timelineLoaded = true

          if (this.dvrStart) {
            this.$refs.timeline.moveTo(this.dvrStart)
          }

          this.$watch('videoSource', this.watchVideoSource)
          this.$watch('videoTime', this.watchVideoTime)
        },
        onMove: (item) => {
          this.$store.dispatch('setDvr', {
            start: item.start,
            duration: moment(item.end).diff(item.start, 'seconds')
          })
        }
      }
    },

    allItems () {
      return [
        ...this.videoItems,
        ...this.conversionItems,
        ...this.storeBackgroundItems,
        ...this.recordingItems
      ]
    },

    videoItems () {
      return []
    },

    conversionItems () {
      return this.currentConversions
      .filter(conv => this.dvrAvailableMin.isBefore(conv.start))
      .map(conv => {
        return {
          id: conv.id,
          start: conv.start,
          end: conv.end,
          content: conv.dvr_store,
          group: 'conversions',
          className: `conversion ${conv.status}`,
          editable: false,
          selectable: true
        }
      })
    },

    storeBackgroundItems () {
      return Object.values(this.$store.state.dvrStoreDetails).map(store => {
        return {
          id: store.dvrStoreName,
          start: moment(store.utcStart, 'x'),
          end: moment(store.utcEnd, 'x'),
          type: 'background',
          group: 'recording',
          className: 'store',
          content: 'Bloque ' + store.dvrStoreName.split('.').pop()
        }
      })
    },

    recordingItems () {
      const duration = this.$store.getters.dvrDuration
      if (this.dvrStart && duration) {
        return [{
          id: '0',
          start: this.dvrStart,
          end: moment(this.dvrStart).add(moment.duration(duration, 'seconds')),
          editable: { updateTime: true, remove: false, add: true },
          className: 'recording blue',
          content: 'Nuevo',
          group: 'recording'
        }]
      } else {
        return []
      }
    }
  },

  methods: {
    watchVideoSource () {
      const timeline = this.$refs.timeline
      if (this.videoSource && timeline) {
        // timeline.setCurrentTime(this.dvrStart)
        const { start, end } = timeline.getWindow()
        if (!moment.range(start, end).contains(this.dvrStart)) {
          timeline.moveTo(this.dvrStart)
        }
        const duration = moment.duration(this.dvrDuration, 'seconds')
        const dvrEnd = moment(this.dvrStart).add(duration)
        if (this.endBar) {
          timeline.setCustomTime(dvrEnd, 'end')
        } else {
          timeline.addCustomTime(dvrEnd, 'end')
        }
        this.endBar = dvrEnd

        if (this.startBar) {
          timeline.setCustomTime(this.dvrStart, 'start')
        } else {
          timeline.addCustomTime(this.dvrStart, 'start')
        }
        this.startBar = this.dvrStart
      }
    },

    watchVideoTime () {
      const timeline = this.$refs.timeline
      if (timeline && this.timelineLoaded) {
        const time = moment(this.dvrStart).add(moment.duration(this.videoTime, 'seconds'))
        if (!this.currentBar) {
          timeline.addCustomTime(time, 'current')
        } else {
          timeline.setCustomTime(time, 'current')
        }
        this.currentBar = time
        // timeline.setCurrentTime()
      }
    },

    selected ({ items }) {
      this.setDvrItem(items[0])
    },

    endSelected ({ id, time }) {
      if (id === 'end') {
        this.$store.commit('SET_DVRDURATION', moment(time).diff(this.dvrStart, 'seconds', true))
      } else if (id === 'start') {
        this.$store.dispatch('setDvr', {
          start: moment(time),
          duration: this.dvrDuration + moment(this.dvrStart).diff(moment(time), 'seconds', true)
        })
      }
    },

    focusItem (item) {
      if (item) {
        this.$refs.timeline.focus(item)
      }
    },

    setDvrItem (itemId) {
      const conv = this.currentConversions.find(conv => conv.id === itemId)
      const timeline = this.$refs.timeline
      if (conv && timeline) {
        this.$store.dispatch('setDvr', conv)
        // timeline.setCurrentTime(conv.start)
      }
    }
  },

  components: {
    Timeline
  }
}
</script>

<style>
    .vis-timeline {
      /*border: 2px solid purple;*/
      border: none;
      /*font-family:  purisa, 'comic sans', cursive;*/
      font-size: 12pt;
      /*background: #ffecea;*/
    }

    .vis-item {
      /*border-color: white;*/
      border: 0px solid grey;
      /*height: 28px;*/
      /*margin-top: 1px;*/
      /*background-color: pink;*/
      /*font-size: 15pt;*/
      /*color: 'black';*/
      /*box-shadow: 5px 5px 12px rgba(128,128,128, 0.5);*/
    }

    .vis-item.store {
      opacity: 0.5;
      color: #444;
    }

    .vis-item.conversion {
      background-color: yellow;
    }

    .vis-item.conversion.SUCCESS {
      background-color: green;
    },

    .vis-item.recording {

    }

   .vis-custom-time.current {
      background-color: #ff7f6e;
      width: 2px;
      z-index: 2;
      pointer-events: none;
    }

    .vis-label {
      color: #666 !important;
      /*font-size: 70%;*/
    }

   /* .vis-label .vis-inner {
       height: 61px;
    }*/

/*    .vis-item,
    .vis-item.vis-line {
      border-width: 3px;
    }*/

    .vis-item.vis-selected {
      border-color: white;
      background-color: lightgreen;
    }

    .vis-time-axis .vis-text {
      color: grey;
      /*padding-top: 6px;*/
      /*padding-left: 6px;*/
    }

    .vis-time-axis .vis-text.vis-major {
      font-weight: bold;
    }

    .vis-time-axis .vis-grid.vis-minor {
      border-width: 2px;
      border-color: #555;
    }

    .vis-time-axis .vis-grid.vis-major {
      border-width: 2px;
      border-color: #888;
    }

/*    .vis-group.recordings {
      height: 50px !important;
    }*/

    /*.vis-group.conversions {
      min-height: 120px;
    }*/

</style>
