
class PageTracker {
  install (app, {
    gtag,
    useComponentNameAsFallback = true,
    titlePrefix = '',
    changePageTitle = true,
  } = {}) {
    if (!gtag || !app.config.globalProperties.$router) return

    this.gtag = gtag

    this.setUpRouteWatcher(
      app.config.globalProperties.$router,
      { changePageTitle, titlePrefix, useComponentNameAsFallback },
    )

    app.provide('gtag', gtag)
  }

  setUpRouteWatcher (router, {
    changePageTitle,
    titlePrefix,
    useComponentNameAsFallback,
  }) {
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
