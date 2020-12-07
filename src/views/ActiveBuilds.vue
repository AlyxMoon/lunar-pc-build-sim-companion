<template>
  <h1>Active Builds</h1>

  <button
    class="pure-button"
    @click="createBuild"
  >
    Start New Build
  </button>

  <section class="build-card-grid">
    <BuildCard
      v-for="(build, i) in builds"
      :key="`${i}-${build.name}`"
      :build="build"
      @update="updateBuild({ data: $event, index: i })"
      @remove="removeBuild(i)"
    />
  </section>
</template>

<script>
import { mapActions, mapState } from 'vuex'

import BuildCard from '@/components/BuildCard'

export default {
  name: 'PageActiveBuilds',
  components: {
    BuildCard,
  },

  computed: {
    ...mapState({
      builds: 'builds',
    }),
  },

  methods: {
    ...mapActions(['createBuild', 'updateBuild', 'removeBuild']),
  },

  created () {

  },
}
</script>

<style lang="scss" scoped>
section.build-card-grid {
  max-width: 50em;
  margin: 30px 0;

  display: grid;
  grid-gap: 20px;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  justify-content: flex-start;
}
</style>
