/* Mutations */
import Vue from 'vue'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)

export default {

  ADD_FRAGMENT (state, { start, duration, selected = false }) {
    state.fragments.push({ start: moment(start).toISOString(), duration, selected })
  },

  UPDATE_FRAGMENT (state, { fragment, start = null, duration = null, selected = null }) {
    // console.log(fragment, 'aa')
    // const old = { ...fragment }
    if (start) fragment.start = moment(start).toISOString()
    if (duration) fragment.duration = duration
    if (selected) fragment.selected = selected
    // if (state.dvrItem === fragment) {
    //   state.dvrItem = updatedFrag
    // }
  },

  DELETE_FRAGMENT (state, fragment) {
    if (state.dvrItem === fragment) {
      state.dvrItem = null
    }
    state.fragments.splice(state.fragments.indexOf(fragment), 1)
  },

  RESET_FRAGMENTS (state) {
    state.fragments = []
    state.dvrItem = null
  },

  SET_DVRITEM (state, item) {
    state.dvrItem = item
  },

  RECEIVE_USERIDENTITY (state, { authResult, user }) {
    state.accessToken = authResult.accessToken
    state.idToken = authResult.idToken
    state.user = user
    state.authExpirationDate = Date.now() + (authResult.expiresIn * 1000)
  },

  RESET_USERIDENTITY (state) {
    state.accessToken = null
    state.idToken = null
    state.user = null
    state.authExpirationDate = null
  },

  SET_STREAMID (state, streamId) {
    state.streamId = streamId
  },

  RECEIVE_DVRSTORES (state, dvrStores) {
    state.dvrStores = dvrStores
  },

  RECEIVE_STREAMS (state, streams) {
    state.streams = streams
  },

  SET_CURRENT_STORENAME (state, storeName) {
    state.currentStoreName = storeName
  },

  RECEIVE_CONVERSIONS (state, conversions) {
    state.conversions = conversions
  },

  RECEIVE_VIDEOS (state, videos) {
    state.videos = videos.map(video => {
      return {
        ...video,
        file: video.file
      }
    })
  },

  RECEIVE_SERIES (state, series) {
    state.series = series
  },

  RECEIVE_MULTIMEDIA_ITEMS (state, items) {
    state.multimediaItems = items
  },

  RESET_MULTIMEDIAITEMS (state, items) {
    state.multimediaItems = []
  },

  RECEIVE_SCENECHANGES (state, sceneChanges) {
    state.sceneChanges = sceneChanges
  },

  RECEIVE_DVRSTORE_DETAILS (state, details) {
    [...details].map(details => {
      details.utcRange = moment.range(moment.utc(details.utcStart, 'x'), moment.utc(details.utcEnd))
      Vue.set(state.dvrStoreDetails, details['dvrStoreName'], details)
    })
  },

  RESET_DVRSORE_DETAILS (state) {
    state.dvrStoreDetails = {}
  },

  SET_USERSETTINGNS_PREFERREDLANGUAGE (state, locale) {
    state.userSettings.preferredLanguage = locale
  },

  SET_USERSETTINGS_SCENECHANGEMINVALUE (state, value) {
    state.userSettings.sceneChangeMinValue = value
  },

  SET_USERSETTINGS_SCENECHANGEOFFSET (state, value) {
    state.userSettings.sceneChangeOffset = value
  },

  SET_USERSETTINGS_ONLYLEADINGSTORE (state, value) {
    state.userSettings.onlyLeadingStore = !!value
  },

  SET_USERSETTINGS_SHOWSCENECHANGES (state, value) {
    state.userSettings.showSceneChanges = !!value
  },

  SET_USERSETTINGS_SHOWMULTIMEDIACLIPS (state, value) {
    state.userSettings.showMultimediaClips = !!value
  },

  SET_USERSETTINGS_SHOWMULTIMEDIAPROGRAMAS (state, value) {
    state.userSettings.showMultimediaProgramas = !!value
  },

  SET_USERSETTINGNS_VIDEOHOVERSHADOW (state, value) {
    state.userSettings.videoHoverShadow = value
  },

  SET_USERSETTINGS_NATIVEVIDEOCONTROLS (state, value) {
    state.userSettings.nativeVideoControls = !!value
  },

  SET_PREVIOUS_STREAMID (state, streamId) {
    state.previousStreamId = streamId
  },

  SET_USERSETTINGS_DEFAULTDVRDURATION (state, value) {
    state.userSettings.defaultDvrDuration = value
  },

  SET_USERSETTINGS_DEFAULTPAGE (state, value) {
    state.userSettings.defaultPage = value
  },

  RESET_SEEN_CONVERSIONS (state) {
    Vue.set(state.seenConversions, state.streamId, state.conversions.map(conv => conv.id))
  },

  RESET_VIDEOS (state) {
    state.videos = []
  },

  RESET_SERIES (state) {
    state.series = []
  },

  SET_USERSETTINGS_DRAWER (state, value) {
    state.userSettings.drawer = !!value
  },

  SET_VIDEOID (state, id) {
    state.videoId = id
  },

  SET_VIDEOTIME (state, videoTime) {
    state.videoTime = videoTime
  },

  RESET_VIDEOTIME (state) {
    state.videoTime = 0
  },

  SET_SEEKTO (state, seekTo) {
    state.seekTo = seekTo
  },

  SET_HOVERTIME (state, time) {
    state.hoverTime = time
  },

  SET_ISLIVE (state, isLive) {
    state.isLive = !!isLive
  },

  SET_PLAYERMODE (state, mode) {
    state.playerMode = mode
  },

  RESET_PLAYERMODE (state) {
    state.playerMode = 'fragment'
  },

  SET_PLAYERDURATION (state, duration) {
    state.playerDuration = duration
  },

  RESET_PLAYERDURATION (state) {
    state.playerDuration = null
  },

  SET_PLAYING (state, playing) {
    state.playing = playing
  },

  SET_PICKER_SIDE (state, pickerSide) {
    state.pickerSide = pickerSide
  }

}
