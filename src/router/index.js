import Vue from 'vue'
import Router from 'vue-router'
import Buefy from 'buefy'
import ExpressPanel from '@/components/ExpressPanel'
import Translator from '@/components/Translator'

import 'buefy/lib/buefy.css'
import '@mdi/font/css/materialdesignicons.min.css'

Vue.use(Router)
Vue.use(Buefy)

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
