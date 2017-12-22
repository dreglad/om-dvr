<template>
  <!-- <v-container fluid class="ma-0 pa-0"> -->
    <!-- <v-layout row wrap> -->
      <!-- <v-flex xs12> -->
      <!-- <v-footer fixed :height="300"> -->
      <timeline
        v-if="currentConversions.length"
        ref="timeline"
        :items="items"
        :options="options"
        :groups="groups"
        @doubleClick="(e) => setDvr(e.item, e.time, true)"
        @click="(e) => setDvr(e, false)"
        @select="(items, e) => selected(items)"
        @timechanged="(e) => endSelected(e)"
      >
      </timeline>
    <!-- </v-footer> -->
      <!-- </v-flex> -->
    <!-- </v-layout> -->
  <!-- </v-container> -->
</template>

<script>
// import _ from 'lodash'
import { mapGetters, mapState, mapActions } from 'vuex'
import { Timeline } from 'vue2vis'
// import Vue from 'vue'
// import vue2vis from 'vue2vis'
import moment from 'moment'
moment.locale('es')
// import { extendMoment } from 'moment-range'
// import vis from 'vis'
// const moment = extendMoment(Moment)

export default {
  name: 'StreamTimeline',

  data () {
    return {
      groups: [
        { id: 'conversions', content: 'Conversiones', className: 'conversions' },
        { id: 'recording', content: 'Grabación', className: 'recording' }
      ],
      endBar: null
    }
  },

  mounted () {
    // const options = {}
    // this.timeline = new vis.Timeline(this.$refs.timeline, this.timeLineItems, options)
  },

  computed: {
    ...mapGetters([
      'currentConversions'
    ]),
    ...mapState([
      'dvrStart'
    ]),

    options () {
      return {
        locale: 'es',
        onInitialDrawComplete: (initial) => {
          if (this.dvrStart) {
            this.$refs.timeline.setCurrentTime(this.dvrStart)
            this.$refs.timeline.moveTo(this.dvrStart)
          }
        },
        onMove: (item) => {
          this.$store.dispatch('setDvr', {
            start: item.start,
            duration: moment(item.end).diff(item.start, 'seconds')
          })
        },
        editable: {
          updateTime: true
        },
        configure: false,
        groupEditable: true,
        max: this.$store.getters.dvrAvailableMax,
        min: this.$store.getters.dvrAvailableMin,
        minHeight: '150px',
        itemsAlwaysDraggable: true,
        zoomMin: 10000,
        zoomMax: 2628000000
      }
    },

    items () {
      return [
        ...this.currentConversions.map(conv => {
          return {
            id: conv.id,
            start: conv.start,
            end: conv.end,
            content: conv.dvr_store,
            group: 'conversions',
            className: conv.status === 'SUCCESS' ? 'green' : 'amber',
            editable: false,
            selectable: true
          }
        }),
        ...this.currentDvrItem
      ]
    },

    currentDvrItem () {
      const duration = this.$store.getters.dvrDuration
      if (this.dvrStart && duration) {
        return [{
          id: '0',
          start: this.dvrStart,
          end: moment(this.dvrStart).add(moment.duration(duration, 'seconds')),
          editable: {
            // add: true,         // add new items by double tapping
            updateTime: true,  // drag items horizontally
            // updateGroup: true, // drag items from one group to another
            remove: true       // delete an item by tapping the delete button top right
            // overrideItems: true  // allow these options to override item.editable
          },
          className: 'blue',
          content: 'Nuevo',
          group: 'current'
        }]
      } else {
        return []
      }
    }

  },

  watch: {
    dvrStart (value) {
      const timeline = this.$refs.timeline
      if (value && timeline) {
        timeline.setCurrentTime(value)
        const { start, end } = timeline.getWindow()
        if (!moment.range(start, end).contains(value)) {
          timeline.moveTo(value)
        }
        const duration = moment.duration(this.$store.getters.dvrDuration, 'seconds')
        const dvrEnd = moment(value).add(duration)
        if (this.endBar) {
          timeline.setCustomTime(dvrEnd, 'end')
        } else {
          timeline.addCustomTime(dvrEnd, 'end')
        }
        this.endBar = dvrEnd
        // if (visible.contains(value)) {
        //   console.log('ius')
        //   // timeline.moveTo(value)
        // }
      }
    }
  },

  methods: {
    ...mapActions([
    ]),

    selected ({ items }) {
      console.log(items)
      this.setDvr(items[0])
    },

    endSelected ({ id, time }) {
      this.$store.commit('SET_DVRDURATION', moment(time).diff(this.dvrStart, 'seconds'))
    },

    move (event) {
      console.log(event)
    },

    setDvr (itemId, time, doubleClick) {
      if (itemId) {
        const item = this.currentConversions.find(conv => conv.id === itemId)
        this.$store.dispatch('setDvr', item)
        this.$refs.timeline.setCurrentTime(item.start)
      } else if (doubleClick) {
        this.$refs.timeline.setCurrentTime(time)
        this.$store.commit('SET_DVRSTART', time)
      }
    },

    log (val) {
      console.log(val)
    }
  },

  components: {
    timeline: Timeline
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
      border-color: white;
      /*background-color: pink;*/
      /*font-size: 15pt;*/
      color: 'black';
      box-shadow: 5px 5px 20px rgba(128,128,128, 0.5);
    }

    .vis-label {
      color: #666 !important;
      /*font-size: 70%;*/
    }

    .vis-item,
    .vis-item.vis-line {
      border-width: 3px;
    }

    .vis-item.vis-dot {
      border-width: 6px;
      border-radius: 6px;
    }

    .vis-item.vis-selected {
      border-color: white;
      background-color: lightgreen;
    }

    .vis-time-axis .vis-text {
      color: grey;
      padding-top: 6px;
      padding-left: 6px;
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

</style>
