<template>
  <v-card-actions>
    <v-spacer />
    <v-btn icon
      :disabled="!canExpandStart"
      @click="expandDuration(-10*60)"
    >&lt; 60</v-btn>
    <v-btn icon
      :disabled="!canExpandStart"
      @click="expandDuration(-5)"
    >&lt; 5</v-btn>
    <v-btn style="min-width: 40px" small
      :disabled="!videoSource || Math.floor(videoTime) === 0"
      @click="truncatePosition('start')"
    ><v-icon dark>subdirectory_arrow_right</v-icon></v-btn>
    <v-btn style="min-width: 40px" small
      :disabled="!videoSource || !videoTime"
      @click.native="rewind"
    ><v-icon dark>fast_rewind</v-icon></v-btn>

    <v-btn dark fab color="default" small 
      v-if="!playing"
      @click="$store.commit('SET_PLAYING', false)" 
      :disabled="!videoSource"
    >
      <v-icon dark v-if="videoTime >= dvrDuration">replay</v-icon>
      <v-icon dark v-else >play_arrow</v-icon>
    </v-btn>
    <v-btn dark fab color="default" small
      v-else
      @click="$emit('pause')"
      :disabled="!videoSource"
    >
      <v-icon dark>pause</v-icon>
    </v-btn>

    <v-btn small
      :disabled="!videoSource || Math.floor(videoTime) >= dvrDuration"
      @click="$emit('forward')"
      style="min-width: 40px"
    ><v-icon dark>fast_forward</v-icon></v-btn>
    <v-btn small
      :disabled="Math.floor(videoTime) >= dvrDuration || !videoTime"
      @click="$emit('expandDuration', { side: 'end' })"
      style="min-width: 40px"
    ><v-icon dark>subdirectory_arrow_left</v-icon></v-btn>
    <v-btn icon
      @click="$emit('expandDuration', +5)"
      :disabled="!videoSource || !canExpandEnd"
    >5 &gt;</v-btn>
    <v-btn icon
      @click="$emit('expandDuration', +60)"
      :disabled="!videoSource || !canExpandEnd"
    >60 &gt;</v-btn>
<!--     <v-select
      :items="expandOptionsEnd"
      label="Expandir"
      dense
      segmented
    ></v-select> -->

    <v-spacer />
  </v-card-actions>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'DvrPlayerControls',

  data () {
    return {
      expandOptionsEnd: [
        { text: ' 5 seg >>', callback: () => console.log('a') },
        { value: +60, text: ' 1 min >>' }
      ]
    }
  },

  computed: {
    ...mapState([
      'videoTime',
      'playing'
    ]),
    ...mapGetters([
      'videoSource',
      'dvrDuration'
    ]),

    canExpandStart () {
      return this.videoSource && this.videoTime < 5
    },

    canExpandEnd () {
      return this.videoTime && (Math.ceil(this.videoTime) + 5 >= Math.floor(this.dvrDuration))
    }
  }
}
</script>    