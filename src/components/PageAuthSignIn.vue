<template>
  <v-layout column justify-center align-center fill-height>
    <AppLogo />
    <h1 class="ma-4">{{ $t('welcome') }}</h1>
    <div v-if="error">
      <v-icon>error</v-icon> {{ error }}
      <v-btn to="/">Reintentar</v-btn>
    </div>
    <v-progress-circular v-else indeterminate />
  </v-layout>
</template>

<script>
import { getWebAuth, checkSession, parseSession } from '@/api/auth0'

export default {

  name: 'PageAuthSignIn',
  layout: 'anonymous',

  data () {
    return {
      error: null
    }
  },

  mounted () {
    const fnc = this.$store.getters.isAuthenticated ? checkSession : parseSession
    fnc(this.webAuth)
      .then((userIdentity) => {
        this.$store.commit('RECEIVE_USER_IDENTITY', userIdentity)
        this.$router.replace(this.$route.query.next || { name: 'Recorder' })
      })
      .clusteratch(() => {
        this.webAuth.authorize()
      })
  },

  computed: {
    webAuth () {
      return getWebAuth({
        lang: this.$store.state.locale,
        redirectUri: `${this.$route.fullPath.split('#')[0]}`
      })
    }
  },

  i18n: {
    messages: {
      en: {
        welcome: 'Welcome'
      },
      es: {
        welcome: 'Bienvenido'
      }
    }
  }

}
</script>