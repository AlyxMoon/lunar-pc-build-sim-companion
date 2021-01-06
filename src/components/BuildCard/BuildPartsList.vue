<template>
  <dl>
    <template
      v-for="category in categories"
      :key="category.name"
    >
      <dt>
        <button
          class="pure-button add-new-button"
          @click="$emit('addNewPart', category.name)"
        >
          Add
        </button>
        {{ category.displayName }}
      </dt>

      <template
        v-for="(item, i) in partsOfCategory(category.partTypeNames)"
        :key="`${i}-${item['Full Part Name']}`"
      >
        <button
          class="pure-button"
          title="Remove Part"
          @click="$emit('removePart', item.originalIndex)"
        >
          <FontAwesomeIcon icon="times" />
        </button>

        <button
          class="pure-button"
          title="Add another of the same part"
          @click="$emit('copyPart', item)"
        >
          <FontAwesomeIcon icon="copy" />
        </button>

        <select
          :value="newOldStatusLabel(item)"
          @change="changePartStatus(item.originalIndex, $event.target.value)"
        >
          <option value="New">
            New
          </option>
          <option value="Old - Replacing">
            Old - Replacing
          </option>
          <option value="Old - Keeping">
            Old - Keeping
          </option>
        </select>

        <div />

        <dd>
          {{ displayFilters.currency(item['Price']) }}
        </dd>

        <dd class="part-name">
          {{ item['Full Part Name'] }}
        </dd>
      </template>
    </template>
  </dl>
</template>

<script lang="ts">
import { PlainObject } from '@/typings/interface'
import { defineComponent } from 'vue'
import { mapState } from 'vuex'

export default defineComponent({
  name: 'BuildPartsList',
  props: {
    parts: {
      type: Array,
      default: (): PlainObject[] => [],
    },
    showCopy: {
      type: Boolean,
      default: false,
    },
    copyText: {
      type: String,
      default: '',
    },
  },
  emits: ['addNewPart', 'copyPart', 'removePart', 'updatePart'],

  data: (): PlainObject => ({
    selectedPartCategory: '',
  }),

  computed: {
    ...mapState({
      categories: 'categories',
    }),

    filteredCategories (): PlainObject[] {
      const categories = this.categories.slice()

      let hasCase
      let hasPowerSupply
      let hasMotherboard
      let hasCpu
      let hasCpuCooler

      this.parts.forEach(part => {
        const type = (part as PlainObject)['Part Type'] || ''

        if (type === 'Case') hasCase = true
        if (type === 'Power Supply') hasPowerSupply = true
        if (type === 'Motherboard') hasMotherboard = true
        if (type === 'CPU') hasCpu = true
        if (type.startsWith('CPU Cooler')) hasCpuCooler = true
      })

      if (hasCase) {
        const index = categories.findIndex(({ name }: PlainObject) => name === 'cases')
        categories.splice(index, 1)
      }

      if (hasPowerSupply) {
        const index = categories.findIndex(({ name }: PlainObject) => name === 'powersupplies')
        categories.splice(index, 1)
      }

      if (hasMotherboard) {
        const index = categories.findIndex(({ name }: PlainObject) => name === 'motherboards')
        categories.splice(index, 1)
      }

      if (hasCpu) {
        const index = categories.findIndex(({ name }: PlainObject) => name === 'cpus')
        categories.splice(index, 1)
      }

      if (hasCpuCooler) {
        const index = categories.findIndex(({ name }: PlainObject) => name === 'cpucoolers')
        categories.splice(index, 1)
      }

      return categories
    },
  },

  methods: {
    newOldStatusLabel (part: PlainObject): string {
      const isNewPart = part.isNewPart || false
      const isBeingKept = part.isBeingKept || false

      return isNewPart
        ? 'New'
        : isBeingKept ? 'Old - Keeping' : 'Old - Replacing'
    },

    changePartStatus (index: number, statusLabel: string): void {
      if (statusLabel === 'New') {
        this.$emit('updatePart', {
          index,
          newValues: { isNewPart: true, isBeingKept: true },
        })
      }

      if (statusLabel === 'Old - Keeping') {
        this.$emit('updatePart', {
          index,
          newValues: { isNewPart: false, isBeingKept: true },
        })
      }

      if (statusLabel === 'Old - Replacing') {
        this.$emit('updatePart', {
          index,
          newValues: { isNewPart: false, isBeingKept: false },
        })
      }
    },

    partsOfCategory (partTypeNames: string[]): Parts.BaseInterface[] {
      return (this.parts as Parts.BaseInterface[])
        .map((item, index) => ({ ...item, originalIndex: index }))
        .filter(item => {
          const type: string = (item as Parts.BaseInterface)['Part Type'] + ''
          return partTypeNames.includes(type)
        })
    },
  },
})
</script>

<style lang="scss" scoped>
dl {
  list-style: none;
  margin: 10px 0 0;
  padding: 0 10px;

  display: grid;
  justify-content: flex-start;
  grid-template-columns: auto auto auto 1fr;
  grid-gap: 0;

  @include md {
    grid-template-columns: repeat(5, auto) 1fr;
    grid-gap: 5px 3px;
  }

  dt {
    grid-column-start: 1;
    grid-column-end: 5;
    margin: 20px 0 5px;

    display: flex;
    align-items: center;

    font-size: 1.2rem;

    @include md {
      grid-column-end: 7;
    }
  }

  dd {
    padding: 5px 10px;

    display: flex;
    align-items: center;

    border: 2px solid #E6E6E6;

    &.part-name {
      @include smAndBelow {
        grid-column-start: 2;
        grid-column-end: 5;
      }
    }
  }
}

.pure-button {
  padding: 5px 10px;
  font-size: 0.9rem;

  border-radius: 0;
}

.add-new-button {
  margin-right: 10px;
}
</style>
