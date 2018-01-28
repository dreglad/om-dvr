<template>
  <v-container style="max-width: 1290px;">
  <v-layout>
    <v-flex lg12>
      <v-data-table
        :items="videos"
        :headers="headers"
        :pagination.sync="pagination"
        :rows-per-page-text="$t('data_table.items_per_page')"
        :no-data-text="$t('data_table.no_data')"
      >
        <template slot="items" slot-scope="props">
          <td v-if="['STARTED', 'SUCCESS', 'FAILURE'].includes(props.item.status)">
            <v-progress-circular :size="40" :width="2" class="ma-2"
              :value="props.item.progress * 100"
              :color="progressColor(props.item)"
            >
              <!-- <span v-if="props.item.progress < 1">{{ Math.max(1, Math.ceil(props.item.progress * 100 )) }}%</span> -->
              <span><v-icon small :color="progressColor(props.item)">{{ progressIcon(props.item) }}</v-icon></span>
            </v-progress-circular>
            <v-btn
              small flat
              v-if="props.item.status === 'FAILURE'"
              @click="$store.dispatch('retryVideo', props.item)"
            >
              Reintentar
            </v-btn>
          </td>
          <td v-else-if="props.item.status == 'FAILED'">
              <span><v-icon small :color="progressColor(props.item)">{{ progressIcon(props.item) }}</v-icon></span>
            </v-progress-circular>
          </td>
          <td v-else>{{ $t(`video_status.${props.item.status}`) }}</td>
          <!-- <td>{{ props.item.created_at.format('lll') }}</td> -->
          <td class="justify-center">
            <!-- <v-layout row justify-left align-center> -->
              <VideoThumbnail
                :height="60"
                class="px-1 py-2"
                :date="moment(props.item.start).valueOf()"
              />
              <VideoThumbnail
                :height="60"
                class="px-1 py-2"
                :date="getProgressedTime(props.item)"
              />
          </td>
          <td>{{ moment(props.item.start).format('dddd D [de] MMM [de] YYYY') }}</td>
          <td>
            {{ moment(props.item.start).format('HH:mm:ss') }} - 
            {{ moment(props.item.end).format('HH:mm:ss') }}
          </td>
          <td>{{ moment.duration(props.item.duration).humanize() }}</td>
          <td class="justify-center px-0">
            <v-menu offset-y
              transition="slide-y-transition"
              :nudge-top="-10"
            >
              <v-btn slot="activator"
                icon class="mx-0"
                :disabled="props.item.status !== 'SUCCESS'"
              >
                <v-tooltip top>
                  <v-icon slot="activator">public</v-icon>
                  <span>Distribuir</span>
                </v-tooltip>
              </v-btn>
              <v-list>
                <v-list-tile
                  v-for="profile in distributionProfiles"
                  :key="profile.id"
                  @click="distribute({ profileId: profile.id, conversionId: props.item.id })"
                >
                  <v-list-tile-title>
                    {{ profile.name }}
                  </v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>

            <v-tooltip top>
              <v-btn icon class="mx-0"
                slot="activator"
                :disabled="props.item.status !== 'SUCCESS'"
                :href="props.item.file"
                target="_blank"
              >
                <v-icon>attach_file</v-icon>
              </v-btn>
              <span>Link de descarga</span>
            </v-tooltip>

            <v-tooltip top>
              <v-btn icon class="mx-0"
                slot="activator"
                @click="gotoDvr(props.item)"
              >
                <v-icon>av_timer</v-icon>
              </v-btn>
              <span>Ver en la grabadora</span>
            </v-tooltip>

            <v-tooltip top>
              <v-btn icon class="mx-0"
                slot="activator"
                :disabled="props.item.status === 'STARTED'"
                @click="removeVideo(props.item)"
              >
                <v-icon v-if="props.item.status == 'PENDING'">cancel</v-icon>
                <v-icon v-else>delete</v-icon>
              </v-btn>
              <span v-if="props.item.status == 'PENDING'">{{ $t('labels.cancel') }}</span>
              <span v-else>{{ $t('labels.delete') }}</span>
            </v-tooltip>
          </td>
        </template>
      </v-data-table>
    </v-flex>

    <v-dialog
      v-model="confirmDialog"
      :overlay="true"
      :persistent="!confirmed && !error"
      width="200"
      transition="fadein"
    >
      <v-card>
        <v-card-text v-if="confirmed" class="text-xs-center">
          Confirmado <v-icon class="pl-2"color="green">check</v-icon>
        </v-card-text>
        <v-card-text v-else-if="error" class="text-xs-center">
          Error <v-icon class="pl-2"color="deep-orange">error</v-icon>
        </v-card-text>
        <v-card-text v-else class="text-xs-center">
          <v-progress-circular indeterminate />
        </v-card-text>
      </v-card>
    </v-dialog>


    <v-dialog
      v-model="metadataDialog"
      :overlay="true"
      :width="540"
    >
      <v-card>
        <v-card-title class="title">Distribuir video</v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap>
            <v-flex xs5 class="pa-1">
              <v-select
                v-model="metadataTipo"
                :items="metadataTipoOptions[selectedProfileId === 1 ? 'es' : 'en']"
                item-value="slug"
                item-text="nombre"
                label="Tipo de clip"
                autocomplete
                required
              />
            </v-flex>
            <v-flex xs7 class="pa-1">
              <v-select
                v-model="metadataPrograma"
                :items="metadataProgramaOptions[selectedProfileId === 1 ? 'es' : 'en']"
                item-value="slug"
                item-text="nombre"
                dense
                label="Programa de origen"
                clearable
                autocomplete
              />
            </v-flex>
            <v-flex xs12 align-center justify-space-between>
              <v-layout align-center>
                <v-text-field
                  v-model="metadataTitle"
                  placeholder="Título"
                  required
                />
              </v-layout>
            </v-flex>
            <v-flex xs12 align-center justify-space-between>
              <v-layout align-center>
                <v-text-field
                  v-model="metadataDescription"
                  placeholder="Descripción"
                  multi-line
                />
              </v-layout>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <!-- <v-btn flat color="primary">Guardar para después</v-btn> -->
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="metadataDialog = false">Cancelar</v-btn>
          <v-btn flat @click="distributeMultimedia">Distribuir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import VideoThumbnail from '@/components/VideoThumbnail'
import backend from '@/api/backend'
import moment from 'moment'
// import _ from 'lodash'
// import humanize from 'humanize'

export default {

  name: 'PageVideos',

  data () {
    return {
      metadataTitle: '',
      metadataDescription: '',
      metadataPrograma: null,
      metadataTipo: null,
      metadataProgramaOptions: {
        'es': [],
        'en': []
      },
      metadataTipoOptions: {
        'es': [],
        'en': []
      },
      metadataDialog: false,
      confirmDialog: false,
      confirmed: false,
      selectedVideoId: null,
      selectedProfileId: null,
      error: false,
      distributionProfiles: [
        { name: 'Multimedia teleSUR | Clip en Español', id: 1 },
        { name: 'Multimedia teleSUR | Clip en Inglés', id: 2 },
        { name: 'Multimedia teleSUR | Video Capturado en Español', id: 3 },
        { name: 'Multimedia teleSUR | Video Capturado en Inglés', id: 4 }
      ],
      pagination: {
        rowsPerPage: 25,
        sortBy: 'created_at',
        descending: true
      },
      headers: [
        {
          text: this.$t('labels.status'),
          value: 'status',
          align: 'left'
        },
        {
          text: this.$t('labels.thumbnail'),
          align: 'left',
          value: 'start'
        },
        {
          text: this.$t('labels.date'),
          value: 'start',
          align: 'left'
        },
        {
          text: this.$t('labels.range'),
          value: 'start',
          align: 'left'
        },
        {
          text: this.$t('dvr.duration'),
          value: 'duration',
          align: 'left'
        },
        {
          text: this.$t('labels.actions'),
          align: 'left',
          value: null
        }
      ]
    }
  },

  computed: {
    ...mapGetters([
      'selectedStream',
      'locale'
    ]),

    ...mapState([
      'videos'
    ]),

    moment () {
      moment.locale(this.locale)
      return moment
    },

    selectedVideo () {
      return this.selectedVideoId && this.videos.find(video => video.id === this.selectedVideoId)
    }
  },

  methods: {
    ...mapActions([
      'removeVideo'
    ]),

    getProgressedTime (video) {
      return moment(video.start).add(moment.duration(video.duration).asSeconds() * video.progress, 'seconds')
    },

    distribute ({ profileId, videoId }) {
      this.confirmed = false
      this.error = false

      if (profileId === 3 || profileId === 4) {
        this.confirmDialog = true
        backend.distributeCaptura({ profileId, videoId }).then(({ data }) => {
          this.confirmed = true
        }).catch((err) => {
          this.error = true
          console.log(err)
        })
      } else if (profileId === 1 || profileId === 2) {
        this.selectedVideoId = videoId
        this.selectedProfileId = profileId
        this.metadataDialog = true
      }
    },

    distributeMultimedia () {
      backend.distributeMultimedia({
        profileId: this.selectedProfileId,
        url: this.selectedVideo.file,
        metadata: {
          titulo: this.metadataTitle,
          descripcion: this.metadataDescription,
          tipo: this.metadataTipo,
          programa: this.metadataPrograma,
          usuario_remoto: this.$store.getters.userEmail
        }
      }).then(({ data }) => {
        this.confirmed = true
      }).catch((err) => {
        console.log(err)
        this.error = true
      })
      this.metadataDialog = false
    },

    gotoDvr (video) {
      this.$router.push({ name: 'Recorder' }, () => {
        this.$store.dispatch('setDvr', video)
      })
    },

    progressColor (video) {
      switch (video.status) {
        case 'STARTED':
          return 'blue'
        case 'SUCCESS':
          return 'green darken-2'
        case 'FAILURE':
          return 'deep-orange'
        case 'PENDING':
        case 'QUEUED':
          return 'amber'
      }
    },

    progressIcon (video) {
      switch (video.status) {
        case 'STARTED':
          return 'build'
        case 'SUCCESS':
          return 'check'
        case 'FAILURE':
          return 'report_problem'
        case 'PENDING':
        case 'QUEUED':
          return 'access_alarm'
      }
    }
  },

  mounted () {
    backend.getMetadataOptions('programa', 'es').then(({ data }) => {
      // console.log(data, 'poin')
      this.$set(this.metadataProgramaOptions, 'es', data)
    })
    backend.getMetadataOptions('programa', 'en').then(({ data }) => {
      this.$set(this.metadataProgramaOptions, 'en', data)
    })
    backend.getMetadataOptions('tipo_clip', 'es').then(({ data }) => {
      this.$set(this.metadataTipoOptions, 'es', data)
    })
    backend.getMetadataOptions('tipo_clip', 'en').then(({ data }) => {
      this.$set(this.metadataTipoOptions, 'en', data)
    })
  },

  components: {
    VideoThumbnail
  }
}
</script>
