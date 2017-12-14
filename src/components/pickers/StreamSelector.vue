<template>
  <div>
    <v-menu v-if="streams" :nudge-width="100" bottom offset-y>
      <v-toolbar-title slot="activator">
        <v-icon dark small>videocam</v-icon>
        <span v-if="stream">{{ stream.name }}</span>
        <span v-else>Transmisión</span>
        <v-icon dark>arrow_drop_down</v-icon>
      </v-toolbar-title>
      <v-list>
        <v-list-tile
          v-for="item in streams"
          :key="item.id"
          @click="stream = item.id"
          :v-model="true"
          :inactive="item.id == stream.id"
        >
          <v-list-tile-title>
            <v-icon small v-if="item.id == stream.id">videocam</v-icon>
            {{ item.name }}
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
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
