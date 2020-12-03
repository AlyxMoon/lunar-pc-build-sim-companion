<template>
  <Navbar />

  <router-view />
</template>

<script>
import Navbar from '@/components/Navbar'

export default {
  name: 'App',
  components: {
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
</style>
