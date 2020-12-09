<template>
  <div class="table-wrapper">
    <div class="table-wrapper-inner">
      <table class="pure-table pure-table-horizontal">
        <thead>
          <tr>
            <th v-if="includeAction" />
            <th
              v-for="header in headers"
              :key="header.name"
              @click="toggleSort(header.name)"
            >
              {{ header.displayName || header.name }}

              <FontAwesomeIcon
                v-if="sortBy === header.name"
                :class="{ ascending: !sortDesc }"
                icon="chevron-down"
              />
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="item in currentlyDisplayedItems"
            :key="item.toString()"
          >
            <td v-if="includeAction">
              <button
                class="pure-button"
                @click="$emit('selected', item)"
              >
                Select
              </button>
            </td>
            <td
              v-for="col in headers"
              :key="col.name"
            >
              <template v-if="col.filter && col.filter === 'currency'">
                {{ filters.currency(item[col.name]) }}
              </template>
              <template v-else>
                {{ item[col.name] }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="table-footer">
      <span>{{ currentPageText }}</span>

      <button
        class="pure-button"
        title="previous page"
        :disabled="onFirstPage"
        @click="pagination.page--"
      >
        <FontAwesomeIcon icon="chevron-left" />
      </button>

      <button
        class="pure-button"
        title="next page"
        :disabled="onLastPage"
        @click="pagination.page++"
      >
        <FontAwesomeIcon icon="chevron-right" />
      </button>
    </div>
  </div>
</template>

<script>
import currency from '@/lib/filters/currency'

export default {
  name: 'DataTable',
  props: {
    headers: {
      type: Array,
      default: () => [],
    },
    items: {
      type: Array,
      default: () => [],
    },
    includeAction: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['selected'],

  data: () => ({
    sortBy: '',
    sortDesc: true,

    pagination: {
      total: 0,
      perPage: 10,
      page: 0,
    },

    filters: {
      currency,
    },
  }),

  computed: {
    currentPageText () {
      const { total, perPage, page } = this.pagination
      if (!total) return 'No Items'

      const start = (page * perPage) + 1
      const end = Math.min(total, (page + 1) * perPage)

      return `${start} - ${end} of ${total}`
    },

    currentlyDisplayedItems () {
      const { perPage, page } = this.pagination
      return this.parsedItems.slice(page * perPage, (page + 1) * perPage)
    },

    onFirstPage () {
      return this.pagination.page === 0
    },

    onLastPage () {
      const { total, perPage, page } = this.pagination
      return page === Math.floor(total / perPage)
    },

    parsedItems () {
      if (!this.sortBy) return this.items

      return this.items.slice().sort((a, b) => {
        if (a[this.sortBy] < b[this.sortBy]) return this.sortDesc ? -1 : 1
        if (a[this.sortBy] > b[this.sortBy]) return this.sortDesc ? 1 : -1
        return 0
      })
    },
  },

  watch: {
    items (newVal) {
      this.updatePaginationOptions()
    },
  },

  created () {
    this.updatePaginationOptions()
  },

  methods: {
    toggleSort (name) {
      if (this.sortBy === name) {
        if (!this.sortDesc) {
          this.sortBy = ''
        }

        this.sortDesc = !this.sortDesc
      } else {
        this.sortBy = name
        this.sortDesc = true
      }
    },

    updatePaginationOptions () {
      this.pagination.total = this.items.length || 0
    },
  },
}
</script>

<style lang="scss" scoped>
.table-wrapper {
}

.table-wrapper-inner {
  width: 100%;

  overflow-x: auto;

  border: 1px solid #CECECE;
}

.table-footer {
  width: 100%;
  padding: 5px 10px;

  display: flex;
  align-items: center;
  justify-content: flex-end;

  border: 1px solid black {
    top: none;
  }

  button, span {
    margin: 0 5px;
  }
}

table {
  width: 100%;

  thead tr th {
    background-color: #CECECE;
    cursor: pointer;
    white-space: nowrap;
    user-select: none;

    svg {
      transition: transform 0.2s;

      &.ascending {
        transform: rotate(-180deg);
      }
    }
  }
}

</style>
