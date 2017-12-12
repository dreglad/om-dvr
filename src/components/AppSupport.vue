<template>
  <v-layout>
    <v-flex lg12>
      <v-data-table
        :items="conversions"
        :headers="headers"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.state | converisonStatus }}</td>
          <td v-if="props.item.state == 'SUCCESSFUL'"><a :href="props.item.fileUrl">{{ props.item.fileUrl }}</a></td>
          <td v-else>...</td>
          <td>{{ props.item.humanFileSize }}</td>
          <td>{{ props.item.humanFileDuration }}</td>
          <td>{{ props.item.humanDuration }}</td>
          <td>{{ props.item.start }}</td>
          <td>{{ props.item.end }}</td>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions } from 'vuex'
import multimediaApi from '@/api/multimedia'
import humanize from 'humanize'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)
require('moment-duration-format')

export default {
  name: 'AppConversions',

  data () {
    return {
      headers: [
        {
          text: 'Estado',
          value: 'state',
          align: 'left'
        },
        {
          text: 'Archivo',
          value: 'url',
          align: 'left'
        },
        {
          text: 'Tamaño',
          align: 'left'
        },
        {
          text: 'Duración',
          value: 'fileDuration',
          align: 'left'
        },
        {
          text: 'Tiempo de procesamiento',
          value: 'duration',
          align: 'left'
        },
        {
          text: 'Inicio',
          value: 'startTime',
          align: 'left'
        },
        {
          text: 'Final',
          value: 'endTime',
          align: 'left'
        }
      ]
    }
  },

  computed: {
    conversions () {
      return this.$store.state.conversions.map((conv) => {
        const convStatus = conv.conversionStatusList[0]
        return {
          ...conv,
          ...convStatus,
          fileUrl: multimediaApi.getConversionUrl(convStatus),
          humanFileSize: humanize.filesize(convStatus.fileSize),
          humanFileDuration: moment.duration(convStatus.fileDuration, 'milliseconds').format(),
          humanDuration: moment.duration(convStatus.duration, 'milliseconds').format(),
          start: moment.utc(convStatus.startTime),
          end: moment.utc(convStatus.endTime)
        }
      })
    }
  },

  methods: {
    ...mapActions([
      'requestDvrStores'
    ]),
    conversionUrl (value) {
      return multimediaApi.getConversionUrl(value)
    }
  },

  created () {
    this.requestDvrStores()
  },

  filters: {
    converisonStatus (value) {
      switch (value) {
        case 'SUCCESSFUL': return 'Exitoso'
        case 'RUNNING': return 'En progreso'
        case 'ERROR': return 'Error'
        default: return ''
      }
    }
  }
}
</script>
