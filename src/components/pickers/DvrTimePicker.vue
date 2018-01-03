<template>
  <v-date-picker
    :landscape="$vuetify.breakpoint.smAndUp"
    v-if="type === 'date'"
    v-model="selectedDate"
    :allowed-dates="allowedDates"
    locale="es"
    :scrollable="true"
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
import { mapState, mapActions } from 'vuex'
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
      'dvrDuration',
      'dvrStoreDetails',
      'pickerSide',
      'videoTime'
    ]),

    selectedTime: {
      get () {
        switch (this.pickerSide) {
          case 0: // left
          case 2: // left & right pinned
            // return moment(this.dvrStart).add(this.videoTime, 'seconds').format('HH:mm')
            return moment(this.dvrStart).format('HH:mm')
          case 1: // right
          case 3: // right & left pinned
            return moment(this.dvrStart).add(this.dvrDuration, 'seconds').format('HH:mm')
        }
      },
      set (val) {
        const selectedMoment = moment(`${this.selectedDate} ${val}:0`, 'YYYY-MM-DD HH:mm:s')
        switch (this.pickerSide) {
          case 0: // left
            this.setDvrStart(selectedMoment)
            break
          case 1: // right
            this.setDvrStart(selectedMoment.subtract(moment.duration(this.dvrDuration, 'seconds')))
            break
          case 2: // left & right pinned
            this.setDvr({
              start: selectedMoment,
              duration: this.dvrDuration + moment(this.dvrStart).diff(selectedMoment, 'seconds')
            })
            break
          case 3: // right & left pinned
            this.setDvr({
              start: this.dvrStart,
              duration: selectedMoment.diff(this.dvrStart, 'seconds')
            })
            break
        }
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
      const selectedMoment = moment(`${this.selectedDate} ${hour}:0`, 'YYYY-MM-DD H:m')
      const inRange = Object.values(this.dvrStoreDetails).some(store => {
        return selectedMoment.range('hour').overlaps(store.utcRange)
      })
      switch (this.pickerSide) {
        case 0: // left
        case 1: // right
          return inRange
        case 2: // left & right pinned
          return inRange && selectedMoment.isBefore(moment(this.dvrStart).add(this.dvrDuration, 'seconds'))
        case 3: // right & left pinned
          return inRange && selectedMoment.isAfter(this.dvrStart)
      }
    },

    allowedMinutes (minute) {
      if (this.selectedDate && this.selectedTime) {
        const [ hour, , ] = this.selectedTime.split(':')
        const selectedMoment = moment(`${this.selectedDate} ${hour}:${minute}`, 'YYYY-MM-DD HH:m')
        const inRange = Object.values(this.dvrStoreDetails).some(store => {
          return store.utcRange.contains(selectedMoment)
        })
        switch (this.pickerSide) {
          case 0: // left
          case 1: // right
            return inRange
          case 2: // left & right pinned
            return inRange && selectedMoment.isBefore(moment(this.dvrStart).add(this.dvrDuration, 'seconds'))
          case 3: // right & left pinned
            return inRange && selectedMoment.isAfter(this.dvrStart)
        }
      }
      return false
    }

  }

}
</script>
