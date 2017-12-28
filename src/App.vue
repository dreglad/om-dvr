<template>
  <v-app id="app" dark>
    <v-navigation-drawer
      v-model="drawer"
      width="200"
      fixed
      clipped
      dark
      app
    >
      <v-list>
        <v-list-tile
          v-for="item in menu"
          :key="item.route"
          :to="{ name: item.route }"
          :exact="item.exact"
        >
          <v-tooltip right>
            <v-list-tile-action slot="activator">
              <v-badge v-if="item.route === 'Conversions' && newConversions" left>
                <span slot="badge">{{ newConversions }}</span>
                <v-icon>{{ item.icon }}</v-icon>
              </v-badge>
              <v-icon v-else>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <span>{{ item.title }}</span>
          </v-tooltip>
          
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title || item.route }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      dense
      color="light-blue accent-4"
      dark
      clipped-left
      fixed
      app
    >
      <v-toolbar-title class="ml-0 pl-3">
        <v-toolbar-side-icon @click="drawer = !drawer" />
        <v-btn icon large class="ml-3 hidden-sm-and-down">
          <v-avatar size="32px" tile>
            <img src="./assets/logo.png" alt="OpenMultimedia">
          </v-avatar>
        </v-btn>
        <span class="hidden-sm-and-down">Open Multimedia <sup><v-btn class="pa-0 ma-0" small flat @click="changelogOpened = !changelogOpened">v.{{ $store.state.version }}</v-btn></sup></span>
      </v-toolbar-title>
      
      <v-spacer />

      <v-tooltip left>
        <v-btn icon @click="isLive = !isLive" slot="activator">
          <v-icon v-if="isLive">cast_connected</v-icon>
          <v-icon v-else>cast</v-icon>
        </v-btn>
        <span>
          Activar en-vivo
          <br>
          <img :src="liveThumbnail" width="70" />
        </span>
      </v-tooltip>

      <!-- Select time widget -->
      <v-menu offset-y full-width right
        :close-on-content-click="false"
        transition="slide-y-transition"
        :nudge-top="-10"
      >
        <v-btn slot="activator" icon>
          <v-tooltip left>
            <v-icon slot="activator">query_builder</v-icon>
            <span>Elegir hora</span>
          </v-tooltip>
        </v-btn>
        <dvr-time-picker type="time" />
      </v-menu>

      <!-- Select date widget -->
      <v-menu offset-y full-width right
        :close-on-content-click="false"
        transition="slide-y-transition"
        :nudge-top="-10"
      >
        <v-btn slot="activator" icon>
          <v-tooltip left>
            <v-icon slot="activator">event</v-icon>
            <span>Elegir&nbsp;fecha</span>
          </v-tooltip>
        </v-btn>
        <dvr-time-picker type="date" />
      </v-menu>

      <StreamSelector />

      <UserSettings />
    </v-toolbar>
    <v-content>
      <v-container fluid class="pa-2">
        <!-- <keep-alive> -->
        <router-view></router-view>
        <!-- </keep-alive> -->
      </v-container>
    </v-content>
    <!-- <v-footer app></v-footer> -->

    <v-dialog v-model="changelogOpened" width="80%">
      <ChangeLog />
    </v-dialog>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import backend from '@/api/backend'
import ChangeLog from '@/ChangeLog'
import StreamSelector from '@/components/pickers/StreamSelector'
import UserSettings from '@/components/pickers/UserSettings'
import DvrTimePicker from '@/components/pickers/DvrTimePicker'
import _ from 'lodash'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)
require('moment-duration-format')

export default {
  name: 'app',
  data () {
    return {
      changelogOpened: false,
      currentTime: null,
      isLive: false,
      menu: [
        {
          route: 'Live',
          title: 'En vivo',
          icon: 'cast'
        },
        {
          route: 'Recorder',
          title: 'Grabadora',
          icon: 'av_timer'
        },
        {
          route: 'Conversions',
          title: 'Conversiones',
          icon: 'fiber_smart_record'
        },
        {
          route: 'Videos',
          title: 'Videos',
          icon: 'subscriptions'
        }
        // {
        //   route: 'Support',
        //   title: 'Soporte',
        //   icon: 'live_help'
        // }
      ]
    }
  },

  computed: {

    ...mapGetters([
      'selectedStream'
    ]),

    newConversions () {
      const state = this.$store.state
      if (state.seenConversions[state.streamId]) {
        const convIds = state.conversions.map(conv => conv.id)
        const seenIds = state.seenConversions[state.streamId]
        return _.difference(convIds, seenIds).length
      }
    },

    liveThumbnail () {
      if (this.selectedStream) {
        return backend.getThumbnailUrl(
          this.selectedStream,
          moment(this.currentTime).subtract(10, 'seconds')
        )
      }
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

  mounted () {
    this.currentTime = moment().subtract('seconds', 10)
    setInterval(() => {
      this.currentTime = moment().subtract('seconds', 10)
    }, 5000)
  },

  components: {
    DvrTimePicker,
    StreamSelector,
    UserSettings,
    ChangeLog
  }
}
</script>

<style>
#app {

}
</style>
