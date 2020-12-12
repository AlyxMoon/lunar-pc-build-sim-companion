<template>
  <dl>
    <template
      v-for="(item, i) in parts"
      :key="`${i}-${item['Full Part Name']}`"
    >
      <button
        class="pure-button"
        title="Remove Part"
        @click="$emit('removePart', i)"
      >
        <FontAwesomeIcon icon="times" />
      </button>

      <button
        v-if="!!showCopy"
        class="pure-button"
        :title="copyText"
        @click="$emit('copyPart', item)"
      >
        <FontAwesomeIcon icon="copy" />
      </button>
      <div v-else />

      <dd>
        {{ item['Part Type'] }}
      </dd>

      <dd>
        {{ displayFilters.currency(item['Price']) }}
      </dd>

      <dd class="part-name">
        {{ item['Full Part Name'] }}
      </dd>
    </template>
  </dl>

  <div class="input-group">
    <button
      class="pure-button"
      :disabled="!selectedPartCategory"
      @click="addNewItem"
    >
      Add
    </button>
    <select
      v-model="selectedPartCategory"
    >
      <option
        v-for="category in filteredCategories"
        :key="category"
        :value="category.name"
      >
        {{ category.displayName || category.name }}
      </option>
    </select>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'BuildPartsList',
  props: {
    parts: {
      type: Array,
      default: () => [],
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
  emits: ['addNewItem', 'copyPart', 'removePart'],

  data: () => ({
    selectedPartCategory: '',
  }),

  computed: {
    ...mapState({
      categories: 'categories',
    }),

    filteredCategories () {
      const categories = this.categories.slice()

      let hasCase
      let hasPowerSupply
      let hasMotherboard
      let hasCpu
      let hasCpuCooler

      this.parts.forEach(part => {
        const type = part['Part Type']

        if (type === 'Case') hasCase = true
        if (type === 'Power Supply') hasPowerSupply = true
        if (type === 'Motherboard') hasMotherboard = true
        if (type === 'CPU') hasCpu = true
        if (type.startsWith('CPU Cooler')) hasCpuCooler = true
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
    addNewItem () {
      this.$emit('addNewItem', this.selectedPartCategory)
      this.selectedPartCategory = ''
    },
  },
}
</script>

<style lang="scss" scoped>
dl {
  list-style: none;
  margin: 20px 0 0;
  padding: 0 10px;

  display: grid;
  justify-content: flex-start;
  grid-template-columns: auto auto auto 1fr;
  grid-gap: 0;

  @include md {
    grid-template-columns: repeat(4, auto) 1fr;
    grid-gap: 5px 3px;
  }

  dd {
    padding: 5px 10px;

    display: flex;
    align-items: center;

    border: 2px solid #E6E6E6;

    &:not(.part-name) {
      @include smAndBelow {
        border-bottom: none;
      }
    }

    &.part-name {
      @include smAndBelow {
        margin-bottom: 10px;
        grid-column-start: 1;
        grid-column-end: 5;
      }
    }
  }
}

.input-group {
  padding: 0 10px;

  input, select {
    flex-grow: 1;
  }
}
</style>
