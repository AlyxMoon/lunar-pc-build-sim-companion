import { createApp } from 'vue'

import './plugins/PureCSS/stylesheets'
import './plugins/FontAwesome/library'
import pageTracker from './plugins/Gtag'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import './styles/main.scss'

import filtersMixin from '@/lib/filters'

import App from './App.vue'
import router from './router'
import store from './store'

createApp(App)
  .mixin(filtersMixin)
  .component('FontAwesomeIcon', FontAwesomeIcon)
  .use(store)
  .use(router)
  .use(pageTracker, {
    store,
    enabled: import.meta.env.VUE_APP_ENABLE_ANALYTICS === 'true',
    containerId: import.meta.env.VUE_APP_ANALYTICS_CODE || '',
    titlePrefix: 'Lunar\'s PCBS Companion | ',
  })
  .mount('#app')
