<template>
  <v-app id="app" light>
    <v-navigation-drawer
      v-model="drawer"
      app
      fixed
      clipped
    >
      <v-list>
        <v-list-tile
          v-for="item in menu"
          :key="item.route"
          :to="{ name: item.route }"
          :exact="item.exact"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title || item.route }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app clipped-left fixed>
      <v-toolbar-title class="ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="drawer = !drawer" />
        <span class="hidden-xs-only">Open Multimedia</span>
      </v-toolbar-title>
      <v-spacer />
      <!-- <v-toolbar-items> -->
      <stream-selector />
      <!-- </v-toolbar-items> -->
      <v-btn icon large>
        <v-avatar size="32px" tile>
          <img
            src="./assets/logo.png"
            alt="OpenMultimedia"
          >
        </v-avatar>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container fluid full-height>
        <!-- <keep-alive> -->
        <router-view>
          <v-container fluid></v-container>
        </router-view>
        <!-- </keep-alive> -->
      </v-container>
    </v-content>
    <v-footer app></v-footer>
  </v-app>
</template>

<script>
import StreamSelector from '@/components/pickers/StreamSelector'

export default {
  name: 'app',
  data () {
    return {
      drawer: false,
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
          icon: 'subscriptions'
        },
        {
          route: 'Distribution',
          title: 'Distribución',
          icon: 'device_hub'
        }
      ]
    }
  },
  components: { StreamSelector }
}
</script>

<style>
#app {

}
</style>
