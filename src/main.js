import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'
import Vuetify from 'vuetify'
import App from './App'
import store from './store'

Vue.config.productionTip = false

Vue.use(Vuetify)
Vue.use(Vuex)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
