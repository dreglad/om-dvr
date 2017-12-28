import axios from 'axios'
import urljoin from 'url-join'
// import _ from 'lodash'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
import querystring from 'querystring'
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
  },

  distributeCaptura ({ profileId, conversionId }) {
    return axios.post('http://captura-telesur.openmultimedia.biz/cargar_captura/', querystring.stringify({
      archivo: `http://captura-saro.openmultimedia.biz:8020/${conversionId}.mp4`,
      idioma: profileId === 3 ? 'es' : 'en'
    }))
  },

  distributeMultimedia ({ profileId, conversionId, metadata }) {
    return axios.post('http://captura-telesur.openmultimedia.biz/crear_nuevo/', querystring.stringify({
      archivo_url: `http://captura-saro.openmultimedia.biz:8020/${conversionId}.mp4`,
      idioma: profileId === 1 ? 'es' : 'en',
      usuario_remoto: 'DVR',
      publicado: 0,
      ...metadata
    }))
  },

  getMetadataOptions (resource) {
    return axios.get('https://multimedia.telesurtv.net/api/' + resource + '/?ultimo=300&auth=yik24')
  }
}
