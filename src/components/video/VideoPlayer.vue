<template>
  <div>
    <video
      v-if="allDependenciesLoaded && !noVideoTag"
      ref="player"
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
      playsinline
    >
      <source
        v-for="src in sources"
        :type="getSrcType(src)"
        :src="src.src || src"
      >
    {{ $t('Video format not supported
    </video>
    <div
      v-else-if="noVideoTag"
      ref="playerWrapper"
      :style="{ width: width, height: height }"
    ></div>
    <canvas id="buffered_c" height="15" class="videoCentered" onclick="buffered_seek(event);"></canvas><br><br>
  </div>
</template>

<script>
// import Vue from 'vue'
import jwplayer from './mixins/jwplayer.js'
import videojs from './mixins/videojs.js'
import html5 from './mixins/html5.js'
import flowplayer from './mixins/flowplayer.js'

export default {

  name: 'video-player',

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
      type: [Number, String]
    },
    height: {
      type: [Number, String]
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

  mixins: [html5, jwplayer, videojs, flowplayer]
}
</script>

<i18n>
{
  "en": {
    "videoNotSupported": "Video format not supported"
  },
  "es": {
    "videoNotSupported": "Formato de video no soportado"
  }
}
</i18n>