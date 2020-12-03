import { createApp } from 'vue'

import './plugins/PureCSS/stylesheets'
import './plugins/FontAwesome/library'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import App from './App.vue'
import router from './router'
import store from './store'

createApp(App)
  .component('FontAwesomeIcon', FontAwesomeIcon)
  .use(store)
  .use(router)
  .mount('#app')
