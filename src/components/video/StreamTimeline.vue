<template>
  <v-container fluid class="ma-0 pa-0">
    <v-layout row wrap>
      <v-flex xs12>
      <timeline
        v-if="currentConversions.length"
        ref="timeline"
        :items="items"
        :options="options"
        :groups="groups"
        @doubleClick="(e) => setDvr(e, true)"
        @click="(e) => setDvr(e, false)"
      >
      </timeline>
      </v-flex>
    </v-layout>
  </v-container>
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
require('../../../node_modules/vis/dist/vis.css')

export default {
  name: 'StreamTimeline',

  data () {
    return {
      groups: [
        { id: 'conversions', content: 'Conversiones' }
      ]
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
        }
      }
    },

    items () {
      // console.log('sss', this.conversions)
      return this.currentConversions.map(conv => {
        return {
          id: conv.id,
          start: conv.start,
          end: conv.end,
          content: conv.dvr_store,
          group: 'conversions'
        }
      })
    }
  },

  watch: {
    dvrStart (value) {
      if (value) {
        this.$refs.timeline.setCurrentTime(value)
        this.$refs.timeline.moveTo(value)
      }
    }
  },

  methods: {
    ...mapActions([
    ]),

    setDvr (event, doubleClick) {
      if (event.item) {
        const item = this.currentConversions.find(conv => conv.id === event.item)
        this.$store.dispatch('setDvr', item)
        this.$refs.timeline.setCurrentTime(item.start)
      } else if (doubleClick) {
        this.$refs.timeline.setCurrentTime(event.time)
        this.$store.commit('SET_DVRSTART', event.time)
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
  .vis-item {
    border-color: orange;
    background-color: yellow;
  }
  .vis-timeline {
    border-color: #666;
  }
  .vis-text {
    color: #ccc;
  }
  .vis-label {
    color: #ccc;
  }
  .vis-time-axis .vis-text {
    color: #ccc;
  }
  .vis-time-axis .grid.vis-odd {
    background: yellow;
  }
</style>
