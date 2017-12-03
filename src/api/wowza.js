import axios from 'axios'
import _ from 'lodash'
import Moment from 'moment'
import querystring from 'querystring'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)

const _conf = {
  scheme: 'http',
  host: 'captura-saro.openmultimedia.biz',
  apiPort: 8087,
  streamingPort: 1935,
  server: '_defaultServer_',
  vhost: '_defaultVHost_',
  application: 'live',
  instance: '_definst_'
}

const streamingBase = `${_conf.scheme}://${_conf.host}:${_conf.streamingPort}`
const apiBase = `${_conf.scheme}://${_conf.host}:${_conf.apiPort}/v2`
const serverBase = `${apiBase}/servers/${_conf.server}`
const vhostBase = `${serverBase}/vhosts/${_conf.vhost}`
const applicationBase = `${vhostBase}/applications/${_conf.application}`
const instanceBase = `${applicationBase}/instances/${_conf.instance}`
const dvrstoresBase = `${instanceBase}/dvrstores`

function error (e) {
  console.log('Wowza API error: ', e)
}

export default {
  /**
   * Get DVR Converter stores
   */
  getStores (acb) {
    return axios.get(dvrstoresBase).then(({ data }) => {
      const SUFFIX = '_1080p'
      // const SUFFIX = '_240p'
      const stores = _.chain(data.dvrconverterstoresummary)
      .map(store => store.name)
      .filter(storename => storename.indexOf(SUFFIX) !== -1)
      .sortBy(storename => parseInt(storename.split('.').pop()))
      .reverse()
      .groupBy(storename => _.dropRight(storename.replace(SUFFIX, '').split('.')).join('.'))
      .value()
      acb({ stores: stores, conversions: data.groupConversionStatusList })
    })
    .catch(e => error(e))
  },

  getStoreDetails (store, cb) {
    return axios.get(`${dvrstoresBase}/${store}`).then(({ data }) => {
      const store = data.DvrConverterStore
      if ((store.utcEnd - store.utcStart) > 0) {
        store.utcRange = moment.range(moment.utc(store.utcStart, 'x'), moment.utc(store.utcEnd))
        cb(store)
      }
    })
  },

  doConversionRequest ({ store, start, duration, filename }, cb, err) {
    axios.put(`${dvrstoresBase}/actions/expire`).then(() => {
      axios.put(`${dvrstoresBase}/actions/convert?${querystring.stringify({
        // dvrConverterEndTime:
        dvrConverterStartTime: start,
        dvrConverterDuration: duration,
        dvrConverterOutputFilename: filename,
        dvrConverterStoreList: `${store}`
      })}`).then(({ data }) => {
        if (data.success) {
          cb(data.message)
        } else {
          err(data.message)
        }
      }).catch(e => error(e))
    })
  },

  getInstance (cb) {
    return axios.get(instanceBase)
    .then(response => cb(response.data))
    .catch(e => error(e))
  },

  getPlaylistUrl (stream, { ngrp = '_all', params = {} } = {}) {
    let qs = Object.keys(params).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&')
    if (params.wowzadvrplayliststart) {
      qs = 'DVR&' + qs
      return `${streamingBase}/${_conf.application}/smil:telesur-satmex6.stream.smil/playlist.m3u8` + (qs ? `?${qs}` : '')
      // return `${streamingBase}/${_conf.application}/ngrp:${stream}${ngrp}/playlist.m3u8` + (qs ? `?${qs}` : '')
      // if (stream.indexOf('english') === -1) {
      // return `${streamingBase}/${_conf.application}/smil:telesur-satmex6.stream.smil/playlist.m3u8` + (qs ? `?${qs}` : '')
      // } else {
      //   return `${streamingBase}/${_conf.application}/smil:telesur-english-venesat.stream.smil/playlist.m3u8` + (qs ? `?${qs}` : '')
      // }
    } else {
      return `${streamingBase}/${_conf.application}/ngrp:${stream}${ngrp}/playlist.m3u8` + (qs ? `?${qs}` : '')
    }
  }
}
