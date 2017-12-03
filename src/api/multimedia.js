// import axios from 'axios'
// import _ from 'lodash'
// import Moment from 'moment'
// import { extendMoment } from 'moment-range'
// const moment = extendMoment(Moment)

const conf = {
  multimediaBase: 'http://multimedia.telesurtv.net',
  capturaBase: 'http://captura-telesur.openmultimedia.biz',
  storageBase: 'http://captura-saro.openmultimedia.biz:8020'
}

// function error (e) {
//   console.log(e)
// }

export default {

  getConversionUrl (conversionStatus) {
    return `${conf.storageBase}/${conversionStatus.fileName.split('/').pop()}`
  }

}
