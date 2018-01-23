import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'
import PageAuthSignIn from '@/components/PageAuthSignIn'
import PageAuthSignOut from '@/components/PageAuthSignOut'
import PageConversions from '@/components/PageConversions'
import PageAbout from '@/components/PageAbout'
import PageRecorder from '@/components/PageRecorder'

Vue.use(Router)
Vue.use(Meta)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/auth/sign-in',
      name: 'sign-in',
      component: PageAuthSignIn,
      meta: { layout: 'anonymous' }
    },
    {
      path: '/auth/sign-out',
      name: 'sign-out',
      component: PageAuthSignOut,
      meta: { layout: 'anonymous' }
    },
    {
      path: '/recorder',
      name: 'recorder',
      component: PageRecorder
    },
    {
      path: '/conversions',
      name: 'conversions',
      component: PageConversions
    },
    {
      path: '/about',
      name: 'about',
      component: PageAbout
    },
    {
      path: '/',
      redirect: 'recorder'
    }
  ]
})

export default router
