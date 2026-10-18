import type { App } from 'vue'
import type { Router } from 'vue-router'
import type { Store } from 'vuex'
import type { AppState } from '@/typings'

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[],
  }
}

class PageTracker {
  install (
    app: App,
    options: {
      store: Store<AppState>,
      enabled: boolean,
      containerId: string,
      titlePrefix?: string,
    },
  ): void {
    const router: Router = app.config.globalProperties.$router
    if (!router) return

    const { store, enabled, containerId, titlePrefix = '' } = options
    let ready = false
    let loaded = false
    let stopping = false

    const trackPage = (): void => {
      if (!ready || stopping || !enabled || !containerId || store.state.analyticsEnabled !== true) return

      window.dataLayer = window.dataLayer || []
      if (!loaded) {
        loaded = true
        window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
        const script = document.createElement('script')
        script.async = true
        script.src = `https://metrics.allisterbytes.com/gtm.js?id=${encodeURIComponent(containerId)}`
        document.head.appendChild(script)
      }

      window.dataLayer.push({
        event: 'page_view',
        page_path: router.currentRoute.value.fullPath,
        page_location: window.location.href,
        page_title: document.title,
      })
    }

    router.afterEach((to, _from, failure) => {
      if (failure) return
      document.title = titlePrefix + String(to.meta.title || to.name || to.path)
      trackPage()
    })

    void router.isReady().then(() => {
      ready = true
      trackPage()
    })

    store.subscribe(() => {
      if (store.state.analyticsEnabled === true) {
        if (!loaded) trackPage()
      } else if (loaded && !stopping) {
        stopping = true
        window.location.reload()
      }
    })
  }
}

export default PageTracker
