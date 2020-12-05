
class PageTracker {
  install (vue, {
    gtag,
    useComponentNameAsFallback = true,
    prefix = '',
    changePageTitle = true,
  } = {}) {
    if (!gtag) return
    this.gtag = gtag

    const router = vue.config.globalProperties.$router
    this.setUpRouteWatcher(router, { changePageTitle, prefix, useComponentNameAsFallback })
  }

  setUpRouteWatcher (router, {
    changePageTitle,
    prefix,
    useComponentNameAsFallback,
  }) {
    router.afterEach(to => {
      const pageName = prefix + (
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
