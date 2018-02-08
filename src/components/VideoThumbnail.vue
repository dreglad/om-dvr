<template>
  <img
    v-if="stream"
    :src="imgSrc"
    :width="width"
    :height="height"
    :alt="$t('labels.thumbnail')"
    @error="error"
  />
</template>

<script>
import { mapGetters } from 'vuex'
import backend from '@/api/backend'
import moment from 'moment'

export default {
  name: 'VideoThumbnail',

  data () {
    return {
      retries: 0
    }
  },

  props: {
    date: {
      type: [Number, Object],
      validator (value) {
        return moment(value).isValid()
      }
    },
    streamId: Number,
    width: [Number, String],
    height: [Number, String],
    maxRetries: {
      type: Number,
      default: 3,
      validator (value) {
        return value > 0
      }
    }
  },

  computed: {
    ...mapGetters([
      'selectedStream'
    ]),

    stream () {
      if (this.streamId) {
        return this.store.state.streams.find(stream => stream.id === this.streamId)
      }
      return this.selectedStream
    },

    imgSrc () {
      if (this.stream) {
        if (this.retries) {
          return backend.getThumbnailUrl(this.stream, moment(this.date).subtract(this.retries, 'seconds'))
        } else {
          return backend.getThumbnailUrl(this.stream, this.date)
        }
      }
    }
  },

  methods: {
    error () {
      console.debug('Thumbnail error, retrying')
      if (this.retries < this.maxRetries) {
        this.retries++
      }
    }
  }
}
</script>