<template>
  <div>
    <!-- timeline -->
    <timeline
      v-if="!!streamId && currentConversions && recordingItems.length"
      ref="timeline"
      :items="allItems"
      :options="options"
      :groups="groups"
      @doubleClick="(e, i, o) => { doubleClick(e, i, o) }"
      @select="(items, e) => { selected(items) }"
      @timechanged="endSelected($event)"
      @mouseOver="mouseOver($event)"
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

  name: 'TheTimeline',

  data () {
    return {
      timeline: null,
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
      'dvrRange',
      'selectedStream'
    ]),
    ...mapState([
      'dvrStart',
      'videoTime',
      'streamId',
      'sceneChanges',
      'userSettings'
    ]),

    groups () {
      return [
        ...this.sceneChangesGroup,
        {
          id: 'recordings',
          content: 'Grabación',
          className: 'recordings'
        },
        {
          id: 'conversions',
          content: 'Conversiones',
          className: 'conversions'
        },
        {
          id: 'videos',
          content: 'Videos',
          className: 'videos'
        }
      ]
    },

    sceneChangesGroup () {
      if (this.userSettings.showSceneChanges) {
        return [{
          id: 'sceneChanges',
          content: '',
          className: 'sceneChanges'
        }]
      } else {
        return []
      }
    },

    dvrStore () {
      return this.$store.getters.selectedStoreDetails
    },

    options () {
      return {
        editable: {
          add: true,
          updateTime: true
        },
        selectable: true,
        multiselect: true,
        multiselectPerGroup: true,
        stackSubgroups: false,
        stack: false,
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

          this.currentBar = null
          this.endBar = null
          this.startBar = null

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
        // onMoving: (item, callback) => {
        //   // if (this.timeline.getSelection() !== [item.id]) {
        //   // this.timeline.setSelection(item.id, {
        //   //   focus: false
        //   // })
        //   // }
        //   callback(item)
        //   // if (this.dvrAvailableMin.isBefore(item.start) && this.dvrAvailableMax.isAfter(item.end)) {
        //   //   callback(item)
        //   // } else {
        //   //   callback(null)
        //   // }
        // },
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
          followMouse: true
          // overflowMethod: 'cap'
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
        ...this.recordingItems,
        ...this.sceneChangeItems
      ]
    },

    videoItems () {
      return []
    },

    sceneChangeItems () {
      if (this.userSettings.showSceneChanges) {
        const range = moment.range(
          moment(this.dvrStart).subtract(this.userSettings.sceneChangeOffset, 'seconds'),
          moment(this.dvrStart)
          .add(moment.duration(this.dvrDuration, 'seconds'))
          .add(this.userSettings.sceneChangeOffset, 'seconds')
        )
        return this.sceneChanges.filter(change => {
          return range.contains(moment(change.time)) && change.value >= this.userSettings.sceneChangeMinValue
        }).map(change => {
          return {
            id: 'change_' + change.id,
            start: change.time,
            content: '',
            group: 'sceneChanges',
            className: 'sceneChange',
            type: 'point',
            editable: false
          }
        })
      } else {
        return []
      }
    },

    conversionItems () {
      return this.currentConversions
      .filter(conv => this.dvrAvailableMin.isBefore(conv.start))
      .map(conv => {
        return {
          id: 'conv_' + conv.id,
          start: conv.start,
          end: conv.end,
          content: conv.status === 'STARTED'
            ? Math.round(conv.progress * 100) + '%'
            : conv.duration.format('HH:mm:ss') + ' ' + conv.id,
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
          id: 'block_' + store.dvrStoreName,
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

    doubleClick (e) {
      if (e.what === 'axis') {
        if (this.dvrRange.contains(moment(e.time))) { // inside currently playing video
          // console.log('no')
          this.$store.commit('SET_SEEK_TO', moment(e.time).diff(moment(this.dvrStart), 'seconds'))
        } else { // outside of playing video
          const seekOffset = 60
          this.$store.commit('SET_DVRSTART', moment(e.time).subtract(seekOffset, 'seconds'))
          this.$nextTick().then(() => {
            this.$store.commit('SET_SEEK_TO', seekOffset)
          })
        }
      } else if (e.item === 'recording-dvr') {
        this.timeline.focus(e.item)
      }
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
          this.currentBar = time
          this.timeline.addCustomTime(time, 'current')
        } else {
          this.timeline.setCustomTime(time, 'current')
        }
        // this.timeline.setCurrentTime(time)
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

    .vis-item.sceneChange {
      background-color: white;
      width: 1px;
      border:none;
      stroke-width: 0;
      stroke: unset;
      height: 5px;
      opacity: 1;
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

    .vis-item.conversion.vis-selected {
      border-color: #90CAF9;
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

    .vis-group.sceneChanges {
      min-height: 6px;
      border: none;
    }

    /*.vis-group.conversions {
      min-height: 120px;
    }*/

</style>
