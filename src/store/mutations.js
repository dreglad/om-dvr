/* Mutations */
import Vue from 'vue'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)

export default {

  RECEIVE_USER_IDENTITY: (state, { authResult, user }) => {
    state.accessToken = authResult.accessToken
    state.idToken = authResult.idToken
    state.user = user
    state.authExpirationDate = Date.now() + (authResult.expiresIn * 1000)
  },

  FORGET_USER_IDENTITY: (state) => {
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

  RECEIVE_MULTIMEDIA_ITEMS (state, items) {
    state.multimediaItems = items
  },

  RECEIVE_SCENE_CHANGES (state, sceneChanges) {
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

  SET_DVRSTART (state, date) {
    state.dvrStart = date
  },

  SET_DVRDURATION (state, duration) {
    state.dvrDuration = duration
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

  RESET_CONVERSIONS (state) {
    state.conversions = []
  },

  SET_USERSETTINGS_DRAWER (state, value) {
    state.userSettings.drawer = !!value
  },

  SET_VIDEO_SOURCE (state, source) {
    state.videoSource = source
  },

  SET_VIDEO_TIME (state, videoTime) {
    state.videoTime = videoTime
  },

  SET_SEEK_TO (state, seekTo) {
    state.seekTo = seekTo
  },

  SET_HOVER_TIME (state, time) {
    state.hoverTime = time
  },

  SET_ISLIVE (state, isLive) {
    state.isLive = !!isLive
  },

  SET_PLAYING (state, playing) {
    state.playing = playing
  },

  SET_PICKER_SIDE (state, pickerSide) {
    state.pickerSide = pickerSide
  }

}
