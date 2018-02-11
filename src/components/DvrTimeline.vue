<template>
  <div>
    <!-- timeline -->
    <VisTimeline
      v-if="selectedStream && videos.length"
      ref="timeline"
      :items="allItems"
      :options="options"
      :groups="groups"
      @doubleClick="(e, i, o) => { doubleClick(e, i, o) }"
      @select="(items, e) => { selected(items) }"
      @delete="(items, e) => { deleted(item) }"
      @timechanged="endSelected($event)"
    />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import VisTimeline from './VisTimeline'
import backend from '@/api/backend'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)
require('moment-duration-format')

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

  activated () {
    this.$nextTick(() => {
      if (this.$refs.timeline) {
        this.$refs.timeline.redraw()
      }
    })
  },

  computed: {
    ...mapGetters([
      'dvrStart',
      'dvrDuration',
      'dvrAvailableMax',
      'dvrAvailableMin',
      'videoSource',
      'dvrRange',
      'selectedStream',
      'selectedVideo',
      'activeItem',
      'videos'
    ]),
    ...mapState([
      'videoTime',
      'streamId',
      'sceneChanges',
      'userSettings',
      'fragments',
      'dvrStoreDetails',
      'videos',
      'videoId',
      'playerMode'
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
          id: 'videos',
          content: 'Videos',
          className: 'videos'
        },
        ...this.multimediaClipsGroup,
        ...this.multimediaProgramasGroup
      ]
    },

    sceneChangesGroup () {
      if (!this.userSettings.showSceneChanges) return []
      return [{
        id: 'scene-changes',
        content: '',
        subgroupStack: false,
        className: 'scene-changes'
      }]
    },

    multimediaClipsGroup () {
      if (!this.userSettings.showMultimediaClips) return []
      return [{
        id: 'multimedia-clips',
        content: 'Multimedia<br>Clips',
        className: 'multimedia-clips'
      }]
    },

    multimediaProgramasGroup () {
      if (!this.userSettings.showMultimediaProgramas) return []
      return [{
        id: 'multimedia-programas',
        content: 'Multimedia<br>Programas',
        className: 'multimedia-programas'
      }]
    },

    options () {
      return {
        editable: {
          add: false,
          updateTime: true
        },
        // align: 'center',
        selectable: true,
        multiselect: false,
        multiselectPerGroup: false,
        // stackSubgroups: true,
        stack: true,
        configure: false,
        groupEditable: true,
        max: moment(this.dvrAvailableMax).add(5, 'minutes'),
        min: moment(this.dvrAvailableMin).subtract(1, 'days'),
        itemsAlwaysDraggable: true,
        // zoomMin: 100000,
        zoomMax: 86400000,
        showCurrentTime: false,
        orientation: {
          axis: 'both'
        },
        snap: null,
        margin: {
          item: {
            horizontal: 0
          }
        },
        moment: moment,
        onInitialDrawComplete: () => {
          this.timeline = this.$refs.timeline

          this.currentBar = null
          this.endBar = null
          this.startBar = null

          this.focusItem()

          this.setTimeBars()

          this.$watch('videoTime', this.watchVideoTime)

          // if (this.fragmentItems) {
          //   this.timeline.focus(this.fragmentItems.map(i => i.id), { animation: false })
          // }
        },
        // onUpdate: (item, callback) => {
        //   if (this.timeline.getSelection() !== [item.id]) {
        //     this.timeline.setSelection(item.id, {
        //       focus: true
        //     })
        //   }
        //   callback(item)
        // },
        // onAdd: (item, callback) => {
        //   console.log(item)
        //   if (item.group === 'fragments') {
        //     item.className = 'fragment'
        //     item.end = moment(item.start).add(15, 'minutes')
        //     const duration = moment(item.end).diff(item.start, 'seconds', true)
        //     this.$store.commit('ADD_FRAGMENT', { start: item.start, duration })
        //   }
        //   callback(null)
        // },
        onRemove: (item, callback) => {
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
          callback(item)
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
        ...this.storeBackgroundItems,
        ...this.fragmentItems,
        ...this.sceneChangeItems,
        ...this.multimediaClipItems,
        ...this.multimediaProgramaItems
      ]
    },

    videoItems () {
      return this.videos.map(video => {
        return {
          id: `video_${video.id}`,
          start: moment(video.start),
          end: moment(video.end),
          type: 'range',
          group: 'videos',
          className: `video ${video.status} ${this.playerMode === 'video' && video.id === this.videoId ? 'vis-selected' : ''}`,
          selectable: true,
          editable: false,
          content: video.status === 'STARTED'
            ? Math.round(video.progress * 100) + '%'
            : `<div><img style="float: left; opacity: 0.3; display: block; position:absolute; padding-top:2px;" height="21" src="${backend.getThumbnailUrl(this.selectedStream, moment(video.start))}"><img style="float: right; opacity: 0.3; display: block; padding-top:2px;" height="21" src="${backend.getThumbnailUrl(this.selectedStream, moment(video.end))}"><div style="margin: 0 auto; text-align: center">${video.metadata.title || video.id}</div></div>`
        }
        // {
        //     id: 'conv_' + conv.id,
        //     start: conv.start,
        //     end: conv.end,
        //     content: conv.status === 'STARTED'
        //       ? Math.round(conv.progress * 100) + '%'
        //       : conv.duration.format('HH:mm:ss') + ' ' + conv.id,
        //     group: 'conversions',
        //     className: `conversion ${conv.status}`,
        //     editable: false,
        //     selectable: true
        //   }
      })
    },

    multimediaClipItems () {
      if (!this.userSettings.showMultimediaClips) return []
      return this.$store.state.multimediaItems
        .filter(clip => {
          return clip.tipo.slug !== 'programa' && moment(clip.fecha).isAfter(moment(this.dvrAvailableMin).subtract(1, 'hours'))
        })
        .map(clip => {
          return {
            id: `multimedia-clip_${clip.id}`,
            type: 'point',
            start: moment(clip.fecha),
            content: `<a target="_blank" href="http://captura-telesur.openmultimedia.biz/admin/clips/clip/${clip.id}/"><img style="vertical-align: middle;" src="${clip.thumbnail_pequeno}" height="20" width="35"></a>`,
            title: clip.titulo || 'Agregado por: ' + clip.usuario_creacion,
            selectable: false,
            group: 'multimedia-clips',
            limitSize: true,
            editable: false,
            className: 'multimedia-clip ' + (clip.publicado ? 'published' : 'unpublished')
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
          const img = clip.programa ? clip.programa.imagen_url.replace('300x300', '40x40') : clip.thumbnail_pequeno.replace('160x120', '40x40')
          return {
            id: `multimedia-programa_${clip.id}`,
            type: 'point',
            start: moment(clip.fecha),
            content: `<a target="_blank" href="http://captura-telesur.openmultimedia.biz/admin/clips/clip/${clip.id}/"><img style="vertical-align: middle;" src="${img}" height="20" width="35"></a>`,
            title: clip.titulo || (clip.programa && clip.programa.nombre) || clip.id,
            selectable: false,
            group: 'multimedia-programas',
            limitSize: true,
            editable: false,
            className: 'multimedia-programa ' + (clip.publicado ? 'published' : 'unpublished')
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
            id: 'scene-change_' + change.id,
            start: change.time,
            end: change.time + 1,
            content: '',
            group: 'scene-changes',
            subgroup: 'scene-changes',
            className: 'scene-change',
            type: 'background',
            editable: false
          }
        })
      } else {
        return []
      }
    },

    storeBackgroundItems () {
      if (!this.dvrStoreDetails) return []
      return Object.values(this.dvrStoreDetails).map(store => {
        return {
          id: 'block_' + store.dvrStoreName,
          start: moment(store.utcStart, 'x'),
          end: moment(store.utcEnd, 'x'),
          type: 'background',
          group: 'fragments',
          className: 'store',
          content: ''
        }
      })
    },

    fragmentItems () {
      return this.fragments.map(frag => {
        const index = this.fragments.indexOf(frag)
        return {
          fragment: frag,
          id: `fragment_${index}`,
          start: moment(frag.start),
          end: moment(frag.start).add(moment.duration(frag.duration, 'seconds')),
          editable: { updateTime: true, remove: this.fragments.length > 1 },
          className: 'fragment' + (this.playerMode === 'fragment' && frag === this.activeItem ? ' vis-selected' : ''),
          content: `${index + 1}`,
          group: 'fragments'
        }
      })
    }
  },

  methods: {
    focusRange ({ start, end }) {
      this.$nextTick(() => {
        this.timeline.setWindow(moment(start).subtract(5, 'minutes'), moment(end).add(5, 'minutes'))
      })
    },

    bestNewDuration (start) {
      if (this.activeItem) {
        return this.activeItem.duration
      } else {
        return 15 * 1000
      }
    },

    doubleClick (e) {
      console.log('double: ', e)
      if (e.what === 'group-label') {
        switch (e.group) {
          case 'fragments':
            this.$store.commit('SET_PLAYERMODE', 'fragment')
            break
          case 'videos':
            this.$store.commit('SET_PLAYERMODE', 'video')
        }
      }
      if (e.what === 'axis' || e.group === 'scene-changes') {
        if (this.dvrRange.contains(moment(e.time))) { // inside currently playing video
          this.$store.commit('SET_SEEKTO', moment(e.time).diff(moment(this.dvrStart), 'seconds'))
        } else { // outside of playing video
          this.$store.dispatch('setDvr', {
            start: e.time,
            duration: this.activeItem.duration
          })
        }
      } else if (e.group === 'fragments' && e.what === 'background') {
        this.$store.commit('ADD_FRAGMENT', { start: e.time, duration: this.bestNewDuration(e.time) })
      } else if (e.item) {
        let match, start, end
        match = e.item.match(/fragment_(.+)/)
        if (match) {
          const frag = this.fragments[parseInt(match[1])]
          start = moment(frag.start)
          end = moment(frag.start).add(frag.duration, 'seconds')
        }
        match = e.item.match(/video_(.+)/)
        if (match) {
          const video = this.videos.find(video => video.id === parseInt(match[1]))
          start = video.start
          end = video.end
        }
        if (start && end) {
          this.focusRange({ start, end })
        }
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
      this.$nextTick(() => {
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

        if (!this.timeline.getSelection().length) {
          this.timeline.setSelection(this.fragments.indexOf(this.activeItem))
        }
      })
    },

    watchVideoTime () {
      this.$nextTick(() => {
        if (this.timeline && this.playerMode === 'fragment') {
          const time = moment(this.dvrStart).add(moment.duration(this.videoTime, 'seconds'))
          if (!this.currentBar) {
            this.currentBar = time
            this.timeline.addCustomTime(time, 'current')
          } else {
            this.timeline.setCustomTime(time, 'current')
          }
          this.currentBar = time
        }
      })
    },

    selected ({ items }) {
      if (items.length) {
        const m = items[0].match(/(.+)_(\d+)/)
        if (m) {
          const [mode, id] = [m[1], parseInt(m[2])]
          switch (mode) {
            case 'fragment':
              this.$store.commit('SET_DVRITEM', this.fragments[id])
              this.$store.commit('SET_PLAYERMODE', mode)
              break
            case 'video':
              this.$router.push({ name: 'RecorderVideo', params: { videoId: id } })
              break
          }
        }
      } else {
        console.log('deselected')
      }
    },

    endSelected ({ id, time }) {
      if (id === 'end') {
        this.$store.dispatch('setDvrDuration', moment(time).diff(this.dvrStart, 'seconds', true))
      } else if (id === 'start') {
        this.$store.dispatch('setDvr', {
          start: moment(time),
          duration: this.dvrDuration + moment(this.dvrStart).diff(moment(time), 'seconds', true)
        })
      }
    },

    focusItem () {
      this.$nextTick(() => {
        if (this.playerMode === 'fragment' && this.activeItem) {
          const { start, duration } = this.activeItem
          const end = moment(start).add(duration, 'seconds')
          this.timeline.setWindow(moment(start).subtract(5, 'minutes'), moment(end).add(5, 'minutes'))
        } else if (this.playerMode === 'video' && this.selectedVideo) {
          this.timeline.setWindow(
            moment(this.selectedVideo.start).subtract(5, 'minutes'),
            moment(this.selectedVideo.end).add(5, 'minutes')
          )
        }
      })
    }
  },

  watch: {
    playerMode (val, oldVal) {
      if (val && val !== oldVal) {
        this.focusItem()
      }
    },

    videoSource (val, oldVal) {
      this.$nextTick(() => {
        const playerMode = this.playerMode
        if (val && (val !== oldVal) && this.timeline) {
          if (playerMode === 'fragment') {
            this.setTimeBars()
            const { start, end } = this.timeline.getWindow()
            if (!moment.range(start, end).contains(this.dvrRange)) {
              this.focusItem()
            }
          } else if (playerMode === 'video') {
            if (this.startBar) {
              this.startBar = null
              this.timeline.removeCustomTime('start')
            }
            if (this.endBar) {
              this.endBar = null
              this.timeline.removeCustomTime('end')
            }
            if (this.currentBar) {
              this.currentBar = null
              this.timeline.removeCustomTime('current')
            }
            this.focusItem()
          }
        }
      })
    }
  },

  components: {
    VisTimeline
  }
}
</script>

<style>
  .vis-timeline {
    border: none;
    font-size: 11pt;
  }

    .vis-item {
      border: none;
      border: 0px solid grey;
      color: white;
      text-align: center;
      font-weight: bold;
    }

    .vis-foreground .vis-group {
      border-bottom: 1px solid #757575;
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

    .vis-item.scene-change {
      background-color: white;
      width: 1px;
      border: none;
      stroke-width: 0;
      stroke: unset;
      height: 5px;
      opacity: 1;
    }

    .vis-item.fragment {
      background-color: #01579B;
    }

    .vis-item.fragment.vis-selected {
      background-color: #1976d2;
    }

    .vis-item.store {
      opacity: 0.5;
      border: none;
      background-color: #616161;
    }

    .vis-item.video.PENDING.vis-selected,
    .vis-item.video.SUCCESS.vis-selected,
    .vis-item.video.STARTED.vis-selected {
      background-color: #558B2F;
    }

    .vis-item.video.vis-selected img {
      opacity: 0.8 !important;
    }

    .vis-item.video.SUCCESS,
    .vis-item.video.STARTED {
      background-color: #33691E;
    }

    .vis-item.video.FAILURE {
      background-color: red;
    }

    .vis-dot {
      border-width: 1px;
    }

    .vis-dot.multimedia-clip.published,
    .vis-dot.multimedia-programa.published {
      border-color: green;
    }

    .vis-dot.multimedia-clip.unpublished,
    .vis-dot.multimedia-programa.unpublished {
      border-color: red;
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
      color: #757575 !important;
      /*font-size: 70%;*/
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
      border-color: #424242;
    }

    .vis-time-axis .vis-grid.vis-major {
      border-width: 2px;
      border-color: #757575;
    }

    .vis-group.scene-changes {
      height: 6px;
      border: none;
    }
    .vis-labelset .vis-label.scene-changes {
      min-height: 6px;
    }

    .vis-panel.vis-bottom, .vis-panel.vis-center, .vis-panel.vis-left, .vis-panel.vis-right, .vis-panel.vis-top {
      border-color: #757575;
    }

    .vis-labelset .vis-label {
      border-bottom: 1px solid #757575;
    }

    /*.vis-group.videos {
      min-height: 120px;
    }*/

</style>
