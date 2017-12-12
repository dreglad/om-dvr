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
              :size="30"
              :width="6"
              :value="props.item.progress * 100"
              color="blue"
            />
          </td>
          <td v-else>{{ props.item.status | converisonStatus }}</td>
          <td v-if="props.item.state == 'SUCCESS'"><a :href="props.item.url">{{ props.item.url }}</a></td>
          <td v-else>...</td>
          <td>{{ props.item.created_at.format('YYYY-MM-DD HH:mm:ss') }}</td>
          <td>{{ props.item.duration.format('HH:mm:ss') }}</td>
          <td>{{ props.item.start.format() }}</td>
          <td>
            <v-tooltip left>
              <v-btn fab small flat
                slot="activator"
                @click="setDvr(props.items)"
              >
                <v-icon>av_timer</v-icon>
              </v-btn>
              <span>Ver en la grabadora</span>
            </v-tooltip>

            <v-tooltip top>
              <v-btn fab small flat
                slot="activator"
                :adisabled="props.item.status !== 'SUCCESS'"
                :href="props.item.url"
              >
                <v-icon>file_download</v-icon>
              </v-btn>
              <span>Link de descarga</span>
            </v-tooltip>

            <v-tooltip right>
              <v-btn fab small flat
                slot="activator"
                :adisabled="props.item.status === 'STARTED'"
                @click="removeConversion(props.item)"
              >
                <v-icon>delete</v-icon>
              </v-btn>
              <span v-if="props.item.status == 'PENDING'">Cancelar conversión</span>
              <span v-else">Eliminar conversión"</span>
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
          text: 'Archivo',
          value: 'url',
          align: 'left'
        },
        {
          text: 'Creado en',
          value: 'created_at',
          align: 'left'
        },
        {
          text: 'Duración',
          value: 'duration',
          align: 'left'
        },
        {
          text: 'Inicio',
          value: 'start',
          align: 'left'
        },
        {
          text: 'Acciones',
          align: 'left'
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
