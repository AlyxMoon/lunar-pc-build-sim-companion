<template>
  <h1>Will It Run</h1>

  <DataTable
    :headers="headers"
    :items="programRequirements"
    :search-field="['name', 'type']"
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

<script lang="ts">
import { ProgramRequirementsModelInterface } from '@/typings'

import { defineComponent } from 'vue'
import { mapActions, mapState } from 'vuex'

import generateBuild from '@/lib/util/generateBuildMeetsProgramRequirements'
import DataTable from '@/components/DataTable/index.vue'

export default defineComponent({
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
      { name: 'gpuVram', displayName: 'GPU VRAM' },
      { name: 'memory', displayName: 'Memory' },
      { name: 'storage', displayName: 'Storage' },
    ],
  }),

  computed: {
    ...mapState({
      programRequirements: 'programRequirements',
      parts: 'parts',
      playerLevel: 'playerLevel',
    }),
  },

  methods: {
    ...mapActions(['createBuild']),

    generateBuild (program: ProgramRequirementsModelInterface): void {
      const build = generateBuild(program, this.parts, {
        playerLevel: this.playerLevel,
      })

      this.createBuild(build)
      this.$router.push({ name: 'ActiveBuilds' })
    },
  },
})
</script>

<style lang="scss" scoped>

</style>
