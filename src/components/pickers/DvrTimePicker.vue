<template>
  <v-date-picker
    :landscape="$vuetify.breakpoint.smAndUp"
    v-if="type === 'date'"
    v-model="selectedDate"
    :allowed-dates="allowedDates"
    locale="es"
  />
  <v-time-picker
    :landscape="$vuetify.breakpoint.smAndUp"
    v-else-if="type === 'time'"
    v-model="selectedTime"
    :allowed-hours="allowedHours"
    :allowed-minutes="allowedMinutes"
    format="24hr"
  />
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)

export default {
  name: 'dvr-time-picker',

  props: {
    type: String,
    default: 'date'
  },

  computed: {
    ...mapState([
      'dvrStart',
      'timeSelectionMode',
      'dvrStoreDetails'
    ]),
    ...mapGetters([
    ]),

    selectedTime: {
      get () {
        if (this.dvrStart) {
          return moment(this.dvrStart).add(this.videoTime).format('HH:mm')
        } else {
          return moment().format('HH:mm')
        }
      },
      set (val) {
        this.setDvrStart(moment(`${this.selectedDate} ${val}:0`, 'YYYY-MM-DD HH:mm:s'))
      }
    },

    selectedDate: {
      get () {
        if (this.dvrStart) {
          return moment(this.dvrStart).add(this.videoTime).format('YYYY-MM-DD')
        } else {
          return moment().format('YYYY-MM-DD')
        }
      },
      set (val) {
        this.setDvrStart(moment(`${val} ${this.selectedTime}:0`, 'YYYY-MM-DD HH:mm:s'))
      }
    }

  },

  methods: {
    ...mapActions([
      'setDvr',
      'setDvrStart'
    ]),

    allowedDates (date) {
      return Object.values(this.dvrStoreDetails).some(store => {
        return moment(date, 'YYYY-MM-DD').range('day').overlaps(store.utcRange)
      })
    },

    allowedHours (hour) {
      return Object.values(this.dvrStoreDetails).some(store => {
        return moment(`${this.selectedDate} ${hour}:0`, 'YYYY-MM-DD H:m').range('hour').overlaps(store.utcRange)
      })
    },

    allowedMinutes (minute) {
      if (this.selectedDate && this.selectedTime) {
        const [ hour, , ] = this.selectedTime.split(':')
        return Object.values(this.dvrStoreDetails).some(store => {
          return store.utcRange.contains(moment(`${this.selectedDate} ${hour}:${minute}`, 'YYYY-MM-DD HH:m'))
        })
      }
      return false
    }

  }

}
</script>
