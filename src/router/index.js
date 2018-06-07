import Vue from 'vue'
import Router from 'vue-router'
import Buefy from 'buefy'
import VueCookie from 'vue-cookie'

import ExpressPanel from '@/components/ExpressPanel'
import Translator from '@/components/Translator'

import '@mdi/font/css/materialdesignicons.min.css'
import 'buefy/lib/buefy.css'

Vue.use(Router)
Vue.use(Buefy)
Vue.use(VueCookie)

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
