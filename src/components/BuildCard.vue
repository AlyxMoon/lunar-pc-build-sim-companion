<template>
  <article :class="{ expanded }">
    <div class="card-title">
      <h4
        v-if="!editing"
      >
        <FontAwesomeIcon
          class="clickable"
          icon="chevron-right"
          @click="expanded = !expanded"
        />

        {{ activeBuild.name }}
      </h4>
      <input
        v-else
        v-model="activeBuild.name"
      >

      <div
        class="pure-button-group"
        role="group"
      >
        <button
          class="pure-button"
          :title="editing ? 'Save Build' : 'Edit Build'"
          @click="toggleEdit"
        >
          <FontAwesomeIcon
            v-if="!editing"
            icon="pen"
          />

          <FontAwesomeIcon
            v-else
            icon="save"
          />
        </button>

        <button
          class="pure-button"
          title="Remove Build"
          @click="$emit('remove')"
        >
          <FontAwesomeIcon icon="times" />
        </button>
      </div>
    </div>

    <div class="card-subtitle">
      <h5>Budget</h5>

      <span
        v-if="!editing"
      >
        {{ filters.currency(activeBuild.budget) }}
      </span>
      <input
        v-else
        v-model="activeBuild.budget"
      >

      <h5>Used Budget</h5>
      <span>
        {{ filters.currency(totalCostNewParts) }}
      </span>

      <h5>Job Type</h5>

      <span
        v-if="!editing"
      >
        {{ activeBuild.jobType }}
      </span>
      <input
        v-else
        v-model="activeBuild.jobType"
      >
    </div>

    <div class="card-body">
      <h6>Objectives</h6>
      <ul>
        <li
          v-for="(item, i) in activeBuild.objectives"
          :key="i"
        >
          {{ item }}
        </li>
      </ul>
      <div class="input-group">
        <input v-model="tempFields.objectives">
        <button
          class="pure-button"
          @click="addNewItem('objectives')"
        >
          Add
        </button>
      </div>

      <h6>Starting Parts</h6>
      <dl>
        <template
          v-for="(item, i) in activeBuild.startingParts"
          :key="`${i}-${item['Full Part Name']}`"
        >
          <button
            class="pure-button"
            @click="removePart('startingParts', i)"
          >
            X
          </button>
          <dd>
            {{ filters.currency(item['Price']) }}
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
          v-model="tempFields.startingParts"
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
          :disabled="!tempFields.startingParts"
          @click="addNewItem('startingParts')"
        >
          Add
        </button>
      </div>

      <h6>New Parts</h6>
      <dl>
        <template
          v-for="(item, i) in activeBuild.newParts"
          :key="`${i}-${item['Full Part Name']}`"
        >
          <button
            class="pure-button"
            @click="removePart('newParts', i)"
          >
            X
          </button>
          <dd>
            {{ filters.currency(item['Price']) }}
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
          v-model="tempFields.newParts"
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
          :disabled="!tempFields.newParts"
          @click="addNewItem('newParts')"
        >
          Add
        </button>
      </div>
    </div>
  </article>
</template>

<script>
import { mapState } from 'vuex'
import currency from '@/lib/filters/currency'

import BuildModel from '@/models/Build'

export default {
  name: 'BuildCard',
  props: {
    build: {
      type: BuildModel,
      default: () => new BuildModel(),
    },
  },
  emits: ['update', 'remove', 'addPartToBuild'],

  data: () => ({
    activeBuild: null,
    editing: false,
    tempFields: {},

    expanded: false,

    filters: {
      currency,
    },
  }),

  computed: {
    ...mapState({
      categories: 'categories',
    }),

    totalCostNewParts () {
      if (!this.activeBuild) return 0
      return this.activeBuild.newParts.reduce((sum, item) => {
        return sum + item.Price
      }, 0)
    },
  },

  watch: {
    build: {
      handler () {
        this.activeBuild = this.build.clone()
      },
      deep: true,
    },
  },

  methods: {
    toggleEdit () {
      this.editing = !this.editing
      if (!this.editing) {
        this.$emit('update', this.activeBuild.attributes)
      }
    },

    addNewItem (field) {
      if (field === 'objectives') {
        this.activeBuild[field].push(this.tempFields[field])
        this.$emit('update', this.activeBuild.attributes)
      } else {
        this.$emit('addPartToBuild', {
          partType: this.tempFields[field],
          field,
        })
      }

      this.tempFields[field] = ''
    },

    removePart (field, index) {
      this.activeBuild[field].splice(index, 1)
      this.$emit('update', this.activeBuild.attributes)
    },
  },

  created () {
    this.activeBuild = this.build.clone()
  },
}
</script>

<style lang="scss" scoped>
article {
  width: 100%;

  border-left: 8px solid #E97816;

  overflow: hidden;
  transition:
    width 0.2s,
    margin 0.2s;

  &.expanded {
    width: 99%;
    margin: 20px 0 20px 1%;

    box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.1);

    .card-title h4 svg {
      transform: rotate(90deg);
    }
  }

  &:not(.expanded) {
    border-bottom: 4px solid #E97816;

    &:first-child {
      border-top: 4px solid #E97816;
    }

    .card-subtitle, .card-body, .card-footer {
      display: none;
    }
  }

  .card-title {
    height: 60px;
    width: 100%;
    padding: 15px 20px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    background-color: #385590;
    color: white;
    font-size: 1.2rem;

    h4 {
      margin: 0;
    }
  }

  .card-subtitle {
    width: 100%;
    padding: 10px;

    display: grid;
    grid-gap: 10px 15px;
    grid-template-columns: auto 1fr;
    align-items: center;

    background-color: #DDE7FD;
    color: black;
    font-size: 1.1rem;

    h5 {
      margin: 0;
      text-align: right;
    }
  }

  .card-body {
    padding: 10px;
  }
}

.input-group {
  margin: 5px 0 10px;

  display: flex;
  justify-content: flex-start;
}

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
