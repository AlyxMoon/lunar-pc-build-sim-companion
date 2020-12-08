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

<script>
import { mapState } from 'vuex'

import DataTable from '@/components/DataTable'

export default {
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

    activeCategory () {
      if (!this.partType) return

      return this.categories.find(({ name }) => name === this.partType)
    },
  },
}
</script>

<style lang="scss" scoped>

.modal-body {
  overflow-y: auto;

  ::v-deep .table-wrapper-inner {
    height: 400px;
  }
}
</style>
