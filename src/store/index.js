import Vuex from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import createPersistedState from 'vuex-persistedstate'

const debug = process.env.NODE_ENV !== 'production'

const version = '0.3.0'

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
  conversions: [],
  sceneChanges: [],
  currentStoreName: null,
  multimediaItems: [],

  // Selected
  streamId: null,

  // Ephemeral video state
  videoTime: 0,
  seekTo: null,
  playing: false,
  ended: false,
  selectedSource: null,
  playerDuration: null,

  hoverTime: null,

  fragments: [],
  dvrItem: null,

  pickerSide: 0,

  userSettings: {
    preferredLanguage: null,
    username: 'admin',
    password: 'passpass',
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
  seenConversions: {},
  previousStreamId: null,
  version: version
}

export default () => {
  return new Vuex.Store({
    state,
    getters,
    actions,
    mutations,
    plugins: [
      createPersistedState({
        key: 'om',
        paths: [
          'userSettings',
          'seenConversions',
          'previousStreamId',
          // Auth
          'user', 'accessToken', 'idToken', 'authExpirationDate'
        ]
      })
    ],
    strict: debug
  })
}
