<template>
  <v-list two-line dense>
    <v-list-tile class="ma-2">
      <v-list-tile-avatar>
        <v-avatar><img :src="user.picture" :alt="user.name"></v-avatar>
      </v-list-tile-avatar>
      <v-list-tile-content>
        <v-list-tile-title>{{ user.name }}</v-list-tile-title>
        <v-list-tile-sub-title>{{ user.email }}</v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action class="mr-2">
        <v-btn to="/auth/sign-out">{{ $t('auth.sign_out') }}</v-btn>
      </v-list-tile-action>
    </v-list-tile>

    <v-divider />
    <v-subheader>{{ $t('general') }}</v-subheader>

    <v-list-tile>
      <v-list-tile-action class="mr-2">
        <v-select
          v-model="preferredLanguage"
          :items="languageOptions"
          append-icon=""
          auto dense
        />
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>{{ $t('language') }}</v-list-tile-title>
        <v-list-tile-sub-title>{{ $t('language_text') }}</v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>

    <v-list-tile>
      <v-list-tile-action class="mr-2">
        <v-select
          v-model="clockFormat"
          :items="clockFormatOptions"
          append-icon=""
          auto dense
        />
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>{{ $t('clock_format') }}</v-list-tile-title>
        <v-list-tile-sub-title>{{ $t('clock_format_text') }}</v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>

    <v-list-tile>
      <v-list-tile-action class="mr-2">
        <v-select
          v-model="defaultDvrDuration"
          :items="durationOptions"
          append-icon=""
          auto dense 
        />
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>{{ $t('dvr_window') }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ $t('dvr_window_text') }}</v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>

    <v-divider />
    <v-subheader>{{ $t('scene_change_detection') }}</v-subheader>

    <v-list-tile>
      <v-list-tile-action class="mr-2">
        <v-switch v-model="showSceneChanges"></v-switch>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>{{ $t('show_scene_changes') }}</v-list-tile-title>
        <v-list-tile-sub-title>{{ $t('show_scene_changes_text') }}</v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>

    <v-list-tile :disabled="!showSceneChanges">
      <v-list-tile-action class="mr-2">
        <v-select
          v-model="sceneChangeMinValue"
          :items="sceneChangeMinValueOptions"
          append-icon=""
          auto dense
        />
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>{{ $t('sensibility') }}</v-list-tile-title>
        <v-list-tile-sub-title>{{ $t('sensibility_text') }}</v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>

    <v-list-tile :disabled="!showSceneChanges">
      <v-list-tile-action class="mr-2">
        <v-select
          v-model="sceneChangeOffset"
          :items="sceneChangeOffsetOptions"
          append-icon=""
          auto dense
        />
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>{{ $t('scene_change_offset') }}</v-list-tile-title>
        <v-list-tile-sub-title>{{ $t('scene_change_offset_text') }}s</v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>

    <v-divider />
    <v-subheader>{{ $t('labels.timeline') }}</v-subheader>

    <!-- <v-list-tile>
      <v-list-tile-action class="mr-2">
        <v-switch v-model="onlyLeadingStore"></v-switch>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>{{ $t('only_recent') }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ $t('only_recent_text') }}</v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile> -->

    <v-list-tile>
      <v-list-tile-action class="mr-2">
        <v-switch v-model="showMultimediaClips"></v-switch>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>{{ $t('show_multimedia_clips') }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ $t('show_multimedia_clips_text') }}</v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>

    <v-list-tile>
      <v-list-tile-action class="mr-2">
        <v-switch v-model="showMultimediaProgramas"></v-switch>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>{{ $t('show_multimedia_programas') }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ $t('show_multimedia_programas_text') }}</v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>

    <v-divider />
    <v-subheader>{{ $t('video_player') }}</v-subheader>

    <v-list-tile>
      <v-list-tile-action class="mr-2">
        <v-switch v-model="nativeVideoControls"></v-switch>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>{{ $t('native_controls') }}</v-list-tile-title>
        <v-list-tile-sub-title>{{ $t('native_controls_text') }}</v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>

    <!-- <v-list-tile :disabled="nativeVideoControls">
      <v-list-tile-action class="mr-2">
        <v-switch v-model="videoHoverShadow"></v-switch>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>{{ $t('hover_shadow') }}</v-list-tile-title>
        <v-list-tile-sub-title>{{ $t('hover_shadow_text') }}</v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile> -->

  </v-list>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'UserSettingsList',

  data () {
    return {
      clockFormatOptions: [
        { text: 'AM/PM', value: 'ampm' },
        { text: '24 hrs', value: '24hr' }
      ],
      durationOptions: [
        { text: '00:05', value: 60 * 5 },
        { text: '00:15', value: 60 * 15 },
        { text: '00:30', value: 60 * 30 },
        { text: '01:00', value: 60 * 60 },
        { text: '01:30', value: 60 * 90 }
      ],
      sceneChangeOffsetOptions: [
        { text: '00:00', value: 0 },
        { text: '00:10', value: 60 * 10 },
        { text: '00:30', value: 60 * 30 },
        { text: '01:00', value: 60 * 60 * 1 },
        { text: '03:00', value: 60 * 60 * 3 },
        { text: '06:00', value: 60 * 60 * 6 },
        { text: '12:00', value: 60 * 60 * 12 }
      ],
      sceneChangeMinValueOptions: [
        { text: '65%', value: 0.65 },
        { text: '70%', value: 0.70 },
        { text: '75%', value: 0.75 },
        { text: '80%', value: 0.80 },
        { text: '85%', value: 0.85 },
        { text: '90%', value: 0.90 },
        { text: '95%', value: 0.95 },
        { text: '100%', value: 1.0 }
      ]
    }
  },

  computed: {
    ...mapState([
      'user',
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

    nativeVideoControls: {
      get () {
        return this.userSettings.nativeVideoControls
      },
      set (value) {
        this.$store.commit('SET_USERSETTINGS_NATIVEVIDEOCONTROLS', value)
      }
    },

    showMultimediaClips: {
      get () {
        return this.userSettings.showMultimediaClips
      },
      set (value) {
        this.$store.commit('SET_USERSETTINGS_SHOWMULTIMEDIACLIPS', value)
      }
    },

    showMultimediaProgramas: {
      get () {
        return this.userSettings.showMultimediaProgramas
      },
      set (value) {
        this.$store.commit('SET_USERSETTINGS_SHOWMULTIMEDIAPROGRAMAS', value)
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

    defaultDvrDuration: {
      get () {
        return this.userSettings.defaultDvrDuration
      },
      set (value) {
        this.$store.commit('SET_USERSETTINGS_DEFAULTDVRDURATION', value)
      }
    },

    preferredLanguage: {
      get () {
        return this.$store.getters.locale
      },
      set (value) {
        this.$store.commit('SET_USERSETTINGNS_PREFERREDLANGUAGE', value)
      }
    },

    videoHoverShadow: {
      get () {
        return this.userSettings.videoHoverShadow
      },
      set (value) {
        this.$store.commit('SET_USERSETTINGNS_VIDEOHOVERSHADOW', value)
      }
    },

    clockFormat: {
      get () {
        return this.userSettings.clockFormat
      },
      set (value) {
        this.$store.commit('SET_USERSETTINGNS_CLOCKFORMAT', value)
      }
    },

    languageOptions () {
      const locales = this.$store.state.locales
      return Object.keys(locales).map(locale => {
        return { value: locale, text: locales[locale] }
      })
    }
  },

  i18n: {
    messages: {
      en: {
        general: 'General',
        language: 'Language',
        language_text: 'Preferred language for the user interface',
        scene_changes: 'Scene changes',
        show_scene_changes: 'Show scene changes',
        show_scene_changes_text: 'Place auxilaty markers over the timeline',
        scene_change_detection: 'Scene change detection',
        sensibility: 'Sensibiliy',
        sensibility_text: 'Greater value means more markers',
        scene_change_offset: 'Offset',
        scene_change_offset_text: 'Show markers before and after playing range',
        native_controls: 'Force native video controls',
        native_controls_text: 'Use device\'s native video controls and progress bar',
        video_player: 'Video player',
        dvr_window: 'Initial duration window',
        dvr_window_text: 'Default duration when creating new recordings',
        only_recent: 'Recent recording only',
        only_recent_text: 'Only use the most recent recorder store',
        hover_shadow: 'Shadow on mouse over',
        hover_shadow_text: 'Increases visibility of floating elements',
        show_multimedia_clips: 'Show Multimedia Clips',
        show_multimedia_programas: 'Show Multimedia Shows',
        clock_format: 'Clock format',
        clock_format_text: 'AM/PM o formato 24 horas'
      },
      es: {
        general: 'General',
        language: 'Idioma',
        language_text: 'Idioma preferido para la interfaz de usuario',
        scene_change: 'Cambio de escena',
        scene_changes: 'Cambios de escena',
        show_scene_changes: 'Mostrar cambios de escena',
        show_scene_changes_text: 'Marcadores auxiliares sobre la línea de tiempo',
        scene_change_detection: 'Detección de cambio de escena',
        sensibility: 'Sensibilidad',
        scene_change_offset: 'Marcadores extra',
        scene_change_offset_text: 'Mostrar antes y después del rango de reproducción',
        sensibility_text: 'Entre mayor sea el valor, más marcadores',
        native_controls: 'Forzar controles nativos',
        native_controls_text: 'Mostrar barra de progreso y controles nativos',
        video_player: 'Reproductor de video',
        dvr_window: 'Ventana inicial',
        dvr_window_text: 'Ventana de duración inicial de grabaciones',
        only_recent: 'Sólo grabación reciente',
        only_recent_text: 'Utilizar únicamente la grabación más reciente',
        hover_shadow: 'Oscurecer al pasar el cursor',
        hover_shadow_text: 'Aumenta la visibilidad de los elementos floatantes',
        show_multimedia_clips: 'Mostrar Clips de Multimedia',
        show_multimedia_programas: 'Mostrar Programas de Multimedia',
        clock_format: 'Formato del reloj',
        clock_format_text: 'AM/PM or 24 hours clock format'
      }
    }
  }
}
</script>