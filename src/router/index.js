import Vue from 'vue'
import Router from 'vue-router'
import AppConversions from '@/components/AppConversions'
import AppRecorder from '@/components/AppRecorder'
import AppLive from '@/components/AppLive'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/recorder',
      name: 'Recorder',
      component: AppRecorder
    },
    {
      path: '/recorder/:stream',
      component: AppRecorder
    },
    {
      path: '/recorder/:stream/:dvrStart/:dvrDuration',
      component: AppRecorder
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
      path: '/distribution',
      name: 'Distribution',
      component: AppConversions
    },
    {
      path: '/',
      redirect: { name: 'Recorder' }
    }
  ]
})
