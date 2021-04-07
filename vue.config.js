module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/pc-build-sim-companion/'
    : '/',
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "@/styles/_variables.scss";',
      },
    },
  },
}
