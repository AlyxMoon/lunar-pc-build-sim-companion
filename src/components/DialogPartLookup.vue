<template>
  <teleport to="body">
    <div
      class="modal-wrapper"
      @click="$emit('cancel')"
    >
      <div
        ref="dialog"
        class="modal"
        role="dialog"
        aria-modal="true"
        aria-label="Part Lookup"
        tabindex="-1"
        @click.stop
      >
        <div class="modal-title">
          <h2>Part Lookup</h2>
        </div>

        <div class="modal-body">
          <DataTable
            v-if="!!activeCategoryHeaders"
            :headers="activeCategoryHeaders"
            :items="parts[partType]"
            :include-action="true"
            @selected="$emit('selected', $event)"
          />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { PlainObject } from '@/typings'
import { defineComponent, ref } from 'vue'
import { mapGetters, mapState } from 'vuex'

import { useModalFocus } from '@/lib/useModalFocus'

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

  setup () {
    const dialog = ref<HTMLElement | null>(null)
    useModalFocus(dialog)
    return { dialog }
  },

  computed: {
    ...mapState({
      categories: 'categories',
      parts: 'parts',
    }),

    ...mapGetters({
      headers: 'modifiedCategoryHeaders',
    }),

    activeCategoryHeaders (): PlainObject[] | void {
      if (!this.partType) return

      const index = this.categories.findIndex(({ name }: { name: string }) => name === this.partType)

      return this.headers[index]
    },
  },

  mounted (): void {
    window.addEventListener('keydown', this.closeOnEscape)
  },

  beforeUnmount (): void {
    window.removeEventListener('keydown', this.closeOnEscape)
  },

  methods: {
    closeOnEscape (event: KeyboardEvent): void {
      if (event.key === 'Escape') this.$emit('cancel')
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
