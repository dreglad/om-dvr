<template>
  <div
    @click="clicked"
    @dblclick="dblClicked"
    @mousemove="hover"
    @mouseout="$emit('hover', null)"
    class="progressbar-wrapper"
  >
    <v-progress-linear
      :height="20"
      v-model="progress"
      :buffer-value="bufferValue"
      buffer
      class="pa-0 ma-0"
    />
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'VideoProgressBar',

  props: {
    duration: Number,
    currentTime: {
      type: Number,
      default: 0
    },
    buffer: {
      type: Number,
      default: 0
    }
  },

  computed: {
    progress () {
      return 100 * (this.currentTime / this.duration)
    },

    bufferValue () {
      return (this.buffer / this.duration) * 100
    }
  },

  methods: {
    clicked ({ offsetX, currentTarget: { offsetWidth } }) {
      // console.log(this.duration)
      this.$emit('seek', (offsetX / offsetWidth) * this.duration)
    },
    dblClicked ({ offsetX, currentTarget: { offsetWidth } }) {
      this.$emit('dblClicked', (offsetX / offsetWidth) * this.duration)
    },
    hover ({ offsetX, currentTarget: { offsetWidth } }) {
      // this.emitHover((offsetX / offsetWidth) * this.duration)
      this.$emit('hover', (offsetX / offsetWidth) * this.duration)
    },
    emitHover: _.debounce(function (val) {
      console.log(val)
      this.$emit('hover', val)
    }, 50)
  }
}
</script>

<style>
  .progressbar-wrapper {
    position: absolute;
    bottom: 0;
    z-index: 1;
    cursor: pointer;
    background-color: #555;
    width: 100%;
    height: 20px;
  }
</style>