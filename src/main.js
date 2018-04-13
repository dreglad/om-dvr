// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import { mapGetters } from 'vuex'
import Vuetify from 'vuetify'
import VueI18n from 'vue-i18n'
import { sync } from 'vuex-router-sync'
import router from './router'
import store from './store'
import AppLogo from '@/components/AppLogo'
import App from '@/App.vue'
import en from '@/locales/en.json'
import es from '@/locales/es.json'

Vue.config.productionTip = false

Vue.use(Vuetify)
Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: { en, es },
  silentTranslationWarn: true
})

router.beforeEach((to, from, next) => {
  // check if login requires and redirect accordingly
  if (to.matched.some(route => route.meta.requiresAuth) && !store.getters.isAuthorized) {
    next({ name: 'SignIn' })
  }
  next()
})

sync(store, router)

Vue.component('AppLogo', AppLogo)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  router,
  store,
  computed: mapGetters(['locale']),
  watch: {
    locale: {
      handler (locale) {
        i18n.locale = locale
      },
      immediate: true
    }
  },
  render: h => h(App)
})
