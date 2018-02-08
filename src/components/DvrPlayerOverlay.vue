<template>
  <div
    ref="overlays"
    class="video-overlays"
  >
    <Drag
      @drag="overlayDragging('start', ...arguments)"
      @dragend="overlayDragged('start', ...arguments)"
      :class="{ dragging: !!overlayStartDragged }"
      class="start"
    >
      <v-icon large slot="image">move</v-icon>
      <div
        @click="overlayClicked('start')"
        @dblclick="overlayDblClicked('start')"
      >
        <span>{{ formattedStart }}</span>
        <VideoThumbnail :date="overlayStartDate" />
      </div>
    </Drag>
    <div class="current" style="background: none; border:none;">
      <span>{{ formattedCurrentTime }}</span>
      <transition name="fade">
        <VideoThumbnail
          v-if="hoverTime"
          :date="overlayCurrentDate"
          :width="300"
        />
      </transition>
    </div> 
    <Drag
      @drag="overlayDragging('end', ...arguments)"
      @dragend="overlayDragged('end', ...arguments)"
      :class="{ dragging: !!overlayEndDragged }"
      class="end"
    >
      <v-icon large slot="image">move</v-icon>
      <div
        @click="overlayClicked('end')"
        @dblclick="overlayDblClicked('end')"
      >
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
      'videoTime'
    ]),

    ...mapGetters([
      'dvrStart'
    ]),

    formattedStart () {
      return moment.duration(this.overlayStartDragged, 'seconds').format('HH:mm:ss', { trim: false })
    },

    formattedCurrentTime () {
      const [hover, current, dragStart, dragEnd, duration] = [this.hoverTime, this.videoTime, this.overlayStartDragged, this.overlayEndDragged, this.duration]
      return moment
        .duration(hover || (dragStart && (duration + dragStart)) || (dragEnd && (duration + dragEnd)) || current || 0, 'seconds')
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
      if (x && offsetX) { // x -> relative to screen, possitiveZ, offsetX -> relative to element, can be negative
        const time = (offsetX / this.$refs.overlays.offsetWidth) * this.duration
        const prop = (side === 'start') ? 'overlayStartDragged' : 'overlayEndDragged'
        this.$set(this, prop, time)
      }
    },

    overlayDragged (side) {
      if (this.overlayStartDragged || this.overlayEndDragged) {
        const time = side === 'start' ? this.overlayStartDragged : this.overlayEndDragged
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
      const factor = (side === 'start') ? -1 : 1
      this.$emit('truncate', factor * this.videoTime)
    }
  },

  components: {
    Drag,
    VideoThumbnail
  }
}
</script>

<style>
.video-wrapper:hover .video-overlays {
    opacity: 1;
    -webkit-transition: opacity 1s ease-in-out;
    -moz-transition: opacity 1s ease-in-out;
    transition: opacity 1s ease-in-out;
  }

  .video-overlays {
    position: absolute;
    top: 0;
    width: 100%;
  }

  .video-overlays > div {
    opacity: 0.85;
    letter-spacing: 2px;
    width: 100px;
    margin: 1px;
    padding: 0 4px;
  }

  .video-overlays .start.dragging {
    width: 300px;
    text-align: left;
  }

  .video-overlays .end.dragging img {
    margin-left: -200px;
    /*text-align: right;*/
    width: 300px;
    /*overflow: visible !important;*/
    /*z-index: 1000 !important;*/
  }

  .video-overlays .current {
    width: 300px;
    z-index: 2;
  }


  .video-overlays > div,
  .video-overlays .current span,
  .video-overlays .current img {
    background-color: #333;
    text-align: center;
    border: 1px solid #666;
    display: block;
  }

  .video-wrapper .video-overlays {
    opacity: 0.65;
    -webkit-transition: opacity 1.2s ease-in-out;
    -moz-transition: opacity 1.2s ease-in-out;
    transition: opacity 1.2s ease-in-out;
  }

  .video-overlays .current span {
    border-bottom: none;
  }

  .video-overlays .current img {
    border-top: none;
    padding: 5px;
  }
  
  .video-overlays > div.start {
    position: absolute;
    left: 0;
  }

  .video-overlays > div.current {
    margin-right: auto;
    margin-left: auto;
    display: block;
  }

  .video-overlays > div.end {
    position: absolute;
    right: 0;
    top: 0;
    float: right;
  }
</style>