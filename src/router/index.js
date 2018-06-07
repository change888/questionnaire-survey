import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/pages/Home/router.js'
import Create from '@/pages/Create/router.js'
import Detail from '@/pages/Detail/router.js'
import Me from '@/pages/Me/router.js'
import Use from '@/pages/Use/router.js'
import List from '@/pages/List/router.js'
import Contact from '@/pages/Contact/router.js'


Vue.use(Router)

let routes = [];

routes.push.apply(routes, Home)
routes.push.apply(routes, Create)
routes.push.apply(routes, Detail)
routes.push.apply(routes, Me)
routes.push.apply(routes, Use)
routes.push.apply(routes, List)
routes.push.apply(routes, Contact)

export default new Router({
  routes: routes
})
