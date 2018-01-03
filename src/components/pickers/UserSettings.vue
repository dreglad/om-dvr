<template>
  <div class="text-xs-center">
    <v-menu
      offset-y
      :close-on-content-click="false"
      v-model="menu"
      :nudge-top="-10"
      right
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
              <v-switch v-model="showSceneChanges"></v-switch>
            </v-list-tile-action>
            <v-list-tile-title>Mostrar marcadores de cambio de excena</v-list-tile-title>
          </v-list-tile>

          <v-list-tile>
            <v-list-tile-action>
              <v-select
                :items="sceneChangeMinValueOptions"
                v-model="sceneChangeMinValue"
              />
            </v-list-tile-action>
            <v-list-tile-title>Sensibilidad de la detección de cambio de ecena</v-list-tile-title>
          </v-list-tile>

          <v-list-tile>
            <v-list-tile-action>
              <v-select
                :items="sceneChangeOffsetOptions"
                v-model="sceneChangeOffset"
              />
            </v-list-tile-action>
            <v-list-tile-title>Tiempo extra (antes y después) para mostrar cambios de escena</v-list-tile-title>
          </v-list-tile>

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
          <!-- <v-list-tile>
            <v-list-tile-action>
              <v-select
                :items="defaultPageOptions"
                v-model="defaultPage"
              />
            </v-list-tile-action>
            <v-list-tile-title>Página inicial</v-list-tile-title>
          </v-list-tile> -->
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
      ],
      sceneChangeOffsetOptions: [
        { text: '12 hrs.', value: 60 * 60 * 12 },
        { text: '3 hrs.', value: 60 * 60 * 3 },
        { text: '2 hrs.', value: 60 * 60 * 2 },
        { text: '1 hr.', value: 60 * 60 * 1 },
        { text: '30 min.', value: 60 * 30 },
        { text: '10 min.', value: 60 * 10 },
        { text: '1 min.', value: 60 },
        { text: 'Justo', value: 0 }
      ],
      sceneChangeMinValueOptions: [
        { text: '65%', value: 0.65 },
        { text: '70%', value: 0.70 },
        { text: '75%', value: 0.75 },
        { text: '80%', value: 0.80 },
        { text: '85%', value: 0.85 },
        { text: '90%', value: 0.90 },
        { text: '100%', value: 1 }
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

    showSceneChanges: {
      get () {
        return this.userSettings.showSceneChanges
      },
      set (value) {
        this.$store.commit('SET_USERSETTINGS_SHOWSCENECHANGES', value)
      }
    },

    sceneChangeOffset: {
      get () {
        return this.userSettings.sceneChangeOffset
      },
      set (value) {
        this.$store.commit('SET_USERSETTINGS_SCENECHANGEOFFSET', value)
      }
    },

    sceneChangeMinValue: {
      get () {
        return this.userSettings.sceneChangeMinValue
      },
      set (value) {
        this.$store.commit('SET_USERSETTINGS_SCENECHANGEMINVALUE', value)
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
