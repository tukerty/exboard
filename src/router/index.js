import Vue from 'vue'
import Router from 'vue-router'
import ExpressPanel from '@/components/ExpressPanel'
import Translator from '@/components/Translator'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ExpressPanel',
      component: ExpressPanel
    },
    {
      path: '/translator',
      name: 'Translator',
      component: Translator
    }
  ]
})
