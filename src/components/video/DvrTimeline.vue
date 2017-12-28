<template>
  <div>

    <!-- timeline -->
    <timeline
      v-if="dvrStart && currentConversions && recordingItems.length"
      ref="timeline"
      :items="allItems"
      :options="options"
      :groups="groups"
      @doubleClick="(e, i, o) => doubleClick(e, i, o)"
      @select="(items, e) => selected(items)"
      @timechanged="(e) => endSelected(e)"
      @mouseOver="(event) => mouseOver(event)"
    />

    <!-- Add new segment button -->
    <!-- <v-menu lazy offset-y top slot="activator"
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
    </v-menu> -->

  </div>
</template>

<script>
// import _ from 'lodash'
import { mapGetters, mapState } from 'vuex'
import { Timeline } from 'vue2vis'
import backend from '@/api/backend'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)
moment.locale('es')

export default {

  name: 'dvr-timeline',

  data () {
    return {
      timeline: null,
      groups: [{
        id: 'recordings',
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
      'videoSource',
      'selectedStream'
    ]),
    ...mapState([
      'dvrStart',
      'videoTime',
      'streamId'
    ]),

    dvrStore () {
      return this.$store.getters.selectedStoreDetails
    },

    options () {
      return {
        editable: {
          add: true,
          updateTime: true
        },
        configure: false,
        groupEditable: true,
        max: moment(this.dvrAvailableMax).add(15, 'minutes'),
        min: moment(this.dvrAvailableMin).subtract(15, 'minutes'),
        itemsAlwaysDraggable: true,
        zoomMin: 10000,
        zoomMax: 172800000,
        showCurrentTime: false,
        orientation: {
          axis: 'both'
        },
        snap: null,
        margin: {
          item: 0
        },
        moment: moment,
        start: this.dvrAvailableMax,
        onInitialDrawComplete: () => {
          this.timeline = this.$refs.timeline

          if (this.dvrStart) {
            this.timeline.setCurrentTime(this.videoTime)
          }

          this.$watch('videoSource', this.watchVideoSource)
          this.$watch('videoTime', this.watchVideoTime)

          if (this.recordingItems) {
            this.timeline.focus(this.recordingItems.map(i => i.id))
          }
          this.setTimeBars()
        },
        onUpdate: (item, callback) => {
          console.log('edit')
          if (this.timeline.getSelection() !== [item.id]) {
            this.timeline.setSelection(item.id, {
              focus: true
            })
          }
          callback(item)
        },
        onAdd: (item, callback) => {
          item.className = 'recording'
          item.group = 'recordings'
          item.end = moment(item.start).add(30, 'minutes')
          callback(item)
        },
        onMoving: (item, callback) => {
          // if (this.timeline.getSelection() !== [item.id]) {
          // this.timeline.setSelection(item.id, {
          //   focus: false
          // })
          // }
          callback(item)
          // if (this.dvrAvailableMin.isBefore(item.start) && this.dvrAvailableMax.isAfter(item.end)) {
          //   callback(item)
          // } else {
          //   callback(null)
          // }
        },
        onMove: (item, callback) => {
          if (this.dvrAvailableMin.isBefore(item.start) && this.dvrAvailableMax.isAfter(item.end)) {
            this.$store.dispatch('setDvr', {
              start: item.start,
              duration: moment(item.end).diff(item.start, 'seconds')
            })
            callback(item)
          } else {
            callback(null)
          }
        },
        tooltip: {
          followMouse: true,
          overflowMethod: 'cap'
        },
        tooltipOnItemUpdateTime: {
          template: this.itemTooltip
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
          id: 'back' + store.dvrStoreName,
          start: moment(store.utcStart, 'x'),
          end: moment(store.utcEnd, 'x'),
          type: 'background',
          group: 'recordings',
          className: 'store',
          subgroup: store.dvrStoreName,
          content: 'Bloque ' + store.dvrStoreName.split('.').pop()
        }
      })
    },

    recordingItems () {
      if (this.videoSource) {
        return [{
          id: 'recording-dvr',
          start: this.dvrStart,
          subgroup: this.dvrStore.dvrStoreName,
          end: moment(this.dvrStart).add(moment.duration(this.dvrDuration, 'seconds')),
          editable: { updateTime: true, remove: false, add: true },
          className: 'recording',
          content: moment.duration(this.dvrDuration, 'seconds').format('HH:mm:ss'),
          group: 'recordings'
          // title: 'nueva'
        }]
      } else {
        return []
      }
    }
  },

  methods: {

    mouseOver (event) {
      // console.log(event)
    },

    doubleClick (e, i, o) {
      console.log(e, i, o)
    },

    itemTooltip (item) {
      return (
        `<img src="${backend.getThumbnailUrl(this.selectedStream, item.start)}" class="tooltip start" />` +
        `<img src="${backend.getThumbnailUrl(this.selectedStream, item.end)}" class="tooltip end" />`
      )
    },

    setTimeBars () {
      const duration = moment.duration(this.dvrDuration, 'seconds')
      const dvrEnd = moment(this.dvrStart).add(duration)
      if (this.endBar) {
        this.timeline.setCustomTime(dvrEnd, 'end')
      } else {
        this.timeline.addCustomTime(dvrEnd, 'end')
      }
      this.endBar = dvrEnd

      if (this.startBar) {
        this.timeline.setCustomTime(this.dvrStart, 'start')
      } else {
        this.timeline.addCustomTime(this.dvrStart, 'start')
      }
      this.startBar = this.dvrStart
    },

    watchVideoSource () {
      if (this.videoSource && this.timeline) {
        // timeline.setCurrentTime(this.dvrStart)
        const { start, end } = this.timeline.getWindow()
        if (!moment.range(start, end).contains(this.dvrStart)) {
          // this.timeline.moveTo(this.dvrStart)
          this.timeline.focus(this.recordingItems.map(i => i.id))
        }
        this.setTimeBars()
      }
    },

    watchVideoTime () {
      if (this.timeline) {
        const time = moment(this.dvrStart).add(moment.duration(this.videoTime, 'seconds'))
        if (!this.currentBar) {
          this.timeline.addCustomTime(time, 'current')
        } else {
          this.timeline.setCustomTime(time, 'current')
        }
        this.timeline.setCurrentTime(time)
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
    // focusItem (what) {
    //   if (item && this.timeline) {
    //     this.timeline.focus(this.recordingItems)
    //   }
    // },

    setDvrItem (itemId) {
      const conv = this.currentConversions.find(conv => conv.id === itemId)
      if (conv && this.timeline) {
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
      /*border: 0px solid grey;*/
      /*height: 28px;*/
      /*margin-top: 2px;*/
      /*margin-top: 1px;*/
      /*background-color: pink;*/
      /*font-size: 15pt;*/
      /*color: 'black';*/
      /*box-shadow: 5px 5px 12px rgba(128,128,128, 0.5);*/
    }

    .vis-item img.tooltip {
      width: 48%;
      margin-top: 2px;
      border: 2px solid black;
    }

    .vis-item img.tooltip.start {
      /*padding-right: 2em;*/
      margin-right: 6px;
    }

    .vis-item.recording {
      background-color: #1565C0;
    }

    .vis-item.recording.vis-selected {
      background-color: #1E88E5;
      border-color: #90CAF9;
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

    .vis-item.vis-selected {
      border: 1px solid white;
      /*background-color: lightgreen;*/
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
