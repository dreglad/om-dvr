<template>
  <div style="width: 350px">
  <v-select
    v-if="streams"
    label="Stream"
    :items="streams"
    v-model="selectedStream"
    prepend-icon="videocam"
    solo
  />
  <v-progress-circular v-else indeterminate />
</div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'

export default {
  name: 'StreamSelector',

  computed: {
    ...mapGetters([
      'streams'
    ]),
    ...mapState([
      'stream'
    ]),
    selectedStream: {
      get () {
        return this.stream
      },
      set (value) {
        this.selectStream(value)
      }
    }
  },

  methods: {
    ...mapActions([
      'selectStream'
    ])
  }
}
</script>
