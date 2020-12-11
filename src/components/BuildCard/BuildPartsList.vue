<template>
  <dl>
    <template
      v-for="(item, i) in parts"
      :key="`${i}-${item['Full Part Name']}`"
    >
      <button
        class="pure-button"
        @click="$emit('removePart', i)"
      >
        X
      </button>
      <dd>
        {{ displayFilters.currency(item['Price']) }}
      </dd>
      <dd>
        {{ item['Part Type'] }}
      </dd>
      <dd class="part-name">
        {{ item['Full Part Name'] }}
      </dd>
    </template>
  </dl>

  <div class="input-group">
    <select
      v-model="selectedPartCategory"
    >
      <option
        v-for="category in categories"
        :key="category"
        :value="category.name"
      >
        {{ category.displayName || category.name }}
      </option>
    </select>
    <button
      class="pure-button"
      :disabled="!selectedPartCategory"
      @click="addNewItem"
    >
      Add
    </button>
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
  },
  emits: ['addNewItem', 'removePart'],

  data: () => ({
    selectedPartCategory: '',
  }),

  computed: {
    ...mapState({
      categories: 'categories',
    }),
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
  margin: 20px 0;
  padding: 0 10px;

  display: grid;
  justify-content: flex-start;
  grid-template-columns: auto auto auto;
  grid-gap: 0;

  @include md {
    grid-template-columns: auto auto auto 1fr;
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
        grid-column-end: 4;
      }
    }
  }
}
</style>
