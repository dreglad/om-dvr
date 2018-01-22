/* Actions */
import backend from '@/api/backend'
import wowzaApi from '@/api/wowza'
import slugify from 'slugify'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)

export default {

  requestStreams ({ commit, state, dispatch }, { poll = 0 } = {}) {
    console.log('requesting streams')
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
    console.log('got store_details')
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

  selectStream ({ commit, state, getters, dispatch }, stream) {
    commit('RESET_DVRSORE_DETAILS')
    commit('RESET_CONVERSIONS')
    commit('SET_DVRSTART', null)
    commit('SET_VIDEO_TIME', 0)
    commit('SET_STREAMID', stream.id)
    commit('SET_PREVIOUS_STREAMID', stream.id)
    dispatch('requestStreamDetails', stream).then(() => {
      // RECORDER
      // Creates the segment
      if (!state.dvrStart) {
        let start = moment(getters.dvrAvailableMax).subtract(getters.dvrDuration, 'seconds')
        if (start.isBefore(getters.dvrAvailableMin)) {
          start = moment(getters.dvrAvailableMin)
        }
        commit('SET_DVRSTART', start)
      }

      // if (1 + 1 === 2 || (!state.userSettings.onlyLeadingStore && state.dvrStores)) {
      [...Object.values(state.dvrStores)[0]].slice(1, 10).map(dvrStore => {
        if (!state.dvrStoreDetails[dvrStore.dvrStoreName]) {
          dispatch('getDvrStoreDetails', dvrStore)
        }
      })
      // }
      // if ( && state.dvrStores) {
      //   // console.log(Object.values(state.dvrStores))
      //   dvrStores.splice(1, dvrStores.length).map(dvrStore => dispatch('getDvrStoreDetails', dvrStore))
      // }

      // state.dvrStores[stream].slice(1, 5)
      // .map(dvrStore => () => dispatch('getDvrStoreDetails', dvrStore))
      // .reduce((curr, next) => curr.then(next), Promise.resolve())
    })

    // CONVERSIONS
    // dispatch('requestConversions')
  },

  setDvr ({ commit }, { duration, start }) {
    commit('SET_DVRSTART', start)
    commit('SET_DVRDURATION', moment.isDuration(duration) ? duration.asSeconds() : duration)
  },

  getDvrStoreDetails ({ commit, state, getters }, dvrStore) {
    console.log('aagga')
    return wowzaApi.getStoreDetails(dvrStore.name, details => {
      console.log('aaa')
      commit('RECEIVE_DVRSTORE_DETAILS', details)
      // if (moment(start).add(getters.dvrDuration, 'seconds').isAfter(getters.dvrAvailableMax)) {
      //   commit('SET_DVRDURATION', moment(getters.dvrAvailableMax).diff(start, 'seconds'))
      // }
    })
  },

  setDvrDuration ({ commit, state, getters }, duration) {
    console.log(duration, 'intended')
    if (getters.dvrAvailableMax.isAfter(moment(state.dvrStart).add(duration, 'seconds'))) {
      commit('SET_DVRDURATION', duration)
    } else {
      commit('SET_DVRDURATION', moment(getters.dvrAvailableMax).diff(state.dvrStart, 'seconds'))
    }
  },

  setDvrStart ({ commit, state, getters }, start) {
    commit('SET_DVRSTART', start)
    if (getters.dvrAvailableMax.isBefore(moment(state.dvrStart).add(getters.dvrDuration, 'seconds'))) {
      commit('SET_DVRDURATION', Math.abs(moment(getters.dvrAvailableMax).diff(state.dvrStart, 'seconds')))
    }
  },

  requestWowzaConversion ({ commit, state, getters }, options) {
    return wowzaApi.doConversionRequest({
      store: getters.dvrStoreDetails.dvrStoreName,
      start: state.dvrStart.format('x'),
      duration: Math.round(getters.dvrDuration * 1000),
      filename: slugify(options.name) + '.mp4'
    }, result => {
      console.log(result)
    })
  },

  requestConversions ({ commit, getters, dispatch }, { poll = 0 } = {}) {
    console.log('requesting convs')
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

  requestConversion ({ commit, state, getters }, options) {
    return backend.requestConversion({
      stream: getters.selectedStream,
      store: getters.selectedStoreDetails.dvrStoreName,
      start: state.dvrStart,
      duration: getters.dvrDuration
    }, result => {
      console.log(result)
    })
  },

  removeConversion ({ dispatch }, conv) {
    return backend.removeConversion(conv, () => dispatch('requestConversions'))
  }

}
