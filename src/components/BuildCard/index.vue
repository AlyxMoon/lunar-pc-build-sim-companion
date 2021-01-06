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
          :key="`remove-${confirmRemove}`"
          class="pure-button"
          title="Remove Build"
          @click="removeBuild(confirmRemove)"
        >
          <FontAwesomeIcon
            v-if="!confirmRemove"
            icon="times"
          />
          <span v-else>Really?</span>
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

      <h6>Estimated 3Dmark Score</h6>
      <span :key="build.estimatedScore">
        {{ build.estimatedScore }}
      </span>
    </div>

    <div class="card-body">
      <Accordion>
        <template #header>
          <h6>
            <span class="badge error">{{ activeBuild.errors.length }}</span>
            Errors With Build
          </h6>
        </template>
        <template #content>
          <ul v-if="!!activeBuild.errors.length">
            <li
              v-for="error in activeBuild.errors"
              :key="error"
            >
              {{ error }}
            </li>
          </ul>
          <p v-else>
            No errors!
          </p>
        </template>
      </Accordion>

      <Accordion>
        <template #header>
          <h6>
            <span class="badge info">{{ activeBuild.objectives.length }}</span>
            Objectives
          </h6>
        </template>
        <template #content>
          <div class="input-group">
            <button
              class="pure-button"
              :disabled="!tempFields.objectives"
              @click="addNewObjective(tempFields.objectives)"
            >
              Add
            </button>
            <input v-model="tempFields.objectives">
          </div>

          <ul>
            <li
              v-for="(item, i) in activeBuild.objectives"
              :key="i"
            >
              {{ item }}
            </li>
          </ul>
        </template>
      </Accordion>

      <Accordion>
        <template #header>
          <h6>
            <span class="badge info">{{ activeBuild.parts.length }}</span>
            Parts
          </h6>
        </template>
        <template #content>
          <BuildPartsList
            :parts="activeBuild.parts"
            @addNewPart="addNewPart($event)"
            @removePart="removePart($event)"
            @copyPart="copyPart($event)"
            @updatePart="updatePart($event)"
          />
        </template>
      </Accordion>
    </div>
  </article>
</template>

<script lang="ts">
import { BuildModelInterface, PlainObject } from '@/typings/interface'
import { defineComponent } from 'vue'
import { mapState } from 'vuex'

import currency from '@/lib/filters/currency'
import BuildModel from '@/models/Build.model'

import Accordion from '@/components/Accordion.vue'
import BuildPartsList from './BuildPartsList.vue'

export default defineComponent({
  name: 'BuildCard',
  components: {
    BuildPartsList,
    Accordion,
  },
  props: {
    build: {
      type: BuildModel,
      default: (): BuildModelInterface => new BuildModel(),
    },
  },
  emits: ['update', 'remove', 'addPartToBuild'],

  data: (): PlainObject => ({
    activeBuild: null,
    editing: false,
    tempFields: {},

    confirmRemove: false,
    expanded: false,

    filters: {
      currency,
    },
  }),

  computed: {
    ...mapState({
      categories: 'categories',
    }),

    totalCostNewParts (): number {
      if (!this.activeBuild) return 0
      return this.activeBuild.parts.reduce((sum: number, item: PlainObject) => {
        return sum + (item.isNewPart ? item.Price : 0)
      }, 0)
    },
  },

  methods: {
    toggleEdit (): void {
      this.editing = !this.editing
      if (!this.editing) {
        this.$emit('update', this.activeBuild.attributes)
      }
    },

    addNewPart (item: PlainObject): void {
      this.$emit('addPartToBuild', {
        partType: item,
        build: this.activeBuild,
      })
    },

    addNewObjective (objective: string): void {
      this.activeBuild.objectives.push(objective)
      this.activeBuild.validate()
      this.$emit('update', this.activeBuild.attributes)
    },

    removeBuild (confirmed = false): void {
      if (!confirmed) {
        this.confirmRemove = true
        return
      }

      this.$emit('remove')
    },

    removePart (index: number): void {
      this.activeBuild.parts.splice(index, 1)
      this.activeBuild.validate()
      this.$emit('update', this.activeBuild.attributes)
    },

    copyPart (item: PlainObject): void {
      this.activeBuild.parts.push({ ...item })
      this.activeBuild.validate()
      this.$emit('update', this.activeBuild.attributes)
    },

    updatePart ({ index, newValues }: { index: number, newValues: PlainObject }): void {
      this.activeBuild.parts.splice(index, 1, {
        ...this.activeBuild.parts[index],
        ...newValues,
      })

      this.activeBuild.validate()
      this.$emit('update', this.activeBuild)
    },
  },

  created (): void {
    this.activeBuild = this.build
    this.activeBuild.runBenchmark()
  },
})
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
    margin: 20px 0 20px;

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
    min-height: 60px;
    width: 100%;
    padding-left: 20px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    background-color: #385590;
    color: white;
    font-size: 1.2rem;

    h4 {
      margin: 0;

      flex-shrink: 1;
      display: flex;
      align-items: center;

      overflow: hidden;
    }

    .pure-button-group {
      margin: 2px;

      align-self: flex-start;
      flex-shrink: 0;

      button {
        border-radius: 0;
        margin-left: 2px;
      }
    }

    input {
      width: 100%;
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
      justify-content: flex-end;
    }
  }

  .card-body {
    padding: 10px;

    .input-group {
      padding: 0 10px;
      input {
        flex-grow: 1;
      }
    }

    :deep(.accordion-header) {
      padding-left: 5px;
    }
  }
}
</style>
