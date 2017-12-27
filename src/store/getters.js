/* Getters */
import WowzaApi from '@/api/wowza'
import _ from 'lodash'
import urljoin from 'url-join'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)
require('moment-duration-format')

export default {

  dvrDuration (state) {
    return state.dvrDuration || state.userSettings.defaultDvrDuration
  },

  // isCurrentStore (state, getters) {
  //   if (state.currentStoreName) {
  //     return getters.selectedStoreDetails === state.currentStoreName
  //   }
  // },

  selectedStream (state) {
    const streamId = state.streamId || state.userSettings.defaultStream
    if (streamId) {
      return state.streams.find(stream => stream.id === streamId)
    }
  },

  dvrMomentDuration (state, getters) {
    return moment.duration(getters.dvrDuration, 'seconds')
  },

  // inLastStore (state) {
  //   if (state.stream) {
  //     state.stores[state.stream]
  //   }
  // },

  liveUrl (state, getters) {
    if (getters.selectedStream) {
      const meta = getters.selectedStream.metadata
      const streamName = `smil:${meta.wseStream}.smil`
      return urljoin(meta.wseStreamingUrl, meta.wseApplication, streamName, 'playlist.m3u8')
    }
  },

  dvrRange (state, getters) {
    if (state.dvrStart) {
      return moment.range(state.dvrStart, moment(state.dvrStart).add(getters.dvrDuration, 'seconds'))
    }
  },

  dvrAvailableMin (state, getters) {
    return moment(Math.min(..._.values(state.dvrStoreDetails).map(store => store.utcRange.start)))
  },

  dvrAvailableMax (state, getters) {
    return moment(Math.max(..._.values(state.dvrStoreDetails).map(store => store.utcRange.end)))
  },

  selectedStoreDetails (state, getters) {
    return Object.values(state.dvrStoreDetails).find(store => {
      return store.utcRange.contains(moment(state.dvrStart))
    })
  },

  // dvrPlaylistUrl (state, getters) {
  //   if (getters.selectedStream) {
  //     WowzaApi.getPlaylistUrl({
  //       stream: getters.selectedStream,
  //       store: getters.selectedStoreDetails,
  //       currentStoreNAme: state.currentStoreName
  //     })
  //   }
  // },

  videoSource (state, getters) {
    switch (state.selectedSource) {
      case 'live':
      case 'conversion':
      case 'video':
      case 'dvr':
      default:
        if (getters.selectedStoreDetails) {
          return WowzaApi.getPlaylistUrl({
            stream: getters.selectedStream,
            store: getters.selectedStoreDetails,
            currentStoreName: state.currentStoreName,
            start: state.dvrStart,
            duration: getters.dvrDuration
          })
        }
    }
  },

  currentConversions (state, getters) {
    if (state.conversions) {
      return state.conversions.map(conv => {
        return {
          ...conv,
          created_at: moment(conv.created_at).local(),
          start: moment(conv.start).local(),
          duration: moment.duration(conv.duration),
          url: urljoin(getters.selectedStream.metadata.wseVodUrl, conv.id + '.mp4'),
          end: moment(conv.end).local()
          // humanDuration: moment.duration(conv.duration, 'milliseconds').format(),
          // filesize: humanize.filesize(convStatus.fileSize),
        }
      })
    }
  }
}
