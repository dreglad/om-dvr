<template>
  <div>
    <video
      v-if="allDependenciesLoaded && !noVideoTag"
      ref="video"
      :controls="!!controls"
      :poster="poster"
      :autoplay="autoplay"
      :style="{ width: width, height: height, maxHeight: '85vh' }"
      :class="classObject"
      @timeupdate="(e) => { $emit('time', e.target.currentTime ) }"
      @playing="() => { $emit('playing') }"
      @ended="() => { $emit('ended') }"
      @pause="() => { $emit('pause') }"
      @play="() => { $emit('play') }"
      @progress="() => { $emit('progress') }"
      @durationchange="$emit('durationchange', $event.target.duration)"
      :playsinline="playsInline"
      :muted="$vuetify.breakpoint.smAndDown"
    >
      <source
        v-for="src in sources"
        :type="getSrcType(src)"
        :src="src.src || src"
      />
    {{ $t('unsupported') }}
    </video>
    <div
      v-else-if="noVideoTag"
      ref="playerWrapper"
      :style="{ width: width, height: height }"
    />
  </div>
</template>

<script>
// import jwplayer from './mixins/jwplayer.js'
// import videojs from './mixins/videojs.js'
// import flowplayer from './mixins/flowplayer.js'
import html5 from './videoPlayerMixins/html5.js'

export default {
  name: 'VideoPlayer',

  data () {
    return {
      dependenciesLoaded: {},
      time: null,
      noVideoTag: false,
      classObject: {}
    }
  },

  props: {
    brand: {
      type: String,
      default: 'html5',
      validator: (value) => ['jwplayer', 'videojs', 'html5', 'flowplayer'].includes(value)
    },
    paused: {
      type: Boolean,
      default: false
    },
    playsInline: {
      type: Boolean,
      default: false
    },
    startPosition: {
      type: Number,
      default: 0
    },
    initialCurrentTime: {
      type: Number,
      default: 0
    },
    sources: {
      type: Array,
      required: true
    },
    autoplay: {
      type: Boolean,
      default: false
    },
    poster: {
      type: String
    },
    controls: {
      type: Boolean,
      default: true
    },
    width: {
      type: [Number, String],
      default: '100%'
    },
    height: {
      type: [Number, String],
      default: 'auto'
    }
  },

  computed: {
    allDependenciesLoaded () {
      return Object.values(this.dependenciesLoaded).every(dep => dep)
    },
    hlsSource () {
      return this.sources.find(src => this.getSrcType(src) === 'application/x-mpegURL')
    }
  },

  methods: {
    getSrcType (src) {
      return src.type || {
        'm3u8': 'application/x-mpegURL',
        'mp4': 'video/mp4',
        'webm': 'video/webm',
        'ogg': 'video/ogg'
      }[src.split('.').pop()] || 'video'
    },

    injectJs (src, cb) {
      const scripts = Array.from(document.body.querySelectorAll('script')).map((script) => { return script.src })
      if (scripts.find((script) => script === src)) {
        setTimeout(cb, 0)
      } else {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = src
        script.addEventListener('load', cb)
        document.body.appendChild(script)
      }
    },

    injectCss (src, cb) {
      const style = document.createElement('link')
      style.setAttribute('rel', 'stylesheet')
      style.setAttribute('type', 'text/css')
      style.setAttribute('href', src)
      document.getElementsByTagName('head')[0].appendChild(style)
    }
  },

  // mixins: [html5, jwplayer, videojs, flowplayer]
  mixins: [html5]
}
</script>

<i18n>
{
  "en": {
    "unsupported": "Video format not supported"
  },
  "es": {
    "unsupported": "Formato de video no soportado"
  }
}
</i18n>