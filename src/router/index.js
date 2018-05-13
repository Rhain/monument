import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Explore from '@/components/Explore'
import About from '@/components/About'
import Tutorial from '@/components/Tutorial'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/explore',
      name: 'Explore',
      component: Explore
    },
    {
      path: '/about',
      name: 'About',
      component: About
    },
    {
      path: '/tutorial',
      name: 'Tutorial',
      component: Tutorial
    },
  ]
})
