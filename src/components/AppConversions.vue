<template>
  <v-layout>
    <v-flex lg12>
      <v-data-table
        :items="currentConversions"
        :headers="headers"
        :pagination.sync="pagination"
      >
        <template slot="items" slot-scope="props">
          <td v-if="props.item.status == 'STARTED' || props.item.status == 'SUCCESS'">
            <v-progress-circular :size="50" :width="3" class="ma-2"
              :value="props.item.progress * 100"
              :color="progressColor(props.item)"
            >
              <!-- <span v-if="props.item.progress < 1">{{ Math.max(1, Math.ceil(props.item.progress * 100 )) }}%</span> -->
              <span><v-icon :color="progressColor(props.item)">{{ progressIcon(props.item) }}</v-icon></span>
            </v-progress-circular>
          </td>
          <td v-else>{{ props.item.status | converisonStatus }}</td>
          <!-- <td>{{ props.item.created_at.format('lll') }}</td> -->
          <td>
            <!-- <v-layout row justify-left align-center> -->
              <img :height="68" class="pa-2" style="vertical-align:middle;"
                :data-proportion="0" :data-retries="0"
                :style="{ opacity: props.item.progress < 1 ? 0.6 : 1 }"
                :src="getThumbnail(props.item, 0)"
                @error="e => { thumbnailError(props.item, e.target) }" />
              <!-- <v-flex xs1 ><v-icon>forward_arrow</v-icon></v-flex> -->
              <img :height="68" class="pa-2" style="vertical-align:middle;"
                :data-proportion="props.item.progress" :data-retries="0"
                :style="{ opacity: props.item.progress < 1 ? 0.6 : 1 }"
                :src="getThumbnail(props.item, props.item.progress)" />
            <!-- </v-layout> -->
          </td>
          <td>{{ props.item.start.format('dddd D [de] MMM [de] YYYY') }}</td>
          <td>{{ props.item.start.format('HH:mm:ss') }}</td>
          <td>{{ props.item.end.format('HH:mm:ss') }}</td>
          <td>{{ props.item.duration.format('HH:mm:ss', { trim: false }) }}</td>
          <td>

            <v-menu offset-y
              :close-on-content-click="false"
              transition="slide-y-transition"
              :nudge-top="-10"
            >
              <v-btn slot="activator"
                fab flat
                :disabled="props.item.status !== 'SUCCESS'"
              >
                <v-tooltip left>
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
              <v-btn fab flat
                slot="activator"
                :disabled="props.item.status !== 'SUCCESS'"
                :href="props.item.url"
                target="_blank"
              >
                <v-icon>attach_file</v-icon>
              </v-btn>
              <span>Link de descarga</span>
            </v-tooltip>

            <v-tooltip left>
              <v-btn fab flat
                slot="activator"
                @click="gotoDvr(props.item)"
              >
                <v-icon>av_timer</v-icon>
              </v-btn>
              <span>Ver en la grabadora</span>
            </v-tooltip>

            <v-tooltip right>
              <v-btn fab flat
                slot="activator"
                :disabled="props.item.status === 'STARTED'"
                @click="removeConversion(props.item)"
              >
                <v-icon v-if="props.item.status == 'PENDING'">cancel</v-icon>
                <v-icon v-else>delete</v-icon>
              </v-btn>
              <span v-if="props.item.status == 'PENDING'">Cancelar conversión</span>
              <span v-else>Eliminar conversión</span>
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
      width="500px"
    >
      <v-card>
        <v-card-title class="py-4 title">Distribuir video</v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap>
            <v-flex xs6>
              <v-select
                v-model="metadataTipo"
                :items="metadataTipoOptions"
                item-value="slug"
                item-text="nombre"
                label="Tipo de clip"
                autocomplete
                required
              />
            </v-flex>
            <v-flex xs6>
              <v-select
                v-model="metadataPrograma"
                :items="metadataProgramaOptions"
                item-value="slug"
                item-text="nombre"
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
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import backend from '@/api/backend'
import moment from 'moment'

// import _ from 'lodash'
// import humanize from 'humanize'

export default {
  name: 'AppConversions',

  data () {
    return {
      metadataTitle: '',
      metadataDescription: '',
      metadataPrograma: null,
      metadataTipo: null,
      metadataProgramaOptions: [],
      metadataTipoOptions: [],
      metadataDialog: false,
      confirmDialog: false,
      confirmed: false,
      selectedConversionId: null,
      selectedProfileId: null,
      error: false,
      distributionProfiles: [
          { name: 'Multimedia teleSUR Español', id: 1 },
          { name: 'Multimedia teleSUR English', id: 2 },
          { name: 'Captura teleSUR Español', id: 3 },
          { name: 'Captura teleSUR English', id: 4 }
      ],
      pagination: {
        rowsPerPage: 25,
        sortBy: 'created_at',
        descending: true
      },
      headers: [
        {
          text: 'Estado',
          value: 'status',
          align: 'left'
        },
        {
          text: 'Miniaturas',
          align: 'left'
        },
        {
          text: 'Fecha',
          value: 'start',
          align: 'left'
        },
        {
          text: 'Hora inicial',
          value: 'start',
          align: 'left'
        },
        {
          text: 'Hora final',
          value: 'end',
          align: 'left'
        },
        {
          text: 'Duración',
          value: 'duration',
          align: 'left'
        },
        {
          text: 'Acciones',
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
      'requestConversions',
      'removeConversion'
    ]),

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
          programa: this.metadataPrograma
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
      this.$router.push({ name: 'Recorder' }, () => {
        this.$store.dispatch('setDvr', conv)
      })
    },

    getThumbnail (conv, timeProportion, offset = 0) {
      timeProportion = timeProportion || 0
      let time = moment(conv.start).add(conv.duration.asSeconds() * timeProportion, 'seconds')
      if (timeProportion === 0) {
        time += 500
      } else if (timeProportion >= 1) {
        time -= 500
      }
      time += offset * 1000
      if (offset) {
        console.log(time)
      }
      return backend.getThumbnailUrl(this.selectedStream, time)
    },

    thumbnailError (conv, elem) {
      const retries = parseInt(elem.getAttribute('data-retries'))
      console.log(retries, 'Recovering from thumbnail error')
      if (retries < 3) {
        elem.setAttribute('data-retries', retries + 1)
        elem.setAttribute('src', this.getThumbnail(conv, elem.getAttribute('data-proportion'), retries + 1))
      }
    },

    progressColor (conv) {
      switch (conv.status) {
        case 'STARTED':
          return 'blue'
        case 'SUCCESS':
          return 'green'
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
    backend.getMetadataOptions('programa').then(({ data }) => {
      this.metadataProgramaOptions = data
    })

    backend.getMetadataOptions('tipo_clip').then(({ data }) => {
      this.metadataTipoOptions = data
    })

    this.requestConversions().then(() => {
      this.$store.commit('RESET_SEEN_CONVERSIONS')
      this.intervalId = setInterval(() => {
        this.requestConversions().then(() => {
          this.$store.commit('RESET_SEEN_CONVERSIONS')
        })
      }, 2000)
    })
  },

  activated () {
    console.log('aaaaaaaa')
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
  }
}
</script>
