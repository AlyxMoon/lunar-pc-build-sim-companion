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
            v-for="item in parsedItems"
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
              {{ item[col.name] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
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
  }),

  computed: {
    parsedItems () {
      if (!this.sortBy) return this.items

      return this.items.slice().sort((a, b) => {
        if (a[this.sortBy] < b[this.sortBy]) return this.sortDesc ? -1 : 1
        if (a[this.sortBy] > b[this.sortBy]) return this.sortDesc ? 1 : -1
        return 0
      })
    },
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
  },
}
</script>

<style lang="scss" scoped>
.table-wrapper {
}

.table-wrapper-inner {
  height: 300px;
  width: 100%;

  overflow-y: scroll;
  overflow-x: auto;
  position: relative;

  border: 1px solid #CECECE;
}

table {
  width: 100%;

  thead tr th {
    position: sticky;
    top: 0;

    padding-right: 20px;

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
