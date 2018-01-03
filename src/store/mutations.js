/* Mutations */
import Vue from 'vue'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)

export default {

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

  SET_PLAYING (state, playing) {
    state.playing = playing
  },

  SET_PICKER_SIDE (state, pickerSide) {
    state.pickerSide = pickerSide
  }

}
