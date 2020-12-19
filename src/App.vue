<template>
  <header>
    <AppNavbar />
  </header>

  <main>
    <section>
      <router-view />
    </section>

    <AppFooter />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import AppFooter from '@/components/layout/Footer.vue'
import AppNavbar from '@/components/layout/Navbar.vue'

export default defineComponent({
  name: 'App',
  components: {
    AppFooter,
    AppNavbar,
  },

  created () {
    if (sessionStorage.redirect) {
      const redirect = sessionStorage.redirect
      delete sessionStorage.redirect
      this.$router.push(redirect)
    }
  },
})
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

main {
  height: calc(100vh - 50px);
  padding: 0 20px;

  display: flex;
  flex-direction: column;

  overflow-y: scroll;
}

main > section {
  flex-shrink: 0;
  min-height: 100vh;
}
</style>
