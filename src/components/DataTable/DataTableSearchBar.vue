<template>
  <input
    type="search"
    placeholder="search..."
    :value="searchQuery"
    @input="updateSearchQuery($event.target.value)"
  >
</template>

<script>
import debounce from '@/lib/util/debounce'

export default {
  name: 'DataTableSearchBar',
  props: {
    searchQuery: {
      type: String,
      default: '',
    },
  },
  emits: ['update:searchQuery'],

  methods: {
    updateSearchQuery: debounce(function (value) {
      this.$emit('update:searchQuery', value)
    }, 500),
  },
}
</script>

<style lang="scss" scoped>

</style>
