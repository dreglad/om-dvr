<template>
  <v-layout>
    <v-flex lg12>
      <v-data-table
        :items="currentConversions"
        :headers="headers"
        :pagination.sync="pagination"
      >
        <template slot="items" slot-scope="props">
          <td v-if="props.item.status == 'STARTED'">
            <v-progress-circular
              :size="60"
              :width="10"
              :value="props.item.progress * 100"
              color="blue"
              class="ma-1"
            ><span>{{ Math.ceil(props.item.progress * 100 )}}%</span></v-progress-circular>
          </td>
          <td v-else>{{ props.item.status | converisonStatus }}</td>
          <!-- <td>{{ props.item.created_at.format('lll') }}</td> -->
          <td>{{ props.item.start.format('dddd D [de] MMM [de] YYYY') }}</td>
          <td>{{ props.item.start.format('HH:mm:ss') }}</td>
          <td>{{ props.item.end.format('HH:mm:ss') }}</td>
          <td>{{ props.item.duration.format('HH:mm:ss', { trim: false }) }}</td>
          <td>
            <v-tooltip left v-if="false">
              <v-btn fab flat
                slot="activator"
                @click="setDvr(props.items)"
              >
                <v-icon large>av_timer</v-icon>
              </v-btn>
              <span>Ver en la grabadora</span>
            </v-tooltip>

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

            <v-tooltip right>
              <v-btn fab flat
                slot="activator"
                :disabled="props.item.status === 'STARTED'"
                @click="removeConversion(props.item)"
              >
                <v-icon large>delete</v-icon>
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
          text: 'Fecha inicio',
          value: 'start',
          align: 'left'
        },
        {
          text: 'Hora inicio',
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
      'currentConversions'
    ])
  },

  methods: {
    ...mapActions([
      'requestConversions',
      'removeConversion'
    ]),

    setDvr (conv) {
    }
  },

  mounted () {
    this.requestConversions().then(() => {
      this.$store.commit('RESET_SEEN_CONVERSIONS')
      this.intervalId = setInterval(() => {
        this.requestConversions().then(() => {
          this.$store.commit('RESET_SEEN_CONVERSIONS')
        })
      }, 3000)
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
