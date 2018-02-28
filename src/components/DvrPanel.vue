<template>
  <v-card v-if="selectedStream" class="elevation-6">

    <v-tabs
      v-if="playerMode === 'fragment'"
      v-model="selectedTab"
      show-arrows
      color="light-blue darken-4"
      slider-color="white"
    >
      <v-tab
        v-if="fragments.length > 1"
        href="#dvr-all"
      >
        Todos ({{ fragments.length }})
      </v-tab>
      <v-tab
        v-for="(frag, index) in fragments"
        :key="index"
        :href="`#dvr-${index}`"
        ripple
      >
        Frag. {{ index + 1 }}
        <v-btn icon small
          v-if="fragments.length > 1"
          @click.stop="() => { $nextTick(() => { $store.commit('DELETE_FRAGMENT', frag) }) }"
          class="ma-0 pa-0"
        >
          <v-icon color="light-blue lighten-4" small>close</v-icon>
        </v-btn>
      </v-tab>
      <v-tab color="grey" href="#dvr-new">
        <v-btn icon class="px-1 mx-1">
          <v-icon>add</v-icon>
        </v-btn>
      </v-tab>

      <v-spacer />

      <!-- Select date widget -->
      <v-menu offset-y full-width right
        :close-on-click="true"
        :close-on-content-click="true"
        transition="slide-y-transition"
        :nudge-top="-10"
        v-model="datePickerOpened"
        z-index="1"
      >
        <v-btn icon
          right
          slot="activator"
          :outline="datePickerOpened"
        >
          <v-icon>event</v-icon>
        </v-btn>
        <DvrTimePicker type="date" />
      </v-menu>

    </v-tabs>

    <v-tabs
      v-else-if="playerMode === 'video'"
      show-arrows
      color="light-green darken-4"
    >
      <v-tabs-slider color="white" />
      <v-tab href="#video-general">Video #{{ selectedVideo.id }}</v-tab>
    </v-tabs>

    <v-card-text v-if="playerMode === 'fragment'" class="pa-1">

      <v-container fluid grid-list-md>
        <v-layout row wrap>
          <v-flex xs12 sm4 class="text-xs-center pr-3">
            <div class="subheading">{{ selectedFragmentStart.format('LL') }}</div>
            <div class="display-1">{{ selectedDuration.format('hh:mm:ss', { trim: false }) }}</div>
            <div class="subheading"><v-icon small>query_builder</v-icon> {{ selectedFragmentStart.format('HH:mm:ss') }} a {{ selectedFragmentEnd.format('HH:mm:ss') }}</div>

            <v-btn small small
              @click="$store.commit('UNDO_FRAGMENT')"
              :disabled="!$store.getters.canUndoFragment"
              color="light-blue darken-4"
            >
              <v-icon>undo</v-icon>
            </v-btn>
            <v-btn small small
              @click="$store.commit('REDO_FRAGMENT')"
              :disabled="!$store.getters.canRedoFragment"
              color="light-blue darken-4"
            >
              <v-icon>redo</v-icon>
            </v-btn>

            <v-btn small block
              v-if="allSelected && fragments.length > 1"
              @click="createVideo(false)"
              color="light-blue darken-4"
            >
              Generar {{ fragments.length }} videos <v-icon right>fiber_smart_record</v-icon>
            </v-btn>
            <v-btn small block
              v-if="allSelected"
              @click="createVideo(true)"
              color="light-blue darken-4"
            >
              Generar un video con {{ fragments.length }} fragmentos <v-icon right>fiber_manual_record</v-icon>
            </v-btn>
            <v-btn small
              v-else
              @click="createVideo(false)"
              color="light-blue darken-4"
            >
              {{ $t('labels.generate_video') }}
              <v-icon right>fiber_smart_record</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs12 sm8 class="text-xs-center pr-3">
            <DvrTimePicker
              v-if="!this.allSelected"
              type="time" />
            <div v-else class="display-2">
              {{ fragments.length }}
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>

    <v-card-text
      v-else-if="playerMode === 'video'"
      class="pa-1"
    >
      <!-- <div class="display-2">{{ moment.duration(selectedVideo.duration).format('hh:mm:ss', { trim: false }) }}</div> -->
      <v-container fluid grid-list-md>
        <v-layout row wrap>
          <v-flex xs12 sm4 class="text-xs-center pr-3">
            <VideoThumbnail
              v-if="selectedVideo.status === 'SUCCESS'"
              :date="moment(selectedVideo.start).valueOf()"
              width="100%"
            />
            <v-progress-circular
              v-else
              :value="selectedVideo.progress * 100"
              :size="86"
              :width="8"
              color="light-green darken-4"
            >
              <h3 v-if="selectedVideo.progress < 1">{{ Math.round(selectedVideo.progress * 100) }}%</h3>
              <h3 v-else>ID: {{ selectedVideo.id }} {{ selectedVideo.status }}</h3>
            </v-progress-circular>
            <!-- <v-card-actions> -->
            <v-menu
              offset-y
              transition="slide-y-transition"
              :nudge-top="-10"
              :style="{ width: '100%' }"
            >
              <v-btn small block
                slot="activator"
                :disabled="selectedVideo.status !== 'SUCCESS'"
                color="light-green darken-4"
              >
                <span>Distribuir <v-icon small>public</v-icon></span>
              </v-btn>
              <DistributeList
                :videoId="selectedVideo.id"
                :initialTitle="videoMetadataTitle"
                :initialDescription="videoMetadataDescription"
              />
            </v-menu>
            <v-btn
              :disabled="!selectedVideo.file"
              color="light-green darken-4"
              :href="selectedVideo.file"
              target="_blank"
              small block
            >
              <span>Descargable <v-icon small>attach_file</v-icon></span>
            </v-btn>
            <v-btn small block
              :disabled="selectedVideo.status === 'STARTED'"
              @click="removeVideo(selectedVideo)"
              color="error"
              class="mt-3"
            >
              <span>Eliminar <v-icon small>delete</v-icon></span>
            </v-btn>
            <!-- </v-card-actions> -->
          </v-flex>
          <v-flex xs12 sm8>
            <!-- <div class="body-2">{{ moment(selectedVideo.created_at).format('LLLL') }} <v-icon small>query_builder</v-icon> {{ moment(selectedVideo.start).format('HH:mm:ss') }} a {{ moment(selectedVideo.end).format('HH:mm:ss') }}</div> -->
            <v-text-field
              v-model="videoMetadataTitle"
              label="Título"
              :counter="128"
              color="light-green darken-3"
              validate-on-blur
            />
            <v-text-field
              v-model="videoMetadataDescription"
              :multi-line="true"
              :rows="5"
              :row-height="10"
              validate-on-blur
              label="Descripción"
              color="light-green darken-3"
            />
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>

    <v-snackbar
      v-model="snackbar"
      :timeout="6000"
      :bottom="true"
      :color="snackbarColor"
    >
      {{ snackbarText }}
      <v-btn flat @click.native="snackbar = false">Cerrar</v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
import DvrTimePicker from '@/components/DvrTimePicker'
import DistributeList from './DistributeList'
import VideoThumbnail from './VideoThumbnail'
import { mapActions, mapGetters, mapState } from 'vuex'
import _ from 'lodash'
import backend from '@/api/backend'
import moment from 'moment'
require('moment-duration-format')

export default {
  name: 'DvrPanel',

  data () {
    return {
      allSelected: false,
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'success',
      datePickerOpened: false
    }
  },

  computed: {
    ...mapState([
      'fragments',
      'playerMode'
    ]),

    ...mapGetters([
      'activeItem',
      'selectedStream',
      'selectedVideo',
      'videoSource'
    ]),

    moment () {
      moment.locale(this.$store.getters.locale)
      return moment
    },

    selectedDuration () {
      if (this.allSelected) {
        return moment.duration(this.fragments.reduce((total, frag) => total + frag.duration, 0), 'seconds')
      } else {
        return moment.duration(this.activeItem.duration, 'seconds')
      }
    },

    selectedFragmentStart () {
      if (this.activeItem) {
        if (this.allSelected) {
          return moment(Math.min(...this.fragments.map(frag => moment(frag.start).valueOf())))
        } else {
          return moment(this.activeItem.start)
        }
      }
    },

    selectedFragmentEnd () {
      if (this.allSelected) {
        return moment(Math.max(...this.fragments.map(frag => moment(frag.start).add(frag.duration, 'seconds').valueOf())))
      } else {
        return moment(this.activeItem.start).add(this.activeItem.duration, 'seconds')
      }
    },

    videoMetadataTitle: {
      get () {
        const meta = this.selectedVideo.metadata || {}
        return meta.title || ''
      },
      set (val, oldVal) {
        if (val !== oldVal) {
          this.patchVideoMetadata(this.selectedVideo.id, {
            ...this.selectedVideo.metadata,
            title: val
          })
        }
      }
    },

    videoMetadataDescription: {
      get () {
        const meta = this.selectedVideo.metadata || {}
        return meta.description || ''
      },
      set (val, oldVal) {
        if (val !== oldVal) {
          this.patchVideoMetadata(this.selectedVideo.id, {
            ...this.selectedVideo.metadata,
            description: val
          })
        }
      }
    },

    selectedTab: {
      get () {
        const [frags, active] = [this.fragments, this.activeItem]
        if (this.allSelected && frags.length > 1) {
          return 'dvr-all'
        } else if (active) {
          return 'dvr-' + frags.indexOf(active)
        }
      },
      set (value) {
        this.allSelected = (value === 'dvr-all')
        if (value === 'dvr-new') {
          this.$store.dispatch('addFragment').then(() => {
            this.$nextTick(() => {
              this.$store.commit('SET_DVRITEM', this.fragments[this.fragments.length - 1])
            })
          })
        } else {
          if (!this.allSelected) {
            const match = value.match(/dvr-(\d+)/)
            if (match) {
              this.$store.commit('SET_DVRITEM', this.fragments[match[1]])
            }
          }
        }
      }
    }
  },

  methods: {
    ...mapActions([
      'requestConversion',
      'removeVideo'
    ]),

    patchVideoMetadata: _.debounce(function (id, metadata) {
      backend.patchVideo(id, metadata)
    }, 500),

    createVideo (join) {
      this.$store
        .dispatch('createVideo', join ? this.fragments : [this.activeItem])
        .then(({ data }) => {
          console.log('pppp', data)
          this.snackbarText = 'Video creado'
          this.snackbarColor = 'success'
          this.snackbar = true
          this.$router.push({ name: 'RecorderVideo', params: { videoId: data.id } })
        })
        .catch(e => {
          this.snackbarText = 'Error creando video'
          this.snackbarColor = 'error'
          this.snackbar = true
        })
    },

    doRequestConversion () {
      return this.requestConversion(this.activeItem).then(() => {
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

  components: {
    VideoThumbnail,
    DistributeList,
    DvrTimePicker
  }
}
</script>

<style>


</style>