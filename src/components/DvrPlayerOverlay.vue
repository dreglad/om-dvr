<template>
  <div
    ref="overlays"
    class="video-overlays"
  >
    <Drag
      @drag="overlayDragging('start', ...arguments)"
      @dragend="overlayDragged('start', ...arguments)"
      class="start"
    >
      <v-icon large slot="image">move</v-icon>
      <div
        @dblclick="overlayDblClicked('start')"
        @click="overlayClicked('start')"
        class="elevation-7"
      >
        <span>{{ formattedStart }}</span>
        <VideoThumbnail :date="overlayStartDate" />
      </div>
    </Drag>
    <div class="current" style="background: none; border:none;">
      <span>{{ formattedCurrentTime }}</span>
      <transition name="fade">
        <VideoThumbnail :width="200" v-if="hoverTime" :date="overlayCurrentDate" />
      </transition>
    </div> 
    <Drag
      class="end"
      @drag="overlayDragging('end', ...arguments)"
      @dragend="overlayDragged('end', ...arguments)"
    >
      <v-icon large slot="image">move</v-icon>
      <div @dblclick="overlayDblClicked('end')" @click="overlayClicked('end')">
        <span>{{ formattedDuration }}</span>
        <VideoThumbnail :date="overlayEndDate" />
      </div>
    </Drag>
  </div>
</template>

<script>
import VideoThumbnail from './VideoThumbnail'
import { mapGetters, mapState } from 'vuex'
import { Drag } from 'vue-drag-drop'
import moment from 'moment'
require('moment-duration-format')

export default {
  name: 'DvrPlayerOverlay',

  data () {
    return {
      overlayStartDragged: 0,
      overlayEndDragged: 0,
      clickTimer: 0
    }
  },

  props: ['duration'],

  computed: {
    ...mapState([
      'hoverTime',
      'videoTime',
      'dvrItem'
    ]),

    ...mapGetters([
      'dvrStart'
    ]),

    formattedStart () {
      return moment
        .duration(this.overlayStartDragged, 'seconds')
        .format('HH:mm:ss', { trim: false })
    },

    formattedCurrentTime () {
      const [hover, current] = [this.hoverTime, this.videoTime]
      return moment
        .duration(hover || current || 0, 'seconds')
        .format('HH:mm:ss', { trim: false })
    },

    formattedDuration () {
      return moment
        .duration(this.duration + this.overlayEndDragged - this.overlayStartDragged, 'seconds')
        .format('HH:mm:ss', { trim: false })
    },

    overlayStartDate () {
      return moment(this.dvrStart).add(this.overlayStartDragged, 'seconds')
    },

    overlayCurrentDate () {
      const [hover, current] = [this.hoverTime, this.videoTime]
      return moment(this.dvrStart).add(hover || current || 0, 'seconds')
    },

    overlayEndDate () {
      return moment(this.dvrStart).add(this.duration + this.overlayEndDragged, 'seconds')
    }
  },

  methods: {
    overlayDragging (side, transferData, { offsetX, x }) {
      if (x && offsetX) {
        // x -> relative to screen, possitiveZ
        // offsetX -> relative to element, can be negative
        const time = (offsetX / this.$refs.overlays.offsetWidth) * this.duration
        const prop = (side === 'start') ? 'overlayStartDragged' : 'overlayEndDragged'
        this.$set(this, prop, time)
      }
    },

    overlayDragged (side) {
      if (this.overlayStartDragged || this.overlayEndDragged) {
        const time = side === 'start' ? this.overlayStartDragged : this.overlayEndDragged
        console.log('commiting', time)
        if (side === 'start' && time < 0) {
          this.$emit('expand', time)
        } else {
          if (side === 'start') {
            this.$emit('truncate', -time)
          } else {
            this.$emit('truncate', this.duration + time)
          }
        }
        // reset drags
        this.overlayStartDragged = 0
        this.overlayEndDragged = 0
      }
    },

    overlayClicked (side) {
      this.clickTimer = setTimeout(() => {
        if (!this.clickPrevent) {
          side === 'start'
            ? this.$emit('rewind')
            : this.$emit('forward')
        }
        this.clickPrevent = false
      }, 200)
    },

    overlayDblClicked (side) {
      clearTimeout(this.clickTimer)
      this.clickPrevent = true
      this.truncatePosition(side)
    }
  },

  components: {
    Drag,
    VideoThumbnail
  }
}
</script>