<template>
  <h1>Parts List</h1>

  <Accordion
    v-for="category of categories"
    :key="category">

    <template #header>
      <h3>{{ category }}</h3>
    </template>

    <template #content>
      <table class="pure-table pure-table-horizontal">
        <thead>
          <tr>
            <th>Part Type</th>
            <th>Part Name</th>
            <th>Manufacturer</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(part, i) in parts[category]"
            :key="i">
            <td>{{ part['Part Type'] }}</td>
            <td>{{ part['Part Name'] }}</td>
            <td>{{ part['Manufacturer'] }}</td>
          </tr>
        </tbody>
      </table>
    </template>
  </Accordion>
</template>

<script>
import { mapState } from 'vuex'

import Accordion from '@/components/Accordion'

export default {
  name: 'PagePartsList',
  components: {
    Accordion,
  },

  computed: {
    ...mapState({
      categories: 'categories',
      parts: 'parts',
    }),
  },
}
</script>

<style lang="scss" scoped>
table {
  width: 100%;
}
</style>
