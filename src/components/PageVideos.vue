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
            <td>{{ props.item.metadata.title }}</td>
            <td>{{ moment(props.item.created_at).format('lll') }}</td>
            <td>
              {{ moment(props.item.start).format('HH:mm:ss') }} - 
              {{ moment(props.item.end).format('HH:mm:ss') }}
            </td>
            <td>{{ moment.duration(props.item.duration).humanize() }}</td>
            <td class="justify-center px-0">
              <v-menu
                v-if="false"
                :nudge-top="-10"
                transition="slide-y-transition"
                offset-y
              >
                <v-btn icon
                  slot="activator"
                  :disabled="props.item.status !== 'SUCCESS'"
                  class="mx-0"
                >
                  <v-tooltip top>
                    <v-icon slot="activator">public</v-icon>
                    <span>Distribuir</span>
                  </v-tooltip>
                </v-btn>
                <DistributeList />
              </v-menu>

              <v-tooltip top v-if="false">
                <v-btn icon
                  slot="activator"
                  :disabled="props.item.status !== 'SUCCESS'"
                  :href="props.item.file"
                  target="_blank"
                  class="mx-0"
                >
                  <v-icon>attach_file</v-icon>
                </v-btn>
                <span>Link de descarga</span>
              </v-tooltip>

              <v-tooltip top>
                <v-btn icon
                  slot="activator"
                  :to="{ name: 'RecorderVideo', params: { videoId: props.item.id } }"
                  class="mx-0"
                >
                  <v-icon>av_timer</v-icon>
                </v-btn>
                <span>Ver en la grabadora</span>
              </v-tooltip>

              <v-tooltip top>
                <v-btn icon
                  slot="activator"
                  :disabled="props.item.status === 'STARTED'"
                  @click="removeVideo(props.item)"
                  class="mx-0"
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
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import DistributeList from '@/components/DistributeList'
import VideoThumbnail from '@/components/VideoThumbnail'
import moment from 'moment'
// import _ from 'lodash'
// import humanize from 'humanize'

export default {

  name: 'PageVideos',

  data () {
    return {
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
          text: this.$t('labels.title'),
          value: 'metadata.title',
          align: 'left'
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
    ...mapState([
      'videos'
    ]),

    moment () {
      moment.locale(this.$store.getters.locale)
      return moment
    }
  },

  methods: {
    ...mapActions([
      'removeVideo'
    ]),

    getProgressedTime (video) {
      return moment(video.start).add(moment.duration(video.duration).asSeconds() * video.progress, 'seconds')
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

  components: {
    VideoThumbnail,
    DistributeList
  }
}
</script>
