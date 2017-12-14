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
                :style="{ opacity: props.item.progress < 1 ? 0.6 : 1 }"
                :src="getThumbnail(props.item, 0)" />
              <!-- <v-flex xs1 ><v-icon>forward_arrow</v-icon></v-flex> -->
              <img :height="68" class="pa-2" style="vertical-align:middle;"
                :style="{ opacity: props.item.progress < 1 ? 0.6 : 1 }"
                :src="getThumbnail(props.item, props.item.progress)" />
            <!-- </v-layout> -->
          </td>
          <td>{{ props.item.start.format('dddd D [de] MMM [de] YYYY') }}</td>
          <td>{{ props.item.start.format('HH:mm:ss') }}</td>
          <td>{{ props.item.end.format('HH:mm:ss') }}</td>
          <td>{{ props.item.duration.format('HH:mm:ss', { trim: false }) }}</td>
          <td>
            <v-tooltip top>
              <v-btn fab flat
                slot="activator"
                :disabled="props.item.status !== 'SUCCESS'"
                :href="props.item.url"
                target="_blank"
              >
                <v-icon large>file_download</v-icon>
              </v-btn>
              <span>Link de descarga</span>
            </v-tooltip>

            <v-tooltip left>
              <v-btn fab flat
                slot="activator"
                @click="gotoDvr(props.item)"
              >
                <v-icon large>av_timer</v-icon>
              </v-btn>
              <span>Ver en la grabadora</span>
            </v-tooltip>

            <v-tooltip right>
              <v-btn fab flat
                slot="activator"
                :disabled="props.item.status === 'STARTED'"
                @click="removeConversion(props.item)"
              >
                <v-icon v-if="props.item.status == 'PENDING'" large>cancel</v-icon>
                <v-icon v-else large>delete</v-icon>
              </v-btn>
              <span v-if="props.item.status == 'PENDING'">Cancelar conversión</span>
              <span v-else>Eliminar conversión</span>
            </v-tooltip>
          </td>
        </template>
      </v-data-table>
    </v-flex>
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

    gotoDvr (conv) {
      this.$router.push({ name: 'Recorder' }, () => {
        this.$store.dispatch('setDvr', conv)
      })
    },

    getThumbnail (conv, timeProportion) {
      timeProportion = timeProportion || 0
      let time = moment(conv.start).add(conv.duration.asSeconds() * timeProportion, 'seconds')
      if (timeProportion === 0) {
        time += 1
      } else if (timeProportion >= 1) {
        time -= 1
      }
      return backend.getThumbnailUrl(this.selectedStream, time)
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
    this.requestConversions().then(() => {
      this.$store.commit('RESET_SEEN_CONVERSIONS')
      this.intervalId = setInterval(() => {
        this.requestConversions().then(() => {
          this.$store.commit('RESET_SEEN_CONVERSIONS')
        })
      }, 1000)
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
