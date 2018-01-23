/* Getters */
import WowzaApi from '@/api/wowza'
import _ from 'lodash'
import urljoin from 'url-join'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)
require('moment-duration-format')

export default {

  activeItem (state, getters) {
    if (state.dvrItem) {
      // Active item explicitly selected
      return state.dvrItem
    } else if (state.fragments.length) {
      // First found fragment
      return state.fragments[state.fragments.length - 1]
    }
  },

  dvrStart (state, getters) {
    if (getters.activeItem) {
      return getters.activeItem.start
    }
  },

  dvrDuration (state, getters) {
    if (getters.activeItem) {
      return getters.activeItem.duration
    }
  },

  /*
   * Whether we know the user's identiy
  */
  isAuthenticated (state) {
    return !!state.user
  },

  locale (state) {
    if (state.userSettings.preferredLanguage) {
      // user has specified their preferred language
      console.log('User settings locale')
      return state.userSettings.preferredLanguage
    } else if (state.user && state.user.locale in state.locales) {
      // preferred locale found in user profile
      console.log('user profile locale')
      return state.user.locale
    } else {
      // default locale
      console.log('default locale')
      return state.defaultLocale
    }
  },

  /*
   * Whether auth token hasn't expired
  */
  isAuthorized (state, getters) {
    return getters.isAuthenticated && state.currentTimestamp < state.authExpirationDate
  },

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
  // dvrStart (state, getters) {
  // return
  // },
  selectedSegment () {
  },

  dvrRange (state, getters) {
    const item = getters.activeItem
    if (item) {
      return moment.range(item.start, moment(item.start).add(item.duration, 'seconds'))
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
      return store.utcRange.contains(moment(getters.dvrStart))
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
        console.log('vieosdource')
        if (getters.selectedStoreDetails) {
          return WowzaApi.getPlaylistUrl({
            stream: getters.selectedStream,
            store: getters.selectedStoreDetails,
            currentStoreName: state.currentStoreName,
            start: getters.dvrStart,
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
          created_at: moment(conv.created_at),
          start: moment(conv.start),
          duration: moment.duration(conv.duration),
          url: urljoin(getters.selectedStream.metadata.wseVodUrl, conv.id + '.mp4'),
          end: moment(conv.end)
          // humanDuration: moment.duration(conv.duration, 'milliseconds').format(),
          // filesize: humanize.filesize(convStatus.fileSize),
        }
      })
    }
  }

}
