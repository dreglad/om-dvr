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
      @click.stop="doRequestConversion"
      fab bottom right fixed
    >
      <v-tooltip top :open-delay="2000">
        <v-icon slot="activator">add</v-icon>
        <span>Agregr&nbsp;segmento</span>
      </v-tooltip>
    </v-btn>

    <v-snackbar
      :timeout="6000"
      :bottom="true"
      v-model="snackbar"
      :color="snackbarColor"
    >
      {{ snackbarText }}
      <v-btn flat @click.native="snackbar = false">Cerrar</v-btn>
    </v-snackbar>

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
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'success',
      conversionsIntervalId: null,
      sceneChangesIntervalId: null,
      datePickerOpened: true,
      timePickerOpened: true,
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
      'requestConversion',
      'requestSceneChanges'
    ]),

    doRequestConversion () {
      this.requestConversion().then(() => {
        this.snackbarText = 'Conversión creada'
        this.snackbarColor = 'success'
        this.snackbar = true
        this.$store.dispatch('requestConversions')
      }).catch(e => {
        this.snackbarText = 'Error creando conversión'
        this.snackbarColor = 'error'
        this.snackbar = true
      })
    }
  },

  mounted () {
    this.$store.dispatch('requestConversions')
    this.conversionsIntervalId = setInterval(() => {
      this.$store.dispatch('requestConversions')
    }, 5000)

    this.$store.dispatch('requestSceneChanges')
    this.sceneChangesIntervalId = setInterval(() => {
      this.$store.dispatch('requestSceneChanges')
    }, 20000)
    // this.requestDvrStores(this.$route.params.stream)
    // this.requestStreams()

    // const ESC_KEY = 27
    // document.addEventListener('keyup', (e) => {
    //   if (this.dialog && e.keyCode === ESC_KEY) {
    //     this.dialog = false
    //   }
    // })
  },

  beforeDestroy () {
    clearInterval(this.conversionsIntervalId)
    clearInterval(this.sceneChangesIntervalId)
  },

  components: {
    DvrPlayer,
    DvrTimeline
  }
}
</script>
