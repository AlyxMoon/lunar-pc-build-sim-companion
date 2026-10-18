import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command, isPreview }) => {
  return {
    base: command === 'build' || isPreview ? '/pc-build-sim-companion/' : '/',
    envPrefix: ['VITE_', 'VUE_APP_'],
    plugins: [vue()],
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
