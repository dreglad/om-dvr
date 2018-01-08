<template>
  <v-container fluid fill-height>
    <v-layout
      justify-center
      align-center
    >
      <div v-if="error">
        <v-icon>error</v-icon> {{ error }}
        <v-btn to="/">Reintentar</v-btn>
      </div>
      <v-progress-circular v-else indeterminate />
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: 'app-login',
    props: ['auth'],

    data () {
      return {
        error: null
      }
    },

    mounted () {
      const defaultRoute = { name: 'Recorder' }
      if (!this.$store.getters.isAuthenticated) {
        this.$store.dispatch('parseSession', window.location.hash).then(() => {
          this.$router.replace(defaultRoute)
        }).catch(e => {
          console.log(e.message)
          // this.error = e.message
          this.$router.replace(defaultRoute)
        })
      } else {
        this.$router.replace(defaultRoute)
      }
    }
  }
</script>