<template>
  <div style="min-width: 240px">
  <v-select
    v-if="streams"
    label="Transmisión"
    :items="streams"
    item-text="name"
    item-value="id"
    v-model="stream"
    prepend-icon="videocam"
    light
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
    ...mapState([
      'streams'
    ]),

    ...mapGetters([
      'selectedStream'
    ]),

    stream: {
      get () {
        return this.selectedStream
      },
      set (value) {
        this.selectStream(this.streams.find(stream => stream.id === value))
      }
    }
  },

  created () {
    this.requestStreams().then(() => this.$store.dispatch('requestConversions'))
  },

  methods: {
    ...mapActions([
      'selectStream',
      'requestStreams'
    ])
  }
}
</script>
