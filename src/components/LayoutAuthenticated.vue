<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      width="200"
      clipped
      fixed
      app
    >
      <v-list>
        <v-list-tile 
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ $t(item.title) }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      app
      color="primary"
      :transition="false"
      clipped-left
      fixed
      dense
    >
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title class="hidden-sm-and-down">
        <v-btn icon large class="hidden-sm-and-down" to="/about">
          <v-avatar size="32px" tile>
            <img src="@/assets/logo_white.png">
          </v-avatar>
        </v-btn>
        {{ title }}
      </v-toolbar-title>

      <v-spacer />

      <!-- Select date widget -->
      <v-menu offset-y full-width right
        v-if="$route.name == 'Recorder'"
        :close-on-click="false"
        :close-on-content-click="false"
        transition="slide-y-transition"
        :nudge-top="-10"
        v-model="datePickerOpened"
        z-index="1"
      >
        <v-btn icon
          slot="activator"
          @click="activateDatePicker"
          :outline="datePickerOpened"
        >
          <v-icon>event</v-icon>
        </v-btn>
        <DvrTimePicker type="date" />
      </v-menu>

      <v-tooltip bottom>
        <v-btn icon
          slot="activator"
          @click="isLive = !isLive"
          :outline="isLive"
        >
          <v-icon v-if="isLive">cast_connected</v-icon>
          <v-icon v-else>cast</v-icon>
        </v-btn>
        <div class="text-xs-center">
          <div>Activar video en vivo</div>
          <VideoThumbnail :date="liveThumbnailTime" :width="200" />
        </div>
      </v-tooltip>

      <StreamPicker />

      <v-btn small fab
        @click.stop="rightDrawer = !rightDrawer"
        class="elevation-3 mr-2"
      >
        <v-avatar size="32"><img :src="user.picture"></v-avatar>
      </v-btn>
    </v-toolbar>

    <v-content>
      <v-alert
        :value="!latestVersion"
        type="error"
        class="ma-4"
      >
        No tienes la versión más reciente, por favor refresca para actualizar
      </v-alert>
      <keep-alive>
        <router-view />
      </keep-alive>
    </v-content>

    <v-navigation-drawer
      v-model="rightDrawer"
      temporary
      right
      fixed
      :width="448"
    >
      <UserSettingsList />
    </v-navigation-drawer>

    <!-- <v-footer fixed app>
      <v-spacer />
      <div v-html="$t('footer.copyright')"></div>
      <v-spacer />
    </v-footer> -->

    <DvrLive v-if="isLive" />
  </v-app>
</template>

<script>
import StreamPicker from '@/components/StreamPicker'
import DvrTimePicker from '@/components/DvrTimePicker'
import DvrLive from '@/components/DvrLive'
import VideoThumbnail from '@/components/VideoThumbnail'
import UserSettingsList from '@/components/UserSettingsList'
import { mapGetters, mapState } from 'vuex'

export default {

  name: 'LayoutAuthenticated',

  data () {
    return {
      items: [
        { icon: 'slow_motion_video', title: 'links.recorder', to: { name: 'Recorder' } },
        { icon: 'video_library', title: 'links.videos', to: { name: 'Videos' } },
        { icon: 'dvr', title: 'links.series', to: { name: 'Series' } },
        { icon: 'lightbulb_outline', title: 'links.about', to: { name: 'About' } }
      ],
      rightDrawer: false,
      title: 'Open Multimedia',
      timePickerOpened: false,
      datePickerOpened: false,
      liveTime: null,
      multimediaItemsInterval: null,
      streamDetailsInterval: null
    }
  },

  created () {
    // var OneSignal = window.OneSignal || []
    // OneSignal.push(function () {
    //   OneSignal.init({
    //     appId: 'dfaef7c9-c0a8-4260-9708-1b83ef3261dd',
    //     autoRegister: true,
    //     notifyButton: {
    //       enable: false
    //     },
    //     welcomeNotification: {
    //       title: 'Open Multimedia',
    //       message: 'Notificaciones activadas'
    //     },
    //     promptOptions: {
    //       actionMessage: 'Se solicita tu permiso para enviarte notificaciones.',
    //       acceptButtonText: 'PERMITIR',
    //       cancelButtonText: 'NO, GRACIAS'
    //     }
    //   })
    // })
    // OneSignal.push(() => {
    //   setTimeout(() => {
    //     OneSignal.showHttpPrompt()
    //   }, 10000)
    // })
    this.$store.dispatch('requestStreams', { poll: 45000 }).then(() => {
      this.$store.dispatch('requestVideos', { poll: 2000 })

      this.$store.dispatch('requestSeries', { poll: 320000 })
      this.$store.dispatch('requestSceneChanges')

      this.multimediaItemsInterval = setInterval(() => {
        this.$store.dispatch('requestMultimediaItems')
      }, 30000)

      this.streamDetailsInterval = setInterval(() => {
        this.$store.dispatch('requestStreamDetails', this.$store.getters.selectedStream)
      }, 13000)
    })
  },

  beforeDestroy () {
    clearInterval(this.multimediaItemsInterval)
    clearInterval(this.streamDetailsInterval)
  },

  computed: {
    ...mapGetters([
      'locale',
      'selectedStream'
    ]),

    ...mapState([
      'user',
      'playerMode'
    ]),

    latestVersion () {
      if (!this.selectedStream) return true
      else return this.$store.state.version === this.selectedStream.metadata.frontendVersion
    },

    isLive: {
      get () {
        return this.$store.state.isLive
      },
      set (value) {
        this.$store.commit('SET_ISLIVE', value)
      }
    },

    pickerSide: {
      get () {
        return this.$store.state.pickerSide
      },
      set (value) {
        this.$store.commit('SET_PICKER_SIDE', value)
      }
    },

    liveThumbnailTime () {
      return Date.now() - 10000
    },

    drawer: {
      get () {
        return this.$store.state.userSettings.drawer
      },
      set (value) {
        this.$store.commit('SET_USERSETTINGS_DRAWER', value)
      }
    }
  },

  methods: {
    activateDatePicker () {
      this.timePickerOpened = false
      this.datePickerOpened = !this.datePickerOpened
    },

    activateTimePicker () {
      this.datePickerOpened = false
      this.timePickerOpened = !this.timePickerOpened
    }
  },

  watch: {
    playerMode (value, oldValue) {
      if (value !== 'fragment') {
        this.timePickerOpened = false
        this.datePickerOpened = false
      }
    }
  },

  components: {
    StreamPicker,
    DvrTimePicker,
    DvrLive,
    UserSettingsList,
    VideoThumbnail
  }
}
</script>
