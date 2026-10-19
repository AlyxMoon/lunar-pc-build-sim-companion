import { createRouter, createWebHistory } from 'vue-router'

import routes from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,

  scrollBehavior () {
    return { left: 0, top: 0 }
  },
})

export default router
