import axios from 'axios'
import urljoin from 'url-join'
// import _ from 'lodash'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)
require('moment-duration-format')

// const apiBase = 'http://127.0.0.1:8000/api'
const apiBase = 'http://dvr.omedia.io/api'

function error (e) {
  console.log('Backend API error: ', e)
}

export default {
  /**
   * Get DVR Converter stores
   */
  getStreams (cb) {
    return axios.get(urljoin(apiBase, 'streams/'))
      .then(({ data }) => { cb(data) })
      .catch(e => error(e))
  },

  getStreamDetails (stream, cb) {
    return axios.get(urljoin(apiBase, 'streams', stream.id, '/'))
      .then(({ data }) => { cb(data) })
      .catch(e => error(e))
  },

  requestConversions (stream, cb) {
    return axios.get(urljoin(apiBase, 'conversions/'), {
      params: { stream: stream.id }
    })
    .then(({ data }) => { cb(data) })
    .catch(e => error(e))
  },

  getThumbnailUrl (stream, time) {
    const fileName = `${stream.metadata.wseStream}_${Math.ceil(moment(time).format('X'))}.jpg`
    return urljoin(stream.metadata.wseVodUrl, 'thumbnails', fileName)
  },

  requestConversion ({ stream, store, start, duration, metadata = {} }, cb) {
    const params = {
      stream: stream.id,
      dvr_store: store,
      start: moment(start).format(),
      duration: moment.duration(duration, 'seconds').format('HH:mm:ss.SS', { trim: false }),
      metadata: metadata
    }
    // console.log(params)
    return axios.post(urljoin(apiBase, 'conversions/'), params)
    .then(({ data }) => { cb(data) })
    .catch(e => error(e))
  },

  removeConversion (conv, cb) {
    return axios.delete(urljoin(apiBase, 'conversions', conv.id, '/'))
    .then(({ data }) => { cb(data) })
    .catch(e => error(e))
  }
}
