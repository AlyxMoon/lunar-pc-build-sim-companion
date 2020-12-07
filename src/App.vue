<template>
  <Navbar />

  <div class="app-wrapper">
    <div class="app-content">
      <router-view />
    </div>

    <Footer />
  </div>
</template>

<script>
import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'

export default {
  name: 'App',
  components: {
    Footer,
    Navbar,
  },

  created () {
    if (sessionStorage.redirect) {
      const redirect = sessionStorage.redirect
      delete sessionStorage.redirect
      this.$router.push(redirect)
    }
  },
}
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

body {
  font-size: 16px;
}

.app-wrapper {
  height: calc(100vh - 50px);
  padding: 0 20px;

  display: flex;
  flex-direction: column;

  overflow-y: scroll;
}

.app-content {
  flex-shrink: 0;
  min-height: 100vh;
}
</style>
