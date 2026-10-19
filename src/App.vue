<template>
  <header>
    <AppNavbar />
  </header>

  <main :class="mainClasses">
    <section>
      <router-view />
    </section>

    <AppFooter />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapState } from 'vuex'
import { useSystemDarkMode } from '@/lib/useSystemDarkMode'

import AppFooter from '@/components/layout/Footer.vue'
import AppNavbar from '@/components/layout/Navbar.vue'

export default defineComponent({
  name: 'App',
  components: {
    AppFooter,
    AppNavbar,
  },

  setup () {
    return { systemDarkMode: useSystemDarkMode() }
  },

  computed: {
    ...mapState({
      colorMode: 'colorMode',
    }),

    mainClasses (): string[] {
      return [
        `mode-${this.colorMode === 'system' ? (this.systemDarkMode ? 'dark' : 'light') : this.colorMode}`,
      ]
    },
  },
})
</script>
