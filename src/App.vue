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
