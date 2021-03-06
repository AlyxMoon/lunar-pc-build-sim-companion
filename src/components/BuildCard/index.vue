<template>
  <article :class="{ expanded }">
    <div class="card-title">
      <h4
        v-if="!editing"
        class="clickable"
        @click="expanded = !expanded"
      >
        <FontAwesomeIcon
          class="clickable"
          icon="chevron-right"
        />

        {{ activeBuild.name }}
      </h4>
      <input
        type="text"
        v-else
        v-model="activeBuild.name"
      >

      <div
        class="pure-button-group"
        role="group"
      >
        <button
          v-if="!confirmRemove"
          class="pure-button info"
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
          v-if="!confirmRemove && !editing"
          class="pure-button danger"
          title="Remove Build"
          @click="removeBuild(false)"
        >
          <FontAwesomeIcon icon="times" />
        </button>

        <template v-if="confirmRemove && !editing">
          <button
            class="pure-button"
            @click="confirmRemove = false"
          >
            Cancel
          </button>

          <button
            class="pure-button danger"
            @click="removeBuild(true)"
          >
            Delete
          </button>
        </template>
      </div>
    </div>

    <div class="card-subtitle">
      <h5>Used / Budget</h5>

      <div class="budget-group">
        <span>
          {{ displayFilters.currency(totalCostNewParts) }}
        </span>

        /

        <span
          v-if="!editing"
        >
          {{ displayFilters.currency(activeBuild.budget) }}
        </span>
        <input
          type="text"
          v-else
          v-model="activeBuild.budget"
        >
      </div>

      <h5>Job Type</h5>

      <span
        v-if="!editing"
      >
        {{ activeBuild.jobType }}
      </span>
      <input
        type="text"
        v-else
        v-model="activeBuild.jobType"
      >

      <h6>Estimated 3Dmark Score</h6>
      <span :key="build.estimatedScore">
        {{ build.estimatedScore }}
      </span>
    </div>

    <div class="card-body">
      <BuildCommandsBar
        :build="activeBuild"
        @addPartsToBuild="addMultipleNewParts"
      />

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
            <input
              type="text"
              v-model="tempFields.objectives"
            >
          </div>

          <ul class="objectives-list">
            <template
              v-for="(item, i) in activeBuild.objectives"
              :key="i"
            >
              <button
                class="pure-button danger"
                @click="removeObjective(i)"
              >
                <FontAwesomeIcon icon="times" />
              </button>
              <li>
                {{ item }}
              </li>
            </template>
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
import { BuildModelInterface, PlainObject, Parts } from '@/typings'

import { defineComponent } from 'vue'
import { mapState } from 'vuex'

import BuildModel from '@/models/Build.model'

import Accordion from '@/components/Accordion.vue'
import BuildCommandsBar from './BuildCommandsBar.vue'
import BuildPartsList from './BuildPartsList.vue'

export default defineComponent({
  name: 'BuildCard',
  components: {
    Accordion,
    BuildCommandsBar,
    BuildPartsList,
  },
  props: {
    build: {
      type: BuildModel,
      default: (): BuildModelInterface => new BuildModel(),
    },
  },
  emits: ['update', 'remove', 'addPartToBuild'],

  data: (): {
    activeBuild: BuildModel,
    editing: boolean,
    tempFields: PlainObject,
    confirmRemove: boolean,
    expanded: boolean,
  } => ({
    activeBuild: new BuildModel(),
    editing: false,
    tempFields: {},

    confirmRemove: false,
    expanded: false,
  }),

  computed: {
    ...mapState({
      categories: 'categories',
    }),

    totalCostNewParts (): number {
      if (!this.activeBuild) return 0
      return this.activeBuild.parts.reduce((sum: number, item) => {
        if (!item.isNewPart || item.isPartOfCase) return sum

        const partPrice = item.isNewUsedPart
          ? Math.floor(item.price * 1.25 / 3)
          : item.price

        return sum + partPrice
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

    addMultipleNewParts (parts: Parts.BaseInterface[]): void {
      this.activeBuild.parts.push(...parts)
      this.activeBuild.validate()
      this.$emit('update', this.activeBuild.attributes)
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
      this.tempFields.objectives = ''
    },

    removeObjective (index: number): void {
      this.activeBuild.objectives.splice(index, 1)
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

    copyPart (item: Parts.BaseInterface): void {
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

  border-left: 8px solid $colorSecondaryAccent;

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
    border-bottom: 4px solid $colorSecondaryAccent;

    &:first-child {
      border-top: 4px solid $colorSecondaryAccent;
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

    background-color: $colorSecondary;
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

    background-color: $colorTertiary;
    color: black;
    font-size: 1.1rem;

    h5 {
      margin: 0;
      justify-content: flex-end;
    }
  }

  .card-body {
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

.budget-group {
  display: flex;
  align-items: center;

  span, input {
    margin: 0 10px;
  }
}

.objectives-list {
  margin: 10px 0;
  padding: 0 10px;

  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 5px 10px;
  justify-content: flex-start;
  align-items: center;

  list-style: none;

  button {
    font-size: 0.9rem;
  }
}
</style>
