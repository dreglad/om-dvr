<script>
import VTimePicker from 'vuetify/es5/components/VTimePicker'
import _ from 'lodash'

export default {
  name: 'TimePicker',
  extends: VTimePicker,
  methods: {
    onChange () {
      if (!this.selectingHour) {
        this.debounceEmitChange()
      }
      this.selectingHour = false
    },
    onInput (value) {
      if (this.selectingHour) {
        this.inputHour = this.isAmPm ? this.convert12to24(value, this.period) : value
      } else {
        this.inputMinute = value
        this.debounceEmitValue()
      }
    },
    debounceEmitValue: _.debounce(function () {
      this.emitValue()
    }, 200),
    debounceEmitChange: _.debounce(function () {
      this.$emit('change', this.value)
    }, 200)
  }
}
</script>