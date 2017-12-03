<template>
  <div>
    <v-layout>
      <StreamNavigator />
    </v-layout>
    <v-btn
      v-if="recordingUrl"
      @click.stop="dialog = !dialog"
      fab
      bottom
      right
      color="pink"
      dark
      fixed
    >
      <v-icon>add</v-icon>
    </v-btn>
    <v-dialog
      v-model="dialog"
      width="800px"
    >
      <v-card>
        <v-card-title
          class="grey lighten-4 py-4 title"
        >
          Convertir video
        </v-card-title>
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
          <v-btn flat @click="requestConversion">Convertir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import StreamNavigator from './video/StreamNavigator'
import moment from 'moment'
import { mapGetters, mapActions, mapState } from 'vuex'
// require('moment/src/locale/es.js')
moment.locale('es')

export default {
  name: 'AppRecorder',

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
      'dvrStart'
    ]),
    ...mapGetters([
      'streams',
      'dvrStores',
      'recordingUrl'
    ])
  },

  methods: {
    ...mapActions([
      'requestDvrStores'
    ]),

    requestConversion () {
      this.$store.dispatch('requestConversion', { name: this.name })
      .then(() => {
        this.dialog = false
      })
    }
  },

  mounted () {
    this.requestDvrStores(this.$route.params.stream)
    const ESC_KEY = 27
    document.addEventListener('keyup', (e) => {
      if (this.dialog && e.keyCode === ESC_KEY) {
        this.dialog = false
      }
    })
  },

  components: {
    StreamNavigator
  }
}
</script>
