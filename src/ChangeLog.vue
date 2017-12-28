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
        <div slot="header" class="pa-0">
          <big><strong>{{ log.version }}</strong> <small class="pl-3">{{ log.date.format('LLLL') }}</small></big>
        </div>
        <v-list dense class="pt-0 pb-0">
          <v-list-tile v-for="(change, index) in log.changes" :key="index" class="pa-0 ma-0">
            <v-list-tile-avatar><v-icon small>done</v-icon></v-list-tile-avatar>
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
          version: '0.2.5',
          date: moment('2017-12-28 00:52:35'),
          changes: [
            '(backend) Cambio de estrageia de archivado de transmisiones:  ahora después de alguna discontinuidad en la transmisión, no se graba en un nuevo bloque sino que se acumula la grabación den el bloque actual. Esto resta exactitud a la duración resultante de una conversión respecto a la duración solicitada, pero agiliza la carga de grabaciones.',
            'funcionalidad ex profeso de distrubución a Multimedia-teleSUR como Clip de video, con diálogo para metadatos ecenciales: nombre, descripción, tipo y programa',
            'Polling automático de conversiones en vista de Grabadora'
          ]
        },
        {
          version: '0.2.4',
          date: moment('2017-12-22 18:11:35'),
          changes: [
            'Funcionalidad ex profeso de distribución a Multimedia teleSUR como Video Capturado',
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
            'Se elimina variante mini de navigation-drawer',
            'Actualización a Vuetify alpha 3'
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

<style>
.expansion-panel__header {
  padding: 4px 12px;
}
</style>