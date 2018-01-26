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
          router
          :to="item.to"
          :key="i"
          v-for="(item, i) in items"
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
      color="primary"
      clipped-left
      :transition="false"
      fixed
      app
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

      <!-- Select time widget -->
      <v-menu offset-y full-width right
        v-if="$route.name == 'Recorder'"
        :close-on-click="false"
        :close-on-content-click="false"
        transition="slide-y-transition"
        :nudge-top="-10"
        v-model="timePickerOpened"
        :z-index="1"
        lazy
      >
        <v-btn slot="activator" icon
          :outline="timePickerOpened"
          @click="activateTimePicker"
        >
          <v-tooltip bottom>
            <v-icon slot="activator">query_builder</v-icon>
            <span>Elegir hora</span>
          </v-tooltip>
        </v-btn>
        <DvrTimePicker v-if="timePickerOpened" type="time" />
      </v-menu>

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
        <v-btn slot="activator" icon
          :outline="datePickerOpened"
          @click="activateDatePicker"
        >
          <v-tooltip bottom>
            <v-icon slot="activator">event</v-icon>
            <span>Elegir fecha</span>
          </v-tooltip>
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

      <router-view class="toolbar" name="toolbarItems"></router-view>

      <v-btn 
        @click.stop="rightDrawer = !rightDrawer"
        class="elevation-3 mr-2"
        small fab
      >
        <v-avatar size="32"><img :src="user.picture"></v-avatar>
      </v-btn>
    </v-toolbar>

    <v-content>
      <keep-alive>
        <router-view />
      </keep-alive>
    </v-content>

    <v-navigation-drawer
      temporary
      v-model="rightDrawer"
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
        // { icon: 'apps', title: 'links.dashboard', to: '/' },
        { icon: 'av_timer', title: 'links.recorder', to: { name: 'Recorder' } },
        { icon: 'fiber_smart_record', title: 'links.conversions', to: { name: 'Conversions' } },
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
    this.$store.dispatch('requestStreams').then(() => {
      this.$store.dispatch('requestConversions', { poll: 5000 })

      this.$store.dispatch('requestSceneChanges')

      this.multimediaItemsInterval = setInterval(() => {
        this.$store.dispatch('requestMultimediaItems')
      }, 60000)

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
      'locale'
    ]),

    ...mapState([
      'user'
    ]),

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

  components: {
    StreamPicker,
    DvrTimePicker,
    DvrLive,
    UserSettingsList,
    VideoThumbnail
  }
}
</script>
