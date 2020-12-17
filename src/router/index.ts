import { createRouter, createWebHistory } from 'vue-router'

import ActiveBuilds from '../views/ActiveBuilds.vue'
import BuildPlanner from '../views/BuildPlanner.vue'
import Home from '../views/Home.vue'
import Overclocking from '../views/Overclocking.vue'
import PartsList from '../views/PartsList.vue'
import WillItRun from '../views/WillItRun.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/builds',
    name: 'ActiveBuilds',
    component: ActiveBuilds,
  },
  {
    path: '/build-planner',
    name: 'BuildPlanner',
    component: BuildPlanner,
  },
  {
    path: '/overclocking',
    name: 'Overclocking',
    component: Overclocking,
  },
  {
    path: '/parts',
    name: 'PartsList',
    component: PartsList,
  },
  {
    path: '/will-it-run',
    name: 'WillItRun',
    component: WillItRun,
  },
  {
    path: '/:pathMath(.*)*',
    redirect: { name: 'Home' },
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
