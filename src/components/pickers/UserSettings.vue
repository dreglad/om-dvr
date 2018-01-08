<template>
  <div class="text-xs-center">
    <v-menu
      offset-y
      :close-on-content-click="false"
      v-model="menu"
      :nudge-top="-10"
      right
      bottom
      :width="380"
    >
      <v-btn icon slot="activator">
        <!-- <v-icon>person</v-icon> <span class="hide-xs-only">{{ userName }}</span> -->
        <v-avatar size="36"><img :src="userPicture"></v-avatar>
      </v-btn>
      <v-card>
        <v-list two-line>
          <v-list-tile>
            <v-list-tile-avatar>
              <v-avatar><img :src="userPicture" :alt="userName"></v-avatar>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ userName }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ userEmail }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn @click="logout">Cerrar sesión</v-btn>
            </v-list-tile-action>
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
        <v-list two-line dense>
          <v-subheader>Detección de cambios de escena</v-subheader>
          <v-list-tile>
            <v-list-tile-action>
              <v-switch v-model="showSceneChanges"></v-switch>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Mostrar cambios de esxena</v-list-tile-title>
              <v-list-tile-sub-title>Marcadores auxiliares sobre la línea de tiempo</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile :disabled="!showSceneChanges">
            <v-list-tile-action>
              <v-select auto dense :append-icon=false
                :items="sceneChangeMinValueOptions"
                v-model="sceneChangeMinValue"
              />
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Sensibilidad</v-list-tile-title>
              <v-list-tile-sub-title>Sensibilidad de la detección de cambio de escena</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile :disabled="!showSceneChanges" v-if="advanced">
            <v-list-tile-action>
              <v-select auto dense :append-icon=false
                :items="sceneChangeOffsetOptions"
                v-model="sceneChangeOffset"
              />
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Sobrante</v-list-tile-title>
              <v-list-tile-sub-title>Mostrar marcadores tiempo antes y después</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-subheader>Línea de tiempo</v-subheader>

          <v-list-tile>
            <v-list-tile-action>
              <v-select auto dense :append-icon=false
                :items="durationOptions"
                v-model="defaultDvrDuration"
              />
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Ventana inicial</v-list-tile-title>
              <v-list-tile-sub-title>Duración inicial de los nuevos segmentos</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile>
            <v-list-tile-action>
              <v-switch v-model="onlyLeadingStore"></v-switch>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Utilizar grabación reciente</v-list-tile-title>
              <v-list-tile-sub-title>En lugar de intentar cargar todo el material disponible</v-list-tile-sub-title>
            </v-list-tile-content>
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
      advanced: true,
      durationOptions: [
        { text: '15 m.', value: 60 * 15 },
        { text: '30 m.', value: 60 * 30 },
        { text: '1 h.', value: 60 * 60 },
        { text: '1.5 h.', value: 60 * 90 }
      ],
      defaultPageOptions: [
        { text: 'En vivo', value: 'Live' },
        { text: 'Grabadora', value: 'Recorder' },
        { text: 'Conversiones', value: 'Conversions' }
      ],
      sceneChangeOffsetOptions: [
        { text: '12 h.', value: 60 * 60 * 12 },
        { text: '3 h.', value: 60 * 60 * 3 },
        { text: '2 h.', value: 60 * 60 * 2 },
        { text: '1 h.', value: 60 * 60 * 1 },
        { text: '30 m.', value: 60 * 30 },
        { text: '10 m.', value: 60 * 10 },
        { text: '1 m.', value: 60 },
        { text: 'Justo', value: 0 }
      ],
      sceneChangeMinValueOptions: [
        { text: '65%', value: 0.65 },
        { text: '70%', value: 0.70 },
        { text: '75%', value: 0.75 },
        { text: '80%', value: 0.80 },
        { text: '85%', value: 0.85 },
        { text: '90%', value: 0.90 },
        { text: '95%', value: 0.95 },
        { text: '100%', value: 1 }
      ]
    }
  },

  computed: {
    ...mapGetters([
      'streams',
      'userName',
      'userPicture',
      'userEmail'
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
    ]),

    logout () {
      this.$store.dispatch('logout').then(() => { this.$router.replace('/') })
    }
  }
}
</script>
