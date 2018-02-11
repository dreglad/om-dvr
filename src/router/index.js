import Vue from 'vue'
import Router from 'vue-router'
// import Meta from 'vue-meta'

// Layout components
import LayoutAnonymous from '@/components/LayoutAnonymous'
import LayoutAuthenticated from '@/components/LayoutAuthenticated'

// Page components
import PageAuthSignIn from '@/components/PageAuthSignIn'
import PageAuthSignOut from '@/components/PageAuthSignOut'
import PageVideos from '@/components/PageVideos'
import PageSeries from '@/components/PageSeries'
import PageAbout from '@/components/PageAbout'
import PageRecorder from '@/components/PageRecorder'

Vue.use(Router)
// Vue.use(Meta)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/auth',
      component: LayoutAnonymous,
      children: [
        {
          path: 'sign-in',
          name: 'SignIn',
          component: PageAuthSignIn
        },
        {
          path: 'sign-out',
          name: 'SignOut',
          component: PageAuthSignOut
        }
      ]
    },
    {
      path: '/',
      component: LayoutAuthenticated,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'recorder',
          name: 'Recorder',
          alias: '',
          children: [
            {
              path: 'video/:videoId',
              name: 'RecorderVideo'
            }
          ],
          component: PageRecorder
        },
        {
          path: 'videos',
          name: 'Videos',
          component: PageVideos
        },
        {
          path: 'series',
          name: 'Series',
          component: PageSeries
        },
        {
          path: 'about',
          name: 'About',
          component: PageAbout
        }
      ]
    }
  ]
})
