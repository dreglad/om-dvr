<template>
  <v-app dark>
    <v-content>
      <v-container fluid fill-height>
        <router-view />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'LayoutAnonymous'
}
</script>