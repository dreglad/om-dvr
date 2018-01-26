/* Actions */
import backend from '@/api/backend'
import wowzaApi from '@/api/wowza'
import slugify from 'slugify'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)

export default {

  requestStreams ({ commit, state, dispatch }, { poll = 0 } = {}) {
    const promise = backend.getStreams(streams => {
      commit('RECEIVE_STREAMS', streams)
      if (!state.streamId && streams.length) {
        // select default stream if none selected
        const stream = streams.find(stream => stream.id === state.previousStreamId) || streams[0]
        dispatch('selectStream', stream)
      }
    })
    if (poll) {
      promise
        .then(() => { setTimeout(() => dispatch('requestStreams', { poll }), poll) })
        .catch(() => { setTimeout(() => dispatch('requestStreams', { poll }), poll) })
    }
    return promise
  },

  requestStreamDetails ({ commit, dispatch }, stream, { poll = 0 } = {}) {
    const promise = backend.getStreamDetails(stream, details => {
      const data = details['provider_data']
      commit('RECEIVE_DVRSTORES', data['stores'])
      commit('RECEIVE_DVRSTORE_DETAILS', [
        ...data['current_store_details'],
        ...data['store_details'].filter(s => s.utcStart > 0)
      ])
      commit('SET_CURRENT_STORENAME', data['current_store_details'].dvrStoreName)
    })
    if (poll) {
      promise
        .then(() => { setTimeout(() => dispatch('requestStreamDetails', stream, { poll }), poll) })
        .catch(() => { setTimeout(() => dispatch('requestStreamDetails', stream, { poll }), poll) })
    }
    return promise
  },

  requestMultimediaItems ({ getters, commit, dispatch }, { poll = 0 } = {}) {
    const promise = backend.requestMultimediaClips(getters.selectedStream).then(({ data }) => {
      commit('RECEIVE_MULTIMEDIA_ITEMS', data)
    })
    if (poll) {
      promise
        .then(() => { setTimeout(() => dispatch('requestMultimediaItems', { poll }), poll) })
        .catch(() => { setTimeout(() => dispatch('requestMultimediaItems', { poll }), poll) })
    }
    return promise
  },

  // requestDvrStores ({ commit, state, getters, dispatch }, defaultStream) {
  //   wowzaApi.getStores(({ stores, conversions }) => {
  //     commit('RECEIVE_DVRSTORES', stores)
  //     commit('RECEIVE_CONVERSIONS', conversions)
  //     // select first stream if none selected
  //     if (state.stream == null && getters.streams.length) {
  //       dispatch('selectStream', defaultStream || getters.streams[0])
  //     }
  //   })
  // },
  addFragment ({ state, getters, commit }, { start = null, duration = null } = {}) {
    if (!start) {
      if (getters.activeItem) {
        start = moment(getters.activeItem.start).add(2, 'minutes')
      } else {
        start = moment(getters.dvrAvailableMax).subtract(state.userSettings.defaultDvrDuration + 60, 'seconds')
      }
    }
    if (start.isBefore(getters.dvrAvailableMin)) {
      start = getters.dvrAvailableMin
    }
    if (!duration) {
      duration = state.userSettings.defaultDvrDuration
    }
    const newEnd = moment(start).add(duration, 'seconds')
    if (newEnd.isAfter(getters.dvrAvailableMax)) {
      duration -= newEnd.diff(getters.dvrAvailableMax, 'seconds')
    }

    commit('ADD_FRAGMENT', { start, duration })
    // if (state.)
    // let start = moment(getters.dvrAvailableMax).subtract(, 'seconds')
    // if (!getters.dvrStart) {
    //     let start = moment(getters.dvrAvailableMax).subtract(getters.dvrDuration, 'seconds')
    //     if (start.isBefore(getters.dvrAvailableMin)) {
    //       start = moment(getters.dvrAvailableMin)
    //     }
    //     let duration = state.userSettings.defaultDvrDuration
    //     const end = moment(start).add(duration, 'seconds')
    //     let duration =
    //     if (.isAfter(getters.dvrAvailableMax)
    //     commit('SET_DVRSTART', start)
    //     if (!state.fragments.length) {
    //       // auto create first segment
    //       commit('ADD_FRAGMENT', { start: start, duration: getter.dvrDuration })
    //     }
  },

  selectStream ({ commit, state, dispatch }, stream) {
    commit('RESET_DVRSORE_DETAILS')
    commit('RESET_CONVERSIONS')
    commit('RESET_MULTIMEDIAITEMS')
    commit('SET_VIDEO_TIME', 0)
    commit('SET_STREAMID', stream.id)
    commit('SET_PREVIOUS_STREAMID', stream.id)
    // commit('RESET_FRAGMENTS', [])
    dispatch('requestStreamDetails', stream).then(() => {
      dispatch('requestMultimediaItems')
      if (!state.fragments.length) {
        dispatch('addFragment')
      }
    })
  },

  getDvrStoreDetails ({ commit }, dvrStore) {
    return wowzaApi.getStoreDetails(dvrStore.name, details => {
      commit('RECEIVE_DVRSTORE_DETAILS', details)
      // if (moment(start).add(getters.dvrDuration, 'seconds').isAfter(getters.dvrAvailableMax)) {
      //   commit('SET_DVRDURATION', moment(getters.dvrAvailableMax).diff(start, 'seconds'))
      // }
    })
  },

  setDvrDuration ({ commit, getters }, duration) {
    commit('UPDATE_FRAGMENT', { fragment: getters.activeItem, duration })
    // if (getters.dvrAvailableMax.isAfter(moment(getters.dvrStart).add(duration, 'seconds'))) {
    //   commit('SET_DVRDURATION', duration)
    // } else {
    //   commit('SET_DVRDURATION', moment(getters.dvrAvailableMax).diff(getters.dvrStart, 'seconds'))
    // }
  },

  setDvrStart ({ commit, getters }, start) {
    if (getters.activeItem) {
      commit('UPDATE_FRAGMENT', { fragment: getters.activeItem, start })
    } else {
      console.log('ERROR: tried to set dvr start with no active item')
    }
    // console.log(getters.activeItem.start.format())
    // if (getters.dvrAvailableMax.isBefore(moment(getters.dvrStart).add(getters.dvrDuration, 'seconds'))) {
    //   commit('SET_DVRDURATION', Math.abs(moment(getters.dvrAvailableMax).diff(getters.dvrStart, 'seconds')))
    // }
  },

  setDvr ({ commit, getters }, { start, duration }) {
    commit('UPDATE_FRAGMENT', { fragment: getters.activeItem, start, duration })
  },

  requestWowzaConversion ({ getters }, options) {
    return wowzaApi.doConversionRequest({
      store: getters.dvrStoreDetails.dvrStoreName,
      start: getters.dvrStart.format('x'),
      duration: Math.round(getters.dvrDuration * 1000),
      filename: slugify(options.name) + '.mp4'
    }, result => {
      console.log(result)
    })
  },

  requestConversions ({ commit, getters, dispatch }, { poll = 0 } = {}) {
    if (!getters.selectedStream) return
    const promise = backend.requestConversions(getters.selectedStream, convs => {
      commit('RECEIVE_CONVERSIONS', convs)
    })
    if (poll) {
      promise
        .then(() => { setTimeout(() => dispatch('requestConversions', { poll }), poll) })
        .catch(() => { setTimeout(() => dispatch('requestConversions', { poll }), poll) })
    }
    return promise
  },

  requestSceneChanges ({ commit, getters }) {
    if (getters.selectedStream) {
      return backend.requestSceneChanges(getters.selectedStream, sceneChanges => {
        commit('RECEIVE_SCENE_CHANGES', sceneChanges)
      })
    }
  },

  requestConversion ({ getters }, fragment) {
    return backend.requestConversion({
      stream: getters.selectedStream,
      store: getters.selectedStoreDetails.dvrStoreName,
      start: moment(fragment.start),
      duration: fragment.duration
    }, result => {
      console.log(result)
    })
  },

  removeConversion ({ dispatch }, conv) {
    return backend.removeConversion(conv, () => dispatch('requestConversions'))
  }

}
