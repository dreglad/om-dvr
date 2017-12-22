<template>
  <div>
    <!-- Select time widget -->
    <v-menu lazy offset-y full-width
      :close-on-content-click="false"
      transition="scale-transition"
      :nudge-right="40"
    >
      <v-btn slot="activator" small fab right fixed top style="margin-top: 60px; margin-right:48px;">
        <v-tooltip left>
          <v-icon slot="activator">query_builder</v-icon>
          <span>Elegir hora</span>
        </v-tooltip>
      </v-btn>
      <dvr-time-picker type="time" />
    </v-menu>

    <!-- Select date widget -->
    <v-menu lazy offset-y full-width slot="activator"
      :close-on-content-click="false"
      transition="scale-transition"
      :nudge-right="40"
    >
      <v-btn slot="activator" small fab right fixed top style="margin-top: 60px;">
        <v-tooltip bottom>
          <v-icon slot="activator">event</v-icon>
          <span>Elegir&nbsp;fecha</span>
        </v-tooltip>
      </v-btn>
      <dvr-time-picker type="date" />
    </v-menu>

    <!-- main vidoe player -->
    <v-layout row style="min-height: 400px;">
      <v-flex md5>
        <dvr-player />
      </v-flex>
      <v-flex md7 d-flex>
        <v-card>
          Card
        </v-card>
      </v-flex>
    </v-layout>

    <!-- timeline -->
    <v-layout row>
      <v-flex xs12>
        <dvr-timeline />
      </v-flex>
    </v-layout>

    <!-- Add new segment button -->
    <v-btn small style="margin-right: 0;"
      v-if="streamId"
      @click.stop="dialog = !dialog"
      fab bottom right fixed
    >
      <v-tooltip top :open-delay="2000">
        <v-icon slot="activator">add</v-icon>
        <span>Agregr&nbsp;segmento</span>
      </v-tooltip>
    </v-btn>

    <v-dialog v-model="dialog" width="500px">
      <v-card>
        <v-card-title class="py-4 title">Convertir video</v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap>
            <v-flex xs12 align-center justify-space-between>
              <v-layout align-center>
                <v-text-field
                  v-model="name"
                  placeholder="Nombre"
                />
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <v-checkbox
                v-model="mUpload"
                label="Cargar a multimedia"
              />
            </v-flex>
            <v-flex xs3>
              <v-select
                v-model="mLanguage"
                :items="mLAnguages"
                :disabled="!mUpload"
                label="Idioma"
                autocomplete
              />
            </v-flex>
            <v-flex xs3>
              <v-select
                v-model="mType"
                :items="mTypes"
                :disabled="!mUpload"
                label="Tipo de clip"
                autocomplete
              />
            </v-flex>
            <v-flex xs6>
              <v-select
                v-model="mSerie"
                :items="mSeries"
                :disabled="!mUpload"
                label="Programa"
                autocomplete
              />
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <!-- <v-btn flat color="primary">Guardar para después</v-btn> -->
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="dialog = false">Cancelar</v-btn>
          <v-btn flat @click="doRequestConversion">Convertir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import DvrPlayer from './video/DvrPlayer'
import DvrTimeline from './video/DvrTimeline'
import DvrTimePicker from './pickers/DvrTimePicker'
import moment from 'moment'
import { mapGetters, mapActions, mapState } from 'vuex'
moment.locale('es')

export default {
  name: 'app-dvr',

  data () {
    return {
      dialog: false,
      name: '',
      mType: 'programa',
      mLanguage: 'es',
      mUpload: false,
      mSerie: null,
      mLAnguages: [
        { value: 'es', text: 'Español' },
        { value: 'en', text: 'English' }
      ],
      mTypes: [
        { value: 'programa', text: 'Programa' },
        { value: 'noticia', text: 'Noticia' },
        { value: 'entrevista', text: 'Entrevista' }
      ],
      mSeries: [
        { value: 'dossier', text: 'Dossier' },
        { value: 'from-the-south', text: 'From The South' },
        { value: 'agenda-abierta', text: 'Agenda Abierta' }
      ]
    }
  },

  computed: {
    ...mapState([
      'dvrStart',
      'dvrStores',
      'streamId'
    ]),
    ...mapGetters([
      'streams',
      'dvrRange'
    ])
  },

  methods: {
    ...mapActions([
      'requestDvrStores',
      'requestStores',
      'requestConversion'
    ]),

    doRequestConversion () {
      this.requestConversion({ name: this.name })
      .then(() => {
        this.dialog = false
        this.$store.dispatch('requestConversions')
      })
    }
  },

  mounted () {
    // this.requestDvrStores(this.$route.params.stream)
    // this.requestStreams()

    const ESC_KEY = 27
    document.addEventListener('keyup', (e) => {
      if (this.dialog && e.keyCode === ESC_KEY) {
        this.dialog = false
      }
    })
  },

  components: {
    DvrPlayer,
    DvrTimeline,
    DvrTimePicker
  }
}
</script>
