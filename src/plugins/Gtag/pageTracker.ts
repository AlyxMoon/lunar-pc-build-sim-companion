import { App } from 'vue'
import { Router } from 'vue-router'

class PageTracker {
  gtag: Function = (): void => {}

  install (
    app: App,
    options: {
      gtag: Function,
      useComponentNameAsFallback?: boolean,
      titlePrefix?: string,
      changePageTitle?: boolean,
    },
  ): void {
    if (!app.config.globalProperties.$router) return
    const {
      gtag,
      useComponentNameAsFallback = true,
      titlePrefix = '',
      changePageTitle = true,
    } = options

    this.gtag = gtag || ((): void => {})

    this.setUpRouteWatcher(
      app.config.globalProperties.$router,
      { changePageTitle, titlePrefix, useComponentNameAsFallback },
    )

    app.provide('gtag', gtag)
  }

  setUpRouteWatcher (
    router: Router,
    options: {
      useComponentNameAsFallback: boolean,
      titlePrefix: string,
      changePageTitle: boolean,
    },
  ): void {
    const {
      useComponentNameAsFallback,
      titlePrefix,
      changePageTitle,
    } = options

    router.afterEach(to => {
      const pageName = titlePrefix + (
        to.meta.title ||
        to[useComponentNameAsFallback ? 'name' : 'path']
      )

      if (changePageTitle) {
        document.title = pageName
      }

      this.gtag('set', 'page', pageName)
      this.gtag('send', 'pageview')
    })
  }
}

export default PageTracker
