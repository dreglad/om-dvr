<template>
  <v-card v-if="selectedStream" class="elevation-6">

    <v-tabs v-model="selectedTab" show-arrows color="grey darken-3">
      <v-tabs-slider></v-tabs-slider>
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
        Fragmento {{ index + 1 }}
        <v-btn
          v-if="fragments.length > 1"
          @click.stop="() => { $nextTick(() => { $store.commit('DELETE_FRAGMENT', frag) }) }"
          class="ma-0 pa-0" icon small
        >
          <v-icon color="light-blue lighten-4" small>close</v-icon>
        </v-btn>
      </v-tab>
      <v-tab color="grey" href="#dvr-new">
        <v-btn class="" icon small>
          <v-icon>add</v-icon>
        </v-btn>
      </v-tab>
    </v-tabs>

    <v-card-text>
      <div class="subheading">{{ dvrRange.start.format('LL') }}</div>
      <div class="display-2">{{ $store.getters.dvrMomentDuration.format('hh:mm:ss', { trim: false }) }}</div>
      <div class="headline"><v-icon>query_builder</v-icon> {{ dvrRange.start.format('HH:mm:ss') }} a {{ dvrRange.end.format('HH:mm:ss') }}</div>
    </v-card-text>
    <!-- <v-card-text v-if="dvrRange">
        <div class="grey--text">{{ $t('dvr.duration ')}}: </div>
        <div class="grey--text">{{ $t('dvr.start ')}}: </div>
        <div class="grey--text">{{ $t('dvr.end ')}}: </div>
    </v-card-text> -->
    <v-card-actions>
      <v-btn
      v-if="allSelected"
      @click=""
    >
      {{ $t('labels.convert') }} {{ fragments.length }} fragmentos <v-icon right>fiber_smart_record</v-icon>
      </v-btn>
      <v-btn
      v-if="allSelected"
      @click=""
    >
      Convertir en uno solo <v-icon right>fiber_manual_record</v-icon>
      </v-btn>
      <v-btn
        v-else
        @click="doRequestConversion"
        :disabled="!canConvert"
      >
        {{ $t('labels.convert') }}
        <v-icon right>fiber_smart_record</v-icon>
      </v-btn>
    </v-card-actions>

    <v-snackbar
      :timeout="6000"
      :bottom="true"
      v-model="snackbar"
      :color="snackbarColor"
    >
      {{ snackbarText }}
      <v-btn flat @click.native="snackbar = false">Cerrar</v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'DvrPanel',

  data () {
    return {
      allSelected: false,
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'success'
    }
  },

  computed: {
    ...mapState([
      'fragments',
      'dvrItem'
    ]),
    ...mapGetters([
      'selectedStream',
      'dvrRange',
      'currentConversions',
      'selectedItems'
    ]),

    selectedTab: {
      get () {
        const [frags, active] = [this.fragments, this.dvrItem]
        if (this.allSelected && frags.length > 1) {
          return 'dvr-all'
        } else if (active) {
          return 'dvr-' + frags.indexOf(active)
        }
      },
      set (value) {
        console.log(value)
        this.allSelected = (value === 'dvr-all')
        if (value === 'dvr-new') {
          this.$store.dispatch('addFragment').then(() => {
            this.$nextTick(() => {
              this.$store.commit('SET_DVRITEM', this.fragments[this.fragments.length - 1])
            })
          })
        } else {
          console.log('por', this.allSelected)
          if (!this.allSelected) {
            const match = value.match(/dvr-(\d+)/)
            if (match) {
              console.log('matched!', this.fragments, match[1])
              this.$store.commit('SET_DVRITEM', this.fragments[match[1]])
            }
          }
        }
      }
    },

    canConvert () {
      return this.dvrRange && !this.currentConversions.some(conv => {
        return conv.start.utc().isSame(this.dvrStart) && this.dvrMomentDuration === conv.duration
      })
    }
  },

  methods: {
    ...mapActions([
      'requestConversion'
    ]),

    doRequestConversion () {
      this.requestConversion().then(() => {
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
  }
}
</script>