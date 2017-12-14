<template>
  <v-app id="app" dark>
    <v-navigation-drawer
      :mini-variant="miniMenu"
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
          <v-tooltip right :disabled="!miniMenu">
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
      color="light-blue accent-4"
      dark
      clipped-left
      fixed
      app
    >
      <v-toolbar-title class="ml-0 pl-3">
        <v-toolbar-side-icon @click="miniMenu = !miniMenu" />
        <v-btn icon large class="ml-3">
          <v-avatar size="32px" tile>
            <img src="./assets/logo.png" alt="OpenMultimedia">
          </v-avatar>
        </v-btn>
        <span class="hidden-xs-only">Open Multimedia <sup>v.{{ $store.state.version }}</sup></span>
      </v-toolbar-title>
      <v-spacer />
      <StreamSelector />
      <UserSettings />
      <!-- <v-toolbar-items> -->
      <!-- </v-toolbar-items> -->
    </v-toolbar>
    <v-content light>
      <v-container fluid fill-height>
        <!-- <keep-alive> -->
        <router-view>
        </router-view>
        <!-- </keep-alive> -->
      </v-container>
    </v-content>
    <!-- <v-footer app></v-footer> -->
  </v-app>
</template>

<script>
import StreamSelector from '@/components/pickers/StreamSelector'
import UserSettings from '@/components/pickers/UserSettings'
import _ from 'lodash'

export default {
  name: 'app',
  data () {
    return {
      menu: [
        {
          route: 'Live',
          title: 'En vivo',
          icon: 'live_tv'
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
          route: 'Support',
          title: 'Videos',
          icon: 'subscriptions'
        },
        {
          route: 'Support',
          title: 'Soporte',
          icon: 'live_help'
        }
      ]
    }
  },

  computed: {
    newConversions () {
      const state = this.$store.state
      if (state.seenConversions[state.streamId]) {
        const convIds = state.conversions.map(conv => conv.id)
        const seenIds = state.seenConversions[state.streamId]
        return _.difference(convIds, seenIds).length
      }
    },

    miniMenu: {
      get () {
        return this.$store.state.userSettings.miniMenu
      },
      set (value) {
        this.$store.commit('SET_USERSETTINGS_MINIMENU', value)
      }
    }
  },

  mounted () {
  },

  components: { StreamSelector, UserSettings }
}
</script>

<style>
#app {

}
</style>
