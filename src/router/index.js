import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import AppConversions from '@/components/AppConversions'
import AppDvr from '@/components/AppDvr'
import AppLive from '@/components/AppLive'
import AppLogin from '@/components/AppLogin'
import AppSupport from '@/components/AppSupport'

Vue.use(Router)

// const refreshToken = (to, from, next) => {
//   if (!store.getters.isAuthenticated && typeof store.state.auth0.refreshToken === 'string') {
//     return store.dispatch('auth0RefreshToken').then(() => next())
//   }

//   next()
// }

const loginRequired = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    return store.dispatch('login')
  }

  next()
}

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/recorder',
      name: 'Recorder',
      beforeEnter: loginRequired,
      component: AppDvr
    },
    {
      path: '/',
      name: 'Login',
      component: AppLogin
    },
    {
      path: '/conversions',
      name: 'Conversions',
      beforeEnter: loginRequired,
      component: AppConversions
    },
    {
      path: '/live',
      name: 'Live',
      component: AppLive
    },
    {
      path: '/videos',
      name: 'Videos',
      beforeEnter: loginRequired,
      component: AppSupport
    },
    {
      path: '/support',
      name: 'Support',
      beforeEnter: loginRequired,
      component: AppSupport
    }
  ]
})
