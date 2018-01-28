<template>
  <v-card-actions>
    <v-spacer />
    <v-btn icon
       class="hidden-sm-and-down"
      :disabled="!canExpandStart"
      @click="() => { $emit('expand', -10 * 60) }"
    >&lt; 60</v-btn>
    <v-btn icon
      class="hidden-sm-and-down"
      :disabled="!canExpandStart"
      @click="() => { $emit('expand', -5) }"
    >&lt; 5</v-btn>
    <v-btn style="min-width: 52px" small
      :disabled="!videoSource || Math.floor(videoTime) === 0"
      @click="() => { $emit('truncate', -videoTime) }"
    ><v-icon dark>subdirectory_arrow_right</v-icon></v-btn>
    <v-btn style="min-width: 52px" small
      :disabled="!videoSource || !videoTime"
      @click.native="() => { $emit('rewind') }"
    ><v-icon dark>fast_rewind</v-icon></v-btn>

    <v-btn dark fab color="default" small 
      v-if="!playing"
      @click="() => { $emit('play') }" 
      :disabled="!videoSource"
    >
      <v-icon dark v-if="videoTime >= duration">replay</v-icon>
      <v-icon dark v-else >play_arrow</v-icon>
    </v-btn>
    <v-btn dark fab color="default" small
      v-else
      @click="() => { $emit('pause') }"
      :disabled="!videoSource"
    >
      <v-icon dark>pause</v-icon>
    </v-btn>

    <v-btn small
      :disabled="!videoSource || Math.floor(videoTime) >= duration"
      @click="() => { $emit('forward') }"
      style="min-width: 52px"
    >
      <v-icon dark>fast_forward</v-icon>
    </v-btn>
    <v-btn small
      :disabled="Math.floor(videoTime) >= duration || !videoTime"
      @click="() => { $emit('truncate', videoTime) }"
      style="min-width: 52px"
    >
      <v-icon dark>subdirectory_arrow_left</v-icon>
    </v-btn>
    <v-btn icon class="hidden-sm-and-down"
      @click="() => { $emit('expand', +5) }"
      :disabled="!videoSource || !canExpandEnd"
    >
      5 &gt;
    </v-btn>
    <v-btn icon class="hidden-sm-and-down"
      @click="() => { $emit('expand', +60) }"
      :disabled="!videoSource || !canExpandEnd"
    >
      60 &gt;
    </v-btn>

    <v-spacer />
  </v-card-actions>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'DvrPlayerControls',

  props: {
    duration: Number
  },

  computed: {
    ...mapState([
      'videoTime',
      'playing'
    ]),

    ...mapGetters([
      'videoSource'
    ]),

    canExpandStart () {
      return (this.videoTime || 0) < 5
    },

    canExpandEnd () {
      return this.videoTime && this.videoTime > 5
    }
  }
}
</script>    