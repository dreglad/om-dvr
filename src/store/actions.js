/* Actions */
import wowzaApi from '@/api/wowza'
import slugify from 'slugify'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)

export default {

  requestDvrStores ({ commit, state, getters, dispatch }, defaultStream) {
    wowzaApi.getStores(({ stores, conversions }) => {
      commit('RECEIVE_DVRSTORES', stores)
      commit('RECEIVE_CONVERSIONS', conversions)
      // select first stream if none selected
      if (state.stream == null && getters.streams.length) {
        dispatch('selectStream', defaultStream || getters.streams[0])
      }
    })
  },

  selectStream ({ commit, state, getters, dispatch }, stream) {
    commit('RESET_DVRSORE_DETAILS')
    commit('SET_DVRSTART', null)
    commit('SELECT_STREAM', stream)

    // state.dvrStores[stream].slice(0, 6)
    // .map(dvrStore => dispatch('getDvrStoreDetails', dvrStore))
    state.dvrStores[stream]
    .map(dvrStore => () => dispatch('getDvrStoreDetails', dvrStore))
    .reduce((curr, next) => curr.then(next), Promise.resolve())
  },

  updateLastStore ({ commit, state, getters, dispatch }) {
    if (state.stream) {
      dispatch('getDvrStoreDetails', state.dvrStores[state.stream][0])
    }
  },

  getDvrStoreDetails ({ commit, state, getters }, dvrStore) {
    return wowzaApi.getStoreDetails(dvrStore, details => {
      commit('RECEIVE_DVRSTORE_DETAILS', { dvrStore, details })
      if (!state.dvrStart) {
        let start = moment(getters.dvrAvailableMax).subtract(state.dvrDuration, 'seconds')
        if (start.isBefore(getters.dvrAvailableMin)) {
          start = moment(getters.dvrAvailableMin)
        }
        commit('SET_DVRSTART', start)
        // if (moment(start).add(state.dvrDuration, 'seconds').isAfter(getters.dvrAvailableMax)) {
        //   commit('SET_DVRDURATION', moment(getters.dvrAvailableMax).diff(start, 'seconds'))
        // }
      }
    })
  },

  setDvrDuration ({ commit, state, getters }, duration) {
    console.log(duration, 'intended')
    if (getters.dvrAvailableMax.isAfter(moment(state.dvrStart).add(duration, 'seconds'))) {
      commit('SET_DVRDURATION', duration)
    } else {
      commit('SET_DVRDURATION', moment(getters.dvrAvailableMax).diff(state.dvrStart, 'seconds'))
    }
    console.log(state.dvrDuration, 'last')
  },

  setDvrStart ({ commit, state, getters }, start) {
    commit('SET_DVRSTART', start)
    if (getters.dvrAvailableMax.isBefore(moment(state.dvrStart).add(state.dvrDuration, 'seconds'))) {
      console.log('maxxx')
      commit('SET_DVRDURATION', Math.abs(moment(getters.dvrAvailableMax).diff(state.dvrStart, 'seconds')))
    }
  },

  requestConversion ({ commit, state, getters }, options) {
    return wowzaApi.doConversionRequest({
      store: getters.dvrStoreDetails.dvrStoreName,
      start: state.dvrStart.format('x'),
      duration: Math.round(state.dvrDuration * 1000),
      filename: slugify(options.name) + '.mp4'
    }, result => {
      console.log(result)
    })
  }

}
