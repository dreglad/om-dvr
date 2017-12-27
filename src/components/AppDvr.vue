<template>
  <div>
    <!-- main vidoe player -->
    <v-layout row wrap style="">
      <v-flex md5 d-flex>
        <v-card class="ma-2">
          <v-card-media>
            <dvr-player />
          </v-card-media>
        </v-card>
      </v-flex>
      <v-flex md7 d-flex>
        <v-card class="ma-2">
          <v-card-title primary-title>
            <div>
              <div v-if="selectedStream" class="headline">{{ selectedStream.name }}</div>
              <span class="grey--text">Duración: {{ $store.getters.dvrMomentDuration.format() }}</span>
            </div>
          </v-card-title>
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
      v-if="selectedStream"
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
import moment from 'moment'
import { mapGetters, mapActions, mapState } from 'vuex'
moment.locale('es')

export default {
  name: 'app-dvr',

  data () {
    return {
      datePickerOpened: true,
      timePickerOpened: true,
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
      'dvrStores'
    ]),
    ...mapGetters([
      'streams',
      'dvrRange',
      'selectedStream'
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
    DvrTimeline
  }
}
</script>
