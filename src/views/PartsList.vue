<template>
  <h1>Parts List</h1>

  <Accordion
    v-for="category of categories"
    :key="category.name"
  >
    <template #header>
      <div
        class="icon-wrapper"
        :style="{ 'background-color': category.iconBackColor }"
      >
        <FontAwesomeIcon
          v-if="category.icon"
          :icon="category.icon"
        />
      </div>
      <h3>
        {{ category.displayName || category.name }}
      </h3>
    </template>

    <template #content>
      <DataTable
        :headers="[
          { name: 'Part Name' },
          { name: 'Manufacturer' },
          { name: 'Level' },
          { name: 'Price' },
        ]"
        :items="parts[category.name]"
      />
    </template>
  </Accordion>
</template>

<script>
import { mapState } from 'vuex'

import Accordion from '@/components/Accordion'
import DataTable from '@/components/DataTable'

export default {
  name: 'PagePartsList',
  components: {
    Accordion,
    DataTable,
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
.icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  height: 35px;
  width: 35px;
  margin-right: 10px;

  border: 1px solid black;
  color: white;
  font-size: 18px;
}
</style>
