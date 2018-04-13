<template>
  <v-date-picker
    v-if="type === 'date'"
    v-model="selectedDate"
    :allowed-dates="allowedDates"
    :landscape="$vuetify.breakpoint.smAndUp"
    :locale="$store.getters.locale"
    class="elevation-11"
  />
  <TimePicker
    v-else
    v-model="selectedTime"
    :allowed-hours="allowedHours"
    :allowed-minutes="allowedMinutes"
    :format="$store.state.userSettings.clockFormat"
    :width="230"
    :landscape="false"
    class="elevation-0 t-picker"
    autosave
  />
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import TimePicker from './TimePicker'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)

export default {
  name: 'DvrTimePicker',

  data () {
    return {
      timeMode: 0
    }
  },

  props: {
    type: String,
    default: 'date'
  },

  computed: {
    ...mapState([
      'dvrStoreDetails',
      'videoTime'
    ]),

    ...mapGetters([
      'dvrStart',
      'dvrDuration'
    ]),

    selectedTime: {
      get () {
        switch (this.timeMode) {
          case 0: // left
          case 2: // left & right pinned
            // return moment(this.dvrStart).add(this.videoTime, 'seconds').format('HH:mm')
            return moment(this.dvrStart).format('HH:mm')
          case 1: // right
          case 3: // right & left pinned
            return moment(this.dvrStart).add(this.dvrDuration, 'seconds').format('HH:mm')
        }
      },
      set (value) {
        const selectedMoment = moment(`${this.selectedDate} ${value}:0`, 'YYYY-MM-DD HH:mm:s')
        switch (this.timeMode) {
          case 0: // left
            const inRange = Object.values(this.dvrStoreDetails).some(store => {
              return selectedMoment.range('hour').overlaps(store.utcRange)
            })
            if (inRange) {
              this.setDvrStart(selectedMoment)
            } else {
              this.setDvrStart(selectedMoment.minute(0))
            }
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
      switch (this.timeMode) {
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
      const [selectedDate, selectedTime] = [this.selectedDate, this.selectedTime]
      const storedetailValues = Object.values(this.dvrStoreDetails)
      if (selectedDate && selectedTime) {
        const [ hour, , ] = selectedTime.split(':')
        const selectedMoment = moment(`${selectedDate} ${hour}:${minute}`, 'YYYY-MM-DD HH:m')
        const inRange = storedetailValues.some(store => {
          return store.utcRange.contains(selectedMoment)
        })
        switch (this.timeMode) {
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
  },

  components: {
    TimePicker
  }

}
</script>

<style>
.t-picker .picker__title {
  padding: 0;
  margin: 0 auto;
}
.t-picker .picker__body {
  margin: 0 auto;
}
.t-picker .time-picker-title {
  justify-content: center;
}
.t-picker .time-picker-title__ampm {
  margin: 0;
  margin-left: 6px;
  margin-bottom: 3px;
}
.t-picker .time-picker-title__time .picker__title__btn,
.t-picker .time-picker-title__time span {
  height: 40px;
  font-size: 30px;
  text-align: center;
}
.t-picker .picker__title__btn {
  color: #ccc;
}
.t-picker .picker__title__btn.active {
  color: white;
}
.picker .accent {
  background-color: #1976d2 !important;
  border-color: #1976d2 !important;
}
</style>
