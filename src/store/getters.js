/* Getters */
import WowzaApi from '@/api/wowza'
import _ from 'lodash'
import urljoin from 'url-join'
import backend from '@/api/backend'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)
require('moment-duration-format')

export default {

  canUndoFragment (state) {
    return state.fragmentDone.length > 1
  },

  canRedoFragment (state) {
    return state.fragmentUndone.length
  },

  activeItem (state, getters) {
    const [dvrItem, fragments] = [state.dvrItem, state.fragments]
    if (dvrItem) {
      // Active item explicitly selected
      return dvrItem
    } else if (fragments.length) {
      // First found fragment
      return fragments.slice(-1)[0]
    }
  },

  dvrStart (state, getters) {
    if (getters.activeItem) {
      return moment(getters.activeItem.start)
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
      return state.userSettings.preferredLanguage
    } else if (state.user && state.user.locale in state.locales) {
      // preferred locale found in user profile
      return state.user.locale
    } else {
      // default locale
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
      // const streamName = `smil:${meta.wseStream}.smil`
      const streamName = `${meta.wseStream}_360p`
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

  videoPoster (state, getters) {
    if (getters.videoSource) {
      switch (state.playerMode) {
        case 'fragment':
          return backend.getThumbnailUrl(getters.selectedStream, getters.activeItem.start)
        case 'video':
          if (getters.selectedVideo) {
            return backend.getThumbnailUrl(getters.selectedStream, getters.selectedVideo.start)
          }
      }
    }
  },

  videoSource (state, getters) {
    const video = getters.selectedVideo
    const storeDetails = getters.selectedStoreDetails
    switch (state.playerMode) {
      case 'video':
        if (!video) return null
        if (video.file && video.status === 'SUCCESS') {
          return `${video.file}/index.m3u8`
        } else if (video.sources.length) {
          return video.sources[0]
        } else {
          return null
        }
      case 'live':
        return getters.liveUrl
      case 'fragment':
      default:
        // console.log('aa', getters.selectedStoreDetails)
        if (storeDetails) {
          return WowzaApi
            .getPlaylistUrl({
              stream: getters.selectedStream,
              fragment: getters.activeItem
            })
        }
    }
  },

  selectedVideo (state, getters) {
    const videoId = state.videoId
    const videos = state.videos
    return videos.find(video => video.id === videoId)
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
