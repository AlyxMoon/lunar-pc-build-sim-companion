<template>
  <teleport to="body">
    <aside
      class="modal-wrapper"
      @click="$emit('cancel')"
    >
      <div
        class="modal"
        @click.stop
      >
        <div class="modal-title">
          <h2>Part Lookup</h2>
        </div>

        <div class="modal-body">
          <DataTable
            v-if="!!activeCategory"
            :headers="activeCategory.headers"
            :items="parts[partType]"
            :include-action="true"
            @selected="$emit('selected', $event)"
          />
        </div>
      </div>
    </aside>
  </teleport>
</template>

<script lang="ts">
import { PlainObject } from '@/typings/interface'
import { defineComponent } from 'vue'
import { mapState } from 'vuex'

import DataTable from '@/components/DataTable/index.vue'

export default defineComponent({
  name: 'PartLookup',
  components: {
    DataTable,
  },
  props: {
    partType: {
      type: String,
      default: '',
    },
  },
  emits: ['cancel', 'selected'],

  computed: {
    ...mapState({
      categories: 'categories',
      parts: 'parts',
    }),

    activeCategory (): PlainObject | void {
      if (!this.partType) return

      return this.categories.find(({ name }: { name: string }) => name === this.partType)
    },
  },
})
</script>

<style lang="scss" scoped>

.modal-body {
  overflow-y: auto;

  :deep(.table-wrapper-inner) {
    height: 400px;
  }
}
</style>
