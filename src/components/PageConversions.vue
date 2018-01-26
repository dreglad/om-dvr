<template>
  <v-container style="max-width: 1290px;">
  <v-layout>
    <v-flex lg12>
      <v-data-table
        :items="currentConversions"
        :headers="headers"
        :pagination.sync="pagination"
        :rows-per-page-text="$t('data_table.items_per_page')"
        :no-data-text="$t('data_table.no_data')"
      >
        <template slot="items" slot-scope="props">
          <td v-if="props.item.status == 'STARTED' || props.item.status == 'SUCCESS'">
            <v-progress-circular :size="40" :width="2" class="ma-2"
              :value="props.item.progress * 100"
              :color="progressColor(props.item)"
            >
              <!-- <span v-if="props.item.progress < 1">{{ Math.max(1, Math.ceil(props.item.progress * 100 )) }}%</span> -->
              <span><v-icon small :color="progressColor(props.item)">{{ progressIcon(props.item) }}</v-icon></span>
            </v-progress-circular>
          </td>
          <td v-else>{{ props.item.status | converisonStatus }}</td>
          <!-- <td>{{ props.item.created_at.format('lll') }}</td> -->
          <td class="justify-center">
            <!-- <v-layout row justify-left align-center> -->
              <VideoThumbnail
                :height="60"
                class="px-1 py-2"
                :date="props.item.start"
              />
              <VideoThumbnail
                :height="60"
                class="px-1 py-2"
                :date="getProgressedTime(props.item)"
              />
          </td>
          <td>{{ props.item.start.locale($store.getters.locale).format('dddd D [de] MMM [de] YYYY') }}</td>
          <td>
            {{ props.item.start.format('HH:mm:ss') }} - 
            {{ props.item.end.format('HH:mm:ss') }}
          </td>
          <td>{{ props.item.duration.locale($store.getters.locale).humanize() }}</td>
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
                :href="props.item.url"
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
                @click="removeConversion(props.item)"
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
import { mapActions, mapGetters } from 'vuex'
import VideoThumbnail from '@/components/VideoThumbnail'
import backend from '@/api/backend'
import moment from 'moment'

// import _ from 'lodash'
// import humanize from 'humanize'

export default {

  name: 'PageConversions',

  data () {
    return {
      intervalId: null,
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
      selectedConversionId: null,
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
      'currentConversions',
      'selectedStream'
    ])
  },

  methods: {
    ...mapActions([
      'removeConversion',
      'requestConversions'
    ]),

    getProgressedTime (conv) {
      return moment(conv.start).add(conv.duration.asSeconds() * conv.progress, 'seconds')
    },

    distribute ({ profileId, conversionId }) {
      this.confirmed = false
      this.error = false

      if (profileId === 3 || profileId === 4) {
        this.confirmDialog = true
        backend.distributeCaptura({ profileId, conversionId }).then(({ data }) => {
          this.confirmed = true
        }).catch((err) => {
          this.error = true
          console.log(err)
        })
      } else if (profileId === 1 || profileId === 2) {
        this.selectedConversionId = conversionId
        this.selectedProfileId = profileId
        this.metadataDialog = true
      }
    },

    distributeMultimedia () {
      backend.distributeMultimedia({
        profileId: this.selectedProfileId,
        conversionId: this.selectedConversionId,
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

    gotoDvr (conv) {
      this.$router.push('/recorder', () => {
        this.$store.dispatch('setDvr', conv)
      })
    },

    progressColor (conv) {
      switch (conv.status) {
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

    progressIcon (conv) {
      switch (conv.status) {
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

  activated () {
    // this.requestConversions().then(() => {
    //   this.$store.commit('RESET_SEEN_CONVERSIONS')
    //   this.intervalId = setInterval(() => {
    //     this.requestConversions().then(() => {
    //       this.$store.commit('RESET_SEEN_CONVERSIONS')
    //     })
    //   }, 2000)
    // })
  },

  deactivated () {
    // clearInterval(this.intervalId)
  },

  beforeDestroy () {
    clearInterval(this.intervalId)
  },

  filters: {
    converisonStatus (value) {
      switch (value) {
        case 'PENDING': return 'Pendiente'
        case 'QUEUED': return 'En cola'
        case 'SUCCESS': return 'Exitoso'
        case 'STARTED': return 'En progreso'
        case 'FAILURE': return 'Error'
        default: return ''
      }
    }
  },

  components: {
    VideoThumbnail
  }
}
</script>
