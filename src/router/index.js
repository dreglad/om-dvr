import Vue from 'vue'
import Router from 'vue-router'
import AppConversions from '@/components/AppConversions'
import AppDvr from '@/components/AppDvr'
import AppLive from '@/components/AppLive'
import AppSupport from '@/components/AppSupport'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/recorder',
      name: 'Recorder',
      component: AppDvr
    },
    {
      path: '/recorder/:stream',
      component: AppDvr
    },
    {
      path: '/recorder/:stream/:dvrStart',
      component: AppDvr
    },
    {
      path: '/recorder/:stream/:dvrDuration',
      component: AppDvr
    },
    {
      path: '/recorder/:stream/:dvrStart/:dvrDuration',
      component: AppDvr
    },
    {
      path: '/conversions',
      name: 'Conversions',
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
      component: AppSupport
    },
    {
      path: '/support',
      name: 'Support',
      component: AppSupport
    },
    {
      path: '/',
      redirect: { name: 'Live' }
    }
  ]
})
