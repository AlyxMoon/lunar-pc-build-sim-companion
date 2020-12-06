<template>
  <div class="table-wrapper">
    <div class="table-wrapper-inner">
      <table class="pure-table pure-table-horizontal">
        <thead>
          <tr>
            <th
              v-for="header in headers"
              :key="header.name"
            >
              {{ header.displayName || header.name }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="item in items"
            :key="item.toString()"
          >
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

    background-color: #CECECE;
  }
}

</style>
