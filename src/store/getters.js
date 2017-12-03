/* Getters */
import WowzaApi from '@/api/wowza'
import _ from 'lodash'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)

export default {

  dvrStores (state) {
    return state.dvrStores
  },

  streams (state) {
    return Object.keys(state.dvrStores)
  },

  stream (state) {
    return state.stream
  },

  liveUrl (state) {
    if (state.stream) {
      return WowzaApi.getPlaylistUrl(state.stream)
    }
  },

  dvrAvailableMin (state, getters) {
    return moment(Math.min(..._.values(state.dvrStoreDetails).map(store => store.utcRange.start)))
  },

  dvrAvailableMax (state, getters) {
    return moment(Math.max(..._.values(state.dvrStoreDetails).map(store => store.utcRange.end)))
  },

  dvrStoreDetails (state, getters) {
    return Object.values(state.dvrStoreDetails).find(store => {
      return store.utcRange.contains(moment(state.dvrStart))
    })
  },

  dvrPlaylistUrl (state, getters) {
    WowzaApi.getPlaylistUrl(state.stream, { params: {} })
  },

  recordingUrl (state, getters) {
    const dvrStore = getters.dvrStoreDetails
    if (dvrStore) {
      return WowzaApi.getPlaylistUrl(dvrStore.dvrStoreName, {
        params: {
          wowzadvrplayliststart: moment.utc(state.dvrStart).format('YYYYMMDDHHmmss'),
          wowzadvrplaylistduration: Math.round((state.dvrDuration) * 1000)
        }
      })
    }
  }
}
