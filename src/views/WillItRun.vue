<template>
  <h1>Will It Run</h1>

  <DataTable
    :headers="headers"
    :items="programRequirements"
    search-field="name"
  >
    <template #column-0="{ item }">
      <button
        class="pure-button"
        title="Generate a minimal build that meets the requirements"
        @click="generateBuild(item)"
      >
        Generate Build
      </button>
    </template>
  </DataTable>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import generateBuild from '@/lib/util/generateBuildMeetsProgramRequirements'

import DataTable from '@/components/DataTable'

export default {
  name: 'PageWillItRun',
  components: {
    DataTable,
  },

  data: () => ({
    headers: [
      { name: 'actions', displayName: '' },
      { name: 'name', displayName: 'Name' },
      { name: 'type', displayName: 'Type' },
      { name: 'cpuScore', displayName: 'CPU score' },
      { name: 'gpuScore', displayName: 'GPU Score' },
      { name: 'gpuVram', displayName: 'GPU VRAM (GB)' },
      { name: 'memory', displayName: 'Memory (GB)' },
      { name: 'storage', displayName: 'Storage (GB)' },
    ],
  }),

  computed: {
    ...mapState({
      programRequirements: 'programRequirements',
      parts: 'parts',
    }),
  },

  methods: {
    ...mapActions(['createBuild']),

    generateBuild (program) {
      const build = generateBuild(program, this.parts)

      this.createBuild(build)
      this.$router.push({ name: 'ActiveBuilds' })
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
