<template>
  <div class="table-wrapper">
    <div class="table-header">
      <SearchBar
        v-model:searchQuery="searchQuery"
      />
    </div>

    <div class="table-body">
      <table class="pure-table pure-table-horizontal">
        <thead>
          <tr>
            <th v-if="includeAction" />
            <th
              v-for="header in headers"
              :key="header.name"
              @click="toggleSort(header.name)"
            >
              <template v-if="'displayName' in header">
                {{ header.displayName }}
              </template>
              <template v-else>
                {{ header.name }}
              </template>

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
              v-for="(col, index) in headers"
              :key="col.name"
            >
              <slot
                :name="`column-${index}`"
                :item="item"
                :value="item[col.name]"
              >
                <template v-if="col.filter && col.filter in displayFilters">
                  {{ displayFilters[col.filter](item[col.name]) }}
                </template>
                <template v-else>
                  {{ item.get ? item.get(col.name, true) : item[col.name] }}
                </template>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="table-footer">
      <div class="pull-left">
        <label for="check-player-level">
          <input
            v-model="checkPlayerLevel"
            :value="checkPlayerLevel"
            name="check-player-level"
            type="checkbox"
          >
          Check Player Level
        </label>
      </div>

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

<script lang="ts">
import { PlainObject } from '@/typings'
import { defineComponent } from 'vue'
import { mapState } from 'vuex'

import SearchBar from './DataTableSearchBar.vue'

export default defineComponent({
  name: 'DataTable',
  components: {
    SearchBar,
  },
  props: {
    headers: {
      type: Array,
      default: (): PlainObject[] => [],
    },
    items: {
      type: Array,
      default: (): PlainObject[] => [],
    },
    includeAction: {
      type: Boolean,
      default: false,
    },
    searchField: {
      type: [String, Array],
      default: 'nameFull',
    },
  },
  emits: ['selected'],

  data: () => ({
    sortBy: '',
    sortDesc: true,

    pagination: {
      perPage: 10,
      page: 0,
    },

    checkPlayerLevel: true,
    searchQuery: '',
  }),

  computed: {
    ...mapState({
      playerLevel: 'playerLevel',
    }),

    currentPageText (): string {
      const { perPage, page } = this.pagination
      const total = this.parsedItems.length
      if (!total) return 'No Items'

      const start = (page * perPage) + 1
      const end = Math.min(total, (page + 1) * perPage)

      return `${start} - ${end} of ${total}`
    },

    currentlyDisplayedItems (): any[] {
      const { perPage, page } = this.pagination
      return this.parsedItems.slice(page * perPage, (page + 1) * perPage)
    },

    onFirstPage (): boolean {
      return this.pagination.page === 0
    },

    onLastPage (): boolean {
      const { perPage, page } = this.pagination
      const total = this.parsedItems.length

      return page === Math.floor(total / perPage)
    },

    parsedItems (): any[] {
      const filtered = this.items.slice().filter((item: any) => {
        let valid = true

        if (valid && this.checkPlayerLevel) {
          const level = item.Level || item.level || 1
          valid = valid && level <= this.playerLevel
        }

        if (valid && this.searchQuery) {
          const fieldsToSearch = Array.isArray(this.searchField)
            ? this.searchField as string[]
            : [this.searchField]

          const searchQuery = this.searchQuery.toLowerCase()

          let anyFieldHasSearch = false
          for (const field of fieldsToSearch) {
            if (anyFieldHasSearch) break

            const valueRaw = (item[field] || '').toLowerCase()
            const valueDisplayed = item.get
              ? item.get(field, true).toLowerCase()
              : ''

            anyFieldHasSearch = (
              valueRaw.includes(searchQuery) ||
              valueDisplayed.includes(searchQuery)
            )
          }

          valid = valid && anyFieldHasSearch
        }

        return valid
      })

      if (!this.sortBy) return filtered

      return filtered.sort((a: any, b: any) => {
        if (a[this.sortBy] < b[this.sortBy]) return this.sortDesc ? -1 : 1
        if (a[this.sortBy] > b[this.sortBy]) return this.sortDesc ? 1 : -1
        return 0
      })
    },
  },

  watch: {
    searchQuery (): void {
      this.pagination.page = 0
    },
  },

  methods: {
    toggleSort (name: string): void {
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
  },
})
</script>

<style lang="scss" scoped>
.table-wrapper {
  margin: 10px 0 30px;
}

.table-header {
  min-height: 50px;

  display: flex;
  align-items: center;

  border: 2px solid #CECECE {
    bottom: none;
  };
}

.table-body {
  width: 100%;

  overflow-x: auto;

  border: 1px solid #CECECE {
    top: none;
  };
}

.table-footer {
  position: relative;
  z-index: 10;

  width: 100%;
  margin-top: -2px;
  padding: 5px 10px;

  display: flex;
  align-items: center;
  justify-content: flex-end;

  border: 2px solid #CBCBCB {
    top: 2px solid $colorPrimaryAccent;
  }

  button, span {
    margin: 0 5px;
  }

  .pull-left {
    margin-right: auto;
  }
}

table {
  width: 100%;

  thead tr th {
    background-color: $colorPrimary;
    color: #DDDDDD;

    cursor: pointer;
    white-space: nowrap;
    user-select: none;

    svg {
      margin-left: 5px;
      transition: transform 0.2s;

      &.ascending {
        transform: rotate(-180deg);
      }
    }
  }
}

</style>
