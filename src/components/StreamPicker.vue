<template>
  <div>
    <v-menu
      v-if="streams.length"
      :nudge-bottom="10"
      bottom
      offset-y
    >
      <v-toolbar-title slot="activator">
        <v-icon dark small>videocam</v-icon>
        <span v-if="stream">{{ stream.name }}</span>
        <span v-else>Cargando...</span>
        <v-icon dark>arrow_drop_down</v-icon>
      </v-toolbar-title>
      <v-list>
        <v-list-tile
          v-for="item in streams"
          :key="item.id"
          :inactive="item.id == stream.id"
          @click="stream = item.id"
        >
          <v-list-tile-title>
            <v-icon v-if="item.id == stream.id" small>videocam</v-icon>
            {{ item.name }}
          </v-list-tile-title>
          <v-divider />
        </v-list-tile>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'

export default {
  name: 'StreamPicker',

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
        this.$store.commit('RESET_PLAYERMODE')
        this.$router.push({ name: 'Recorder' })
        this.selectStream(this.streams.find(stream => stream.id === value))
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
