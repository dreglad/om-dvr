<template>
  <v-layout column justify-center align-center fill-height>
    <AppLogo />
    <h1 class="ma-4">{{ $t('goodbye') }}</h1>
    <v-btn color="primary" to='SignIn'>{{ $t('auth.sign_in') }}</v-btn>
  </v-layout>
</template>

<script>
export default {

  name: 'PageAuthSignOut',

  mounted () {
    this.$store.commit('FORGET_USER_IDENTITY')
  },

  i18n: {
    messages: {
      en: {
        goodbye: 'Good bye'
      },
      es: {
        goodbye: 'Hasta luego'
      }
    }
  }

}
</script>