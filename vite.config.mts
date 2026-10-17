import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode, command, isPreview }) => {
  const env = loadEnv(mode, process.cwd(), 'VUE_APP_')
  const analyticsCode = env.VUE_APP_ANALYTICS_CODE

  return {
    base: command === 'build' || isPreview ? '/pc-build-sim-companion/' : '/',
    envPrefix: ['VITE_', 'VUE_APP_'],
    plugins: [
      vue(),
      {
        name: 'analytics',
        transformIndexHtml () {
          if (env.VUE_APP_ENABLE_ANALYTICS !== 'true' || !analyticsCode) return []

          const code = JSON.stringify(analyticsCode).replace(/</g, '\\u003c')
          return [{
            tag: 'script',
            injectTo: 'head',
            children: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://metrics.allisterbytes.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${code});`,
          }]
        },
      },
    ],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    css: {
      preprocessorOptions: {
        scss: { additionalData: '@use "@/styles/_variables.scss" as *;\n' },
      },
    },
    build: { outDir: 'dist' },
  }
})
