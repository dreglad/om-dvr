<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm10 md9>
      <div class="text-xs-center mb-4">
        <h1>v{{ $store.state.version }}</h1>
        <AppLogo />
        <h2>Open Multimedia</h2>
      </div>

      <v-card>
        <v-toolbar dark>
          <v-toolbar-title><v-icon small>edit</v-icon> ChangeLog</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon>bug_report</v-icon>
          </v-btn>
        </v-toolbar>
        <v-expansion-panel>
          <v-expansion-panel-content
            v-model="expanded[index]"
            v-for="(log, index) in versions"
            :key="log.version"
            >
            <div slot="header" class="pa-0">
              <big><strong>{{ log.version }}</strong> <small class="pl-3">{{ log.date.locale($store.getters.locale).format('LLLL') }}</small></big>
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
    </v-flex>
  </v-layout>
</template>

<script>
import moment from 'moment'

export default {

  name: 'PageAbout',

  // 'Si el usuario no ha ajustado un idioma preferido, se usa el idioma reportado en el perfil del usuario autenticado
  data () {
    return {
      expanded: [ true ],
      versions: [
        {
          version: '0.3.2',
          date: moment('2018-01-25 00:01:24'),
          changes: [
            'Se activó función para ajustar inicio y dutación de video arrastrando las pestañas flotantes dentro del reproductor de video'
          ]
        },
        {
          version: '0.3.1',
          date: moment('2018-01-25 00:01:24'),
          changes: [
            'Se agregó la noción de múltiples fragmentos en la línea de tiempo y en el panel de información',
            'Se agregó -polling- periódico automático de datos',
            'Se agregaron al Timeline los grupos "Multimedia clips" y "Multimedia programas"'
          ]
        },
        {
          version: '0.3.0',
          date: moment('2018-01-18 02:59:47'),
          changes: [
            'Se agregó capacidad multi-idioma y opción para elegir idioma en ajustes de usuario. Se agregó catálogo con traducciones de interfaz al Inglés.',
            'Se declara manifiesto de Aplicación Web Progresiva (PWA), con íconos y metadatos de aplicación',
            'El reproductor y sus cuadros flotantes varían de opacidad según la posición del cursor (demtro o fuera del reproductor o la barra de progreso) para enfocar selectivamente la visibilidad del video o de los indicadores de tiempo/posición/thumbnails.',
            'Los recuadros flotantes sobre el reproductor se pueden arrastrar hacia la izquierda/derecha como alternativo para modificar el incio y final del video',
            'Se agregó página "Acerca de" con Changelog y logotipo',
            'La barra roja que marca el tiempo actual se puede arrastrar para adelantar/retrasar el video con vista previa',
            'Se corrigió error en la tabla de la vista de conversiones donde el rango de fecha de la conversión se mostraba en diferente huso horario para el incio y para el final',
            'Reestricutra de la aplicación integrando nuxt.js'
          ]
        },
        {
          version: '0.2.8',
          date: moment('2018-01-08 01:29:19'),
          changes: [
            'Se agregó registro y autenticación de usuarios',
            'Se eliminó la sección de video en vivo. Ahora el video en vivo se activa a través del ícono correspondiente en la barra de heraamientas superior desde cualquier parte del sitio',
            'Se simplificaron los datos que se muestran en la tabla de conversiones',
            'Se mejoró el menú de ajustes de usuario',
            'Se movió el botón para generar nueva conversión que se encontraba en límite infrerior de la página hacia el panel de selección a la derecha del reproductor de video',
            'Todo el tráfico ahora es dirigido por conexiones seguras HTTPS'
          ]
        },
        {
          version: '0.2.7',
          date: moment('2018-01-03 01:15:32'),
          changes: [
            'Se agregó opción de configuración para ajustar la sensibilidad de la detección de los marcadores de cambios de escena. Se puede elegir un valor de entre 65% hasta 100%; entre mayor sea, la diferenca entre un cuadro y el sieguinte debe ser mayor para considerarse como un cambio de escena.',
            'Se agregó opción de configuración para ajustar el tiempo antes y después (relativo al video reprooduciéndose) en donde se muestras marcadores de cambio de escena sobre la línea de tiempo'
          ]
        },
        {
          version: '0.2.6',
          date: moment('2017-12-31 14:21:16'),
          changes: [
            'En el disco de selección de hora se agregó una barra de botones para elejir el modo en que se afecta el video actual, con cuatro modos: "elegir tiempo inicial", "elegir tiempo final", "elegir tiempo inicial sin mover tiempo final" y "elegir tiempo final sin mover incial".',
            'En la línea de tiempo se agregó grupo de marcadores auxiliares que indican posibles cambios de escena',
            'Con doble click sobre el eje numérico de la línea de tiempo, la reproducción se recorre al momento correspondiente',
            'Los selectores de fecha y tiempo ya no se cierran al hacer click fuera de ellos sino sólo al tocar el ícono nuevamente',
            'Los íconos para mostrar los selectores de fecha y hora ahora sólo se muestran en la sección Grabadora'
          ]
        },
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
          date: moment('2017-12-23 18:11:35'),
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