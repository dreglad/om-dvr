<template>
  <div class="text-xs-center">
    <v-menu
      offset-x
      :close-on-content-click="false"
      :nudge-width="300"
      v-model="menu"
    >
      <v-btn icon large slot="activator"><v-icon>settings</v-icon></v-btn>
      <v-card>
        <v-list>
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <v-icon>settings</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>Ajustes personales</v-list-tile-title>
              <v-list-tile-sub-title>Configuración</v-list-tile-sub-title>
            </v-list-tile-content>
            <!-- <v-list-tile-action>
              <v-btn
                icon
                :class="fav ? 'red--text' : ''"
                @click="fav = !fav"
              >
                <v-icon>favorite</v-icon>
              </v-btn>
            </v-list-tile-action> -->
          </v-list-tile>
        </v-list>
        <v-divider></v-divider>
        <v-list>
          <v-list-tile>
            <v-list-tile-action>
              <v-switch v-model="onlyLeadingStore"></v-switch>
            </v-list-tile-action>
            <v-list-tile-title>Usar sólo grabación reciente</v-list-tile-title>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-action>
              <v-select
                :items="durationOptions"
                v-model="defaultDvrDuration"
              />
            </v-list-tile-action>
            <v-list-tile-title>Ventana inicial</v-list-tile-title>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-action>
              <v-select
                :items="defaultPageOptions"
                v-model="defaultPage"
              />
            </v-list-tile-action>
            <v-list-tile-title>Página inicial</v-list-tile-title>
          </v-list-tile>
        </v-list>
        <!-- <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="menu = false">Cancelar</v-btn>
          <v-btn color="primary" flat @click="menu = false">Guardar</v-btn>
        </v-card-actions> -->
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'

export default {
  name: 'UserSettings',

  data () {
    return {
      menu: false,
      durationOptions: [
        { text: '15m', value: 60 * 15 },
        { text: '30m', value: 60 * 30 },
        { text: '60m', value: 60 * 60 },
        { text: '90m', value: 60 * 90 }
      ],
      defaultPageOptions: [
        { text: 'En vivo', value: 'Live' },
        { text: 'Grabadora', value: 'Recorder' },
        { text: 'Conversiones', value: 'Conversions' }
      ]
    }
  },

  computed: {
    ...mapGetters([
      'streams'
    ]),
    ...mapState([
      'stream',
      'userSettings'
    ]),

    onlyLeadingStore: {
      get () {
        return this.userSettings.onlyLeadingStore
      },
      set (value) {
        this.$store.commit('SET_USERSETTINGS_ONLYLEADINGSTORE', value)
      }
    },

    defaultPage: {
      get () {
        return this.userSettings.defaultPage
      },
      set (value) {
        this.$store.commit('SET_USERSETTINGS_DEFAULTPAGE', value)
      }
    },

    defaultDvrDuration: {
      get () {
        return this.userSettings.defaultDvrDuration
      },
      set (value) {
        this.$store.commit('SET_USERSETTINGS_DEFAULTDVRDURATION', value)
      }
    },

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
