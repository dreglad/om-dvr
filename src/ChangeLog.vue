<template>
  <v-card>
    <v-toolbar dark>
      <v-toolbar-title><v-icon small>edit</v-icon> ChangeLog</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>bug_report</v-icon>
      </v-btn>
    </v-toolbar>
    <v-expansion-panel>
      <v-expansion-panel-content v-for="(log, index) in versions" key="version" v-model="expanded[index]">
        <div slot="header">
          <big><strong>{{ log.version }}</strong> <small class="pl-3">{{ log.date.format('LLLL') }}</small></big>
        </div>
        <v-list dense class="ml-4 pt-0">
          <v-list-tile v-for="(change, index) in log.changes" :key="index">
            <v-list-tile-content>{{ change }}</v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-card>
</template>

<script>
import moment from 'moment'
moment.locale('es')

export default {
  name: 'ChangeLog',

  data () {
    return {
      expanded: [ true ],
      versions: [
        {
          version: '0.2.4',
          date: moment('2017-12-22 18:11:35'),
          changes: [
            'Nuevo manejador de conexiones basado en axios'
          ]
        },
        {
          version: '0.2.3',
          date: moment('2017-12-22 18:11:35'),
          changes: [
            'Se reubicaron botones de activación de selectores de fecha y hora en Toolbar principal',
            'Se añade botón activador de en-vivo en Toolbar principal'
          ]
        },
        {
          version: '0.2.2',
          date: moment('2017-12-20 04:51:03'),
          changes: [
            'Versión inicial'
          ]
        },
        {
          version: '0.2.1',
          date: moment('2017-12-14 04:44:10'),
          changes: [
            'Se refactorizó arquitectura de componentes'
          ]
        },
        {
          version: '0.2.0',
          date: moment('2017-12-11 12:00:00'),
          changes: [
            'Se agregó Timeline',
            'Se agregó vue-router',
            'Se actualizó a Vue 2.4.5'
          ]
        },
        {
          version: '0.1.0',
          date: moment('2017-11-31 3:04:14'),
          changes: [
            'Versión inicial'
          ]
        }
      ]
    }
  }
}
</script>