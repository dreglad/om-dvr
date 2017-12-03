import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
// import createPersistedState from 'vuex-persistedstate'
// import createLogger from '../../../src/plugins/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

// const persistedState = createPersistedState({
//   paths: [
//     'options',
//     'dvrStart',
//     'dvrDuration',
//     'stream'
//   ]
// })

const state = {
  // Global
  stream: null,

  // dvr data
  dvrStores: {},
  dvrStoreDetails: {},

  // dvr position
  dvrDuration: 60 * 30,
  dvrStart: null,

  // convertions
  conversions: [],

  options: {
    defaultStream: null,
    defaultDvrStartOffset: 60 * 30,
    defaultDvrStartOffsetMode: 'now', // 'now', or any valid moment().startOf(String) parameter
    defaultDvrDuration: 60 * 30,
    defaultPosition: 'start', // 'start', 'end' or time in seconds
    hlsLevel: 'auto' // 'auto', or level
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  // plugins: [persistedState],
  strict: debug
})
