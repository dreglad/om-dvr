import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const version = '0.3.9'

const state = {
  // i18n
  locales: {
    en: 'English',
    es: 'Español'
  },
  defaultLocale: 'es',

  currentTimestamp: Date.now(),

  isLive: false,

  // Auth
  user: null,
  accessToken: null,
  idToken: null,
  authExpirationDate: 0,

  // Remote data
  streams: [],
  dvrStores: {},
  dvrStoreDetails: {},
  sceneChanges: [],
  currentStoreName: null,
  multimediaItems: [],
  videos: [],
  series: [],

  // Selected
  playerMode: 'fragment',
  streamId: null,
  dvrItem: null,
  videoId: null,
  fragments: [],

  // Ephemeral video state
  videoTime: 0,
  seekTo: null,
  playing: false,
  ended: false,
  playerDuration: null,
  hoverTime: null,

  pickerSide: 0,

  userSettings: {
    clockFormat: 'ampm',
    preferredLanguage: null,
    nativeVideoControls: false,
    videoHoverShadow: true,
    onlyLeadingStore: true,
    defaultStream: null,
    defaultDvrStartOffset: 60 * 30,
    defaultDvrStartOffsetMode: 'now', // 'now', or any valid moment().startOf(String) parameter
    defaultDvrDuration: 60 * 30,
    defaultPosition: 'start', // 'start', 'end' or time in seconds
    drawer: false,
    showSceneChanges: true,
    sceneChangeMinValue: 0.80,
    sceneChangeOffset: 60 * 10,
    showMultimediaClips: true,
    showMultimediaProgramas: true
  },
  previousStreamId: null,
  version: version
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  plugins: [
    createPersistedState({
      key: 'storage',
      paths: [
        'userSettings',
        'seenConversions',
        'previousStreamId',
        // 'fragments',
        // Auth
        'user', 'accessToken', 'idToken', 'authExpirationDate'
      ]
    })
  ],
  strict: debug
})
