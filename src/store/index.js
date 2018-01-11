import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import createPersistedState from 'vuex-persistedstate'
import auth0 from './modules/auth0'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const version = '0.2.8'
const persistedState = createPersistedState({
  key: 'dvr-2',
  paths: [
    'userSettings',
    'seenConversions',
    'previousStreamId'
  ]
})
const loginPersistentState = createPersistedState({
  key: 'auth0',
  paths: ['auth0.accessToken', 'auth0.idToken', 'auth0.expiresIn', 'auth0.user']
})

const state = {
  // Remote data
  streams: [],
  dvrStores: {},
  dvrStoreDetails: {},
  conversions: [],
  sceneChanges: [],
  currentStoreName: null,

  // Selected
  streamId: null,
  dvrStart: null,
  dvrDuration: null,

  // Ephemeral video state
  videoTime: 0,
  seekTo: null,
  playing: false,
  ended: false,
  selectedSource: null,

  segments: [],

  // Persistent

  pickerSide: 0, // left

  userSettings: {
    username: 'admin',
    password: 'passpass',
    onlyLeadingStore: true,
    defaultStream: null,
    defaultDvrStartOffset: 60 * 30,
    defaultDvrStartOffsetMode: 'now', // 'now', or any valid moment().startOf(String) parameter
    defaultDvrDuration: 60 * 30,
    defaultPosition: 'start', // 'start', 'end' or time in seconds
    hlsLevel: 'auto', // 'auto', or level
    defaultPage: 'Live',
    drawer: false,
    showSceneChanges: true,
    sceneChangeMinValue: 0.80,
    sceneChangeOffset: 60 * 10
  },
  seenConversions: {},
  previousStreamId: null,
  version: version
}

export default new Vuex.Store({
  modules: {
    auth0
  },
  state,
  getters,
  actions,
  mutations,
  plugins: [ persistedState, loginPersistentState ],
  strict: debug
})
