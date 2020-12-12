<template>
  <h1>Will It Run</h1>

  <DataTable
    :headers="headers"
    :items="programRequirements"
    search-field="Name"
  />
</template>

<script>
import { mapState } from 'vuex'

import DataTable from '@/components/DataTable'

export default {
  name: 'PageWillItRun',
  components: {
    DataTable,
  },

  data: () => ({
    headers: [
      { name: 'Name' },
      { name: 'Type' },
      { name: 'CPU score' },
      { name: 'GPU score' },
      { name: 'VRAM' },
      { name: 'RAM (GB)' },
      { name: 'Storage (GB)' },
    ],
  }),

  computed: {
    ...mapState({
      programRequirements: 'programRequirements',
    }),
  },
}
</script>

<style lang="scss" scoped>

</style>
