<template>
  <div>
    <!-- timeline -->
    <timeline
      v-if="!!streamId && currentConversions && fragmentItems.length"
      ref="timeline"
      :items="allItems"
      :options="options"
      :groups="groups"
      @doubleClick="(e, i, o) => { doubleClick(e, i, o) }"
      @select="(items, e) => { selected(items) }"
      @delete="(items, e) => { deleted(item) }"
      @timechanged="endSelected($event)"
      @mouseOver="mouseOver($event)"
    />
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

export default {

  name: 'DvrTimeline',

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
      'dvrStart',
      'dvrDuration',
      'dvrAvailableMax',
      'dvrAvailableMin',
      'videoSource',
      'dvrRange',
      'selectedStream',
      'activeItem'
    ]),
    ...mapState([
      'videoTime',
      'streamId',
      'sceneChanges',
      'userSettings',
      'fragments'
    ]),

    groups () {
      return [
        ...this.sceneChangesGroup,
        {
          id: 'fragments',
          content: 'Fragentos',
          className: 'fragments'
        },
        {
          id: 'conversions',
          content: 'Conversiones',
          className: 'conversions'
        },
        ...this.multimediaClipsGroup,
        ...this.multimediaProgramasGroup
      ]
    },

    sceneChangesGroup () {
      if (!this.userSettings.showSceneChanges) return []
      return [{
        id: 'sceneChanges',
        content: '',
        className: 'sceneChanges'
      }]
    },

    multimediaClipsGroup () {
      if (!this.userSettings.showMultimediaClips) return []
      return [{
        id: 'multimedia-clips',
        content: 'Multimedia Clips',
        className: 'multimedi-clips'
      }]
    },

    multimediaProgramasGroup () {
      if (!this.userSettings.showMultimediaProgramas) return []
      return [{
        id: 'multimedia-programas',
        content: 'Multimedia Programas',
        className: 'multimedia-programas'
      }]
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
        stackSubgroups: true,
        stack: true,
        configure: false,
        groupEditable: true,
        max: moment(this.dvrAvailableMax).add(15, 'minutes'),
        min: moment(this.dvrAvailableMin).subtract(1, 'hours'),
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

          if (this.fragmentItems) {
            this.timeline.focus(this.fragmentItems.map(i => i.id))
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
          console.log(item, 'addding...')
          item.className = 'fragment'
          item.group = 'fragments'
          item.end = moment(item.start).add(15, 'minutes')
          const duration = moment(item.end).diff(item.start, 'seconds', true)
          this.$store.commit('ADD_FRAGMENT', { start: item.start, duration })
          callback(null)
        },
        onRemove: (item, callback) => {
          console.log('siii', item)
          this.$store.commit('DELETE_FRAGMENT', item.fragment)
          callback(null)
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
            // callback(null)
            callback(item)
          }
        },
        tooltip: {
          followMouse: false,
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
        ...this.fragmentItems,
        ...this.sceneChangeItems,
        ...this.multimediaClipItems,
        ...this.multimediaProgramaItems
      ]
    },

    videoItems () {
      return []
    },

    multimediaClipItems () {
      if (!this.userSettings.showMultimediaClips) return []
      return this.$store.state.multimediaItems
        .filter(clip => {
          return clip.tipo.slug !== 'programa' && moment(clip.fecha).isAfter(moment(this.dvrAvailableMin).subtract(1, 'hours'))
        })
        .map(clip => {
          return {
            id: `multimedia-clip-${clip.id}`,
            type: 'point',
            start: moment(clip.fecha),
            content: '<img style="vertical-align: middle;" src="' + clip.thumbnail_pequeno + '" width="40">',
            title: clip.titulo || '',
            group: 'multimedia-clips',
            limitSize: true
          }
        })
    },

    multimediaProgramaItems () {
      if (!this.userSettings.showMultimediaProgramas) return []
      return this.$store.state.multimediaItems
        .filter(clip => {
          return clip.tipo.slug === 'programa' && moment(clip.fecha).isAfter(moment(this.dvrAvailableMin).subtract(1, 'hours'))
        })
        .map(clip => {
          return {
            id: `multimedia-programa-${clip.id}`,
            type: 'point',
            start: moment(clip.fecha),
            content: '<img style="vertical-align: middle;" src="' + clip.programa.imagen_url + '" width="40">',
            title: clip.titulo || clip.programa.nombre,
            group: 'multimedia-programas',
            limitSize: true
          }
        })
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
          group: 'fragments',
          className: 'store',
          subgroup: store.dvrStoreName,
          content: 'Bloque ' + store.dvrStoreName.split('.').pop()
        }
      })
    },

    fragmentItems () {
      return this.fragments.map(frag => {
        const index = this.fragments.indexOf(frag)
        return {
          fragment: frag,
          id: index,
          start: frag.start,
          subgroup: this.dvrStore.dvrStoreName,
          end: moment(frag.start).add(moment.duration(frag.duration, 'seconds')),
          editable: { updateTime: true, remove: this.fragments.length > 1, add: true },
          className: 'fragment' + (frag === this.activeItem ? ' active' : ''),
          content: `Fragmento ${index + 1}`,
          group: 'fragments'
          // title: 'nueva'
        }
      })
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
      } else if (e.item === 'fragment-dvr') {
        this.timeline.focus(e.item)
      }
    },

    itemTooltip (item) {
      if (this.selectedStream) {
        return (
          `<img src="${backend.getThumbnailUrl(this.selectedStream, item.start)}" class="tooltip start" />` +
          `<img src="${backend.getThumbnailUrl(this.selectedStream, item.end)}" class="tooltip end" />`
        )
      }
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
      this.$nextTick(() => {
        if (this.videoSource && this.timeline) {
          // timeline.setCurrentTime(this.dvrStart)
          const { start, end } = this.timeline.getWindow()
          if (!moment.range(start, end).contains(this.dvrStart)) {
            // this.timeline.moveTo(this.dvrStart)
            this.timeline.focus(this.fragmentItems.map(i => i.id))
          }
          this.setTimeBars()
        }
      })
    },

    watchVideoTime () {
      this.$nextTick(() => {
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
      })
    },

    selected ({ items }) {
      console.log('selected', items)
      if (items.length === 1) {
        this.$store.commit('SET_DVRITEM', this.$store.state.fragments[items[0]])
      }
    },

    endSelected ({ id, time }) {
      if (id === 'end') {
        this.$store.dispatch('setDvrDuration', moment(time).diff(this.dvrStart, 'seconds', true))
        // this.$store.commit('SET_DVRDURATION', )
      } else if (id === 'start') {
        this.$store.dispatch('setDvr', {
          start: moment(time),
          duration: this.dvrDuration + moment(this.dvrStart).diff(moment(time), 'seconds', true)
        })
      }
    },
    // focusItem (what) {
    //   if (item && this.timeline) {
    //     this.timeline.focus(this.fragmentItems)
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

    .vis-item.fragment {
      background-color: #1565C0;
    }

    .vis-item.fragment.vis-selected {
      background-color: #1E88E5;
      border-color: #90CAF9;
    }

    .vis-item.fragment.active {
      background-color: #039BE5;
      border-color: black;
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

    .vis-point .vis-item-content {
      color: white;
      font-size: 12px;
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