<template>
  <h1>Parts List</h1>

  <Accordion
    v-for="(category, index) of categories"
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
        :headers="headers[index]"
        :items="parts[category.name]"
      />
    </template>
  </Accordion>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapGetters, mapState } from 'vuex'

import Accordion from '@/components/Accordion.vue'
import DataTable from '@/components/DataTable/index.vue'

export default defineComponent({
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

    ...mapGetters({
      headers: 'modifiedCategoryHeaders',
    }),
  },
})
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
