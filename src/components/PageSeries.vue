<template>
  <v-container style="max-width: 1290px;">
    <v-layout>
      <v-flex lg12>
        <v-data-table
          :items="series"
          :headers="headers"
          :pagination.sync="pagination"
          :rows-per-page-text="$t('data_table.items_per_page')"
          :no-data-text="$t('data_table.no_data')"
        >
          <template slot="items" slot-scope="props">
            <td>
              {{ props.item.name }}
            </td>
            <td>
              {{ props.item.name }}
            </td>
            <td>
              {{ props.item.name }}
            </td>
            <td>
              {{ props.item.name }}
            </td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import VideoThumbnail from '@/components/VideoThumbnail'
import moment from 'moment'
// import _ from 'lodash'
// import humanize from 'humanize'

export default {
  name: 'PageSeries',

  data () {
    return {
      pagination: {
        rowsPerPage: 50,
        sortBy: 'name',
        descending: false
      },
      headers: [
        {
          text: this.$t('labels.name'),
          value: 'name'
        },
        {
          text: this.$t('labels.recurrence'),
          value: 'recurrences'
        },
        {
          text: this.$t('labels.opening_sequence'),
          value: 'opening_sequence'
        },
        {
          text: this.$t('labels.closing_sequence'),
          value: 'closing_sequence'
        }
      ]
    }
  },

  computed: {
    ...mapState([
      'series'
    ]),

    moment () {
      moment.locale(this.$store.getters.locale)
      return moment
    }
  },

  methods: {
    ...mapActions([
      'removeSeries'
    ])
  },

  components: {
    VideoThumbnail
  }
}
</script>
