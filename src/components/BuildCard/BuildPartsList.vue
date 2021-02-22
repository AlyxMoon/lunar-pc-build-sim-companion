<template>
  <dl>
    <template
      v-for="category in categories"
      :key="category.name"
    >
      <dt>
        <button
          class="pure-button success add-new-button"
          @click="$emit('addNewPart', category.name)"
        >
          Add
        </button>
        {{ category.displayName }}
      </dt>

      <template
        v-for="(item, i) in partsOfCategory(category.partTypeNames)"
        :key="`${i}-${item['Full Part Name'] || item.nameFull}`"
      >
        <button
          class="pure-button danger"
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
          <option
            v-if="item.type === 'Case Fan'"
            value="New - Comes With Case"
          >
            New - Comes With Case
          </option>
          <option
            v-for="option in partStatusOptions"
            :key="option"
            :value="option"
          >
            {{ option }}
          </option>
        </select>

        <div />

        <dd>
          {{ displayFilters.currency(getPartPrice(item)) }}
          <span v-if="!item.isNewPart || item.isNewUsedPart || item.isPartOfCase">
            (New: {{ displayFilters.currency(item.Price || item.price) }})
          </span>
        </dd>

        <dd class="part-name">
          {{ item['Full Part Name'] || item.nameFull }}
        </dd>
      </template>
    </template>
  </dl>
</template>

<script lang="ts">
import { PlainObject, Parts, CategoryInterface } from '@/typings'
import { defineComponent, PropType } from 'vue'
import { mapState } from 'vuex'

export default defineComponent({
  name: 'BuildPartsList',
  props: {
    parts: {
      type: Array as PropType<Parts.BaseInterface[]>,
      default: (): Parts.BaseInterface[] => [],
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
    partStatusOptions: [
      'New',
      'New - Used Part',
      'Old - Keeping',
      'Old - Replacing',
    ],
  }),

  computed: {
    ...mapState({
      categories: 'categories',
    }),

    filteredCategories (): PlainObject[] {
      const categories = this.categories.slice() as CategoryInterface[]

      let hasCase = false
      let hasPowerSupply = false
      let hasMotherboard = false
      let hasCpu = false
      let hasCpuCooler = false

      this.parts.forEach(({ type }) => {
        hasCase = hasCase || type === 'Case'
        hasPowerSupply = hasPowerSupply || type === 'Power Supply'
        hasMotherboard = hasMotherboard || type === 'Motherboard'
        hasCpu = hasCpu || type === 'CPU'
        hasCpuCooler = hasCpuCooler || type === 'CPU Cooler'
      })

      if (hasCase) {
        const index = categories.findIndex(({ name }) => name === 'cases')
        categories.splice(index, 1)
      }

      if (hasPowerSupply) {
        const index = categories.findIndex(({ name }) => name === 'powersupplies')
        categories.splice(index, 1)
      }

      if (hasMotherboard) {
        const index = categories.findIndex(({ name }) => name === 'motherboards')
        categories.splice(index, 1)
      }

      if (hasCpu) {
        const index = categories.findIndex(({ name }) => name === 'cpus')
        categories.splice(index, 1)
      }

      if (hasCpuCooler) {
        const index = categories.findIndex(({ name }) => name === 'cpucoolers')
        categories.splice(index, 1)
      }

      return categories
    },
  },

  methods: {
    newOldStatusLabel (part: PlainObject): string {
      const isNewPart = part.isNewPart || false
      const isUsedPart = (part.isNewPart && part.isNewUsedPart) || false
      const isPartOfCase = part.isPartOfCase || false
      const isBeingKept = part.isBeingKept || false

      if (isPartOfCase) return 'New - Comes With Case'
      return isNewPart
        ? (isUsedPart ? 'New - Used Part' : 'New')
        : (isBeingKept ? 'Old - Keeping' : 'Old - Replacing')
    },

    changePartStatus (index: number, statusLabel: string): void {
      if (statusLabel === 'New') {
        this.$emit('updatePart', {
          index,
          newValues: { isNewPart: true, isNewUsedPart: false, isBeingKept: true, isPartOfCase: false },
        })
      }

      if (statusLabel === 'New - Comes With Case') {
        this.$emit('updatePart', {
          index,
          newValues: { isNewPart: true, isNewUsedPart: false, isBeingKept: true, isPartOfCase: true },
        })
      }

      if (statusLabel === 'New - Used Part') {
        this.$emit('updatePart', {
          index,
          newValues: { isNewPart: true, isNewUsedPart: true, isBeingKept: true, isPartOfCase: false },
        })
      }

      if (statusLabel === 'Old - Keeping') {
        this.$emit('updatePart', {
          index,
          newValues: { isNewPart: false, isNewUsedPart: false, isBeingKept: true, isPartOfCase: false },
        })
      }

      if (statusLabel === 'Old - Replacing') {
        this.$emit('updatePart', {
          index,
          newValues: { isNewPart: false, isNewUsedPart: false, isBeingKept: false, isPartOfCase: false },
        })
      }
    },

    partsOfCategory (partTypeNames: string[]): Parts.BaseInterface[] {
      return (this.parts as Parts.BaseInterface[])
        .map((item, index) => ({ ...item, originalIndex: index }))
        .filter((item: Parts.BaseInterface) => {
          const type: string = (item['Part Type'] || item.type) + ''
          return partTypeNames.includes(type)
        })
    },

    getPartPrice (part: PlainObject): number {
      if (!part.isNewPart || part.isPartOfCase) return 0

      return part.isNewUsedPart
        ? Math.floor((part.Price || part.price) * 1.25 / 3)
        : (part.Price || part.price)
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

    span {
      margin-left: 5px;
    }
  }
}

.pure-button {
  font-size: 0.9rem;

  border-radius: 0;
}

.add-new-button {
  margin-right: 10px;
}
</style>
