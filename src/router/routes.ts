import type { RouteRecordRaw } from 'vue-router'

import ActiveBuilds from '../views/ActiveBuilds.vue'
import BuildPlanner from '../views/BuildPlanner.vue'
import Home from '../views/Home.vue'
import Overclocking from '../views/Overclocking.vue'
import PartsList from '../views/PartsList.vue'
import Settings from '../views/Settings.vue'
import WillItRun from '../views/WillItRun.vue'

const PrivacyPolicy = () => import('@/views/PrivacyPolicy.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'Home' },
  },
  {
    path: '/builds',
    name: 'ActiveBuilds',
    component: ActiveBuilds,
    meta: { title: 'Active Builds' },
  },
  {
    path: '/build-planner',
    name: 'BuildPlanner',
    component: BuildPlanner,
    meta: { title: 'Build Planner' },
  },
  {
    path: '/overclocking',
    name: 'Overclocking',
    component: Overclocking,
    meta: { title: 'Overclocking' },
  },
  {
    path: '/parts',
    name: 'PartsList',
    component: PartsList,
    meta: { title: 'Parts List' },
  },
  {
    path: '/will-it-run',
    name: 'WillItRun',
    component: WillItRun,
    meta: { title: 'Will It Run' },
  },

  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: { title: 'Settings' },
  },
  {
    path: '/privacy-policy',
    name: 'PrivacyPolicy',
    component: PrivacyPolicy,
    meta: { title: 'Privacy Policy' },
  },

  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'Home' },
  },
]

export default routes
