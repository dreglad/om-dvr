// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex, { mapGetters } from 'vuex'
import Vuetify from 'vuetify'
import VueI18n from 'vue-i18n'
import { VueExtendLayout, layout } from 'vue-extend-layout'
import router from './router'
import store from './store'
import AppLogo from '@/components/AppLogo'
import en from '@/locales/en.json'
import es from '@/locales/es.json'

Vue.config.productionTip = false

Vue.use(Vuetify)
Vue.use(Vuex)
Vue.use(VueI18n)
Vue.use(VueExtendLayout)

const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: { en, es },
  silentTranslationWarn: true
})

router.beforeEach((to, from, next) => {
  console.log('cpon', store().getters, from)
  if (to.meta.layout !== 'anonymous' && !store().getters.isAuthorized) {
    next({ name: 'sign-in' })
  }
  next()
})

Vue.component('AppLogo', AppLogo)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  router,
  store,
  ...layout,
  computed: mapGetters(['locale']),
  watch: {
    locale: {
      handler (locale) {
        console.log(locale)
        i18n.locale = locale
      },
      immediate: true
    }
  }
})
