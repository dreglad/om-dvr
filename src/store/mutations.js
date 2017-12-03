/* Mutations */
import Vue from 'vue'
// import Moment from 'moment'
// import { extendMoment } from 'moment-range'
// const moment = extendMoment(Moment)

export default {

  SELECT_STREAM (state, stream) {
    state.stream = stream
  },

  RECEIVE_DVRSTORES (state, dvrStores) {
    state.dvrStores = dvrStores
  },

  RECEIVE_CONVERSIONS (state, conversions) {
    state.conversions = conversions
  },

  RECEIVE_DVRSTORE_DETAILS (state, { dvrStore, details }) {
    Vue.set(state.dvrStoreDetails, dvrStore, details)
  },

  RESET_DVRSORE_DETAILS (state) {
    state.dvrStoreDetails = {}
  },

  SET_DVRSTART (state, date) {
    state.dvrStart = date
  },

  SET_DVRDURATION (state, duration) {
    state.dvrDuration = duration
  }

}
