<template>
  <teleport to="body">
    <aside
      class="modal-wrapper"
      @click="$emit('cancel')"
    >
      <div
        class="modal"
        @click.stop
      >
        <div class="modal-title">
          <h2>Add Parts to Meet 3Dmark Score</h2>
        </div>

        <div class="modal-body">
          <h3 class="summary">
            Current estimated 3Dmark score:
            {{ build.estimatedScore || 'N/A (not enough parts to calculate)' }}
          </h3>

          <h3 class="summary">
            Current budget:
            {{ displayFilters.currency(build.budget || 0) }}
          </h3>

          <h3 class="section">
            How this works
          </h3>
          <p>
            For now, I'm keeping this simple. It won't take into consideration any current parts you have added to the build, it'll just generate a list of parts based on the desired 3dmark score and budget. Any required support parts (such as motherboard) won't be taken into consideration yet.
            Also, only one part of each type will be considered for the moment (no multi-GPU for example).
          </p>
          <p>
            The parts that have an impact on the 3Dmark score are:
          </p>
          <ul>
            <li>CPU</li>
            <li>Memory</li>
            <li>GPU (most impact)</li>
          </ul>

          <h3 class="section">
            Options
          </h3>
          <form class="form-vertical">
            <label for="desired-3dmark-score">Desired 3Dmark Score</label>
            <input
              id="desired-3dmark-score"
              type="text"
              v-model="buildGenerationInfo.desiredScore"
            >

            <label for="consider-budget">Consider budget</label>
            <input
              id="consider-budget"
              type="checkbox"
              v-model="buildGenerationInfo.useBudget"
            >

            <label for="consider-player-level">Consider player level</label>
            <input
              id="consider-player-level"
              type="checkbox"
              v-model="buildGenerationInfo.usePlayerLevel"
            >
          </form>

          <p
            v-if="!!errorMessage"
            class="error-message"
          >
            {{ errorMessage }}
          </p>

          <button
            class="pure-button success"
            :disabled="calculating"
            @click="beginCalculation"
          >
            Run Calculation
            <FontAwesomeIcon
              v-if="calculating"
              icon="spinner"
              pulse
            />
          </button>

          <template v-if="calculatedAtLeastOnce">
            <h3 class="section-large">
              Builds
            </h3>

            <p v-if="!generatedBuilds.length">
              There were no builds found with the given criteria
            </p>

            <DataTable
              v-if="generatedBuilds.length"
              :items="generatedBuilds"
              :headers="[
                { name: 'estimatedScore', displayName: 'Estimated Score' },
                { name: 'Cost' },
                { name: 'GPU' },
                { name: 'CPU' },
                { name: 'Memory' },
              ]"
              :include-action="true"
              @selected="selectBuild"
            >
              <template #column-1="{ item }">
                {{ displayFilters.currency(buildPrice(item)) }}
              </template>

              <template #column-2="{ item }">
                {{ partName(item, 'GPU') }}
              </template>

              <template #column-3="{ item }">
                {{ partName(item, 'CPU') }}
              </template>

              <template #column-4="{ item }">
                {{ partName(item, 'Memory') }}
              </template>
            </DataTable>
          </template>
        </div>
      </div>
    </aside>
  </teleport>
</template>

<script lang="ts">
import { BuildModelInterface } from '@/typings'
import { defineComponent, nextTick } from 'vue'
import { mapState } from 'vuex'

import BuildModel from '@/models/Build.model'
import { generateBuildMeets3dmarkScore } from '@/lib/calculations'

import DataTable from '@/components/DataTable/index.vue'

export default defineComponent({
  name: 'DialogGenerate3dmark',

  components: {
    DataTable,
  },

  props: {
    build: {
      type: BuildModel,
      default: (): BuildModelInterface => new BuildModel(),
    },
  },

  emits: ['cancel', 'addPartsToBuild'],

  data: () => ({
    buildGenerationInfo: {
      desiredScore: 0,
      useBudget: false,
      usePlayerLevel: true,
      limit: 1000,
    },
    calculating: false,
    calculatedAtLeastOnce: false,
    errorMessage: '',

    generatedBuilds: [] as BuildModelInterface[],
  }),

  computed: {
    ...mapState({
      parts: 'parts',
      playerLevel: 'playerLevel',
    }),
  },

  mounted (): void {
    window.addEventListener('keydown', this.closeOnEscape)
  },

  beforeUnmount (): void {
    window.removeEventListener('keydown', this.closeOnEscape)
  },

  methods: {
    closeOnEscape (event: KeyboardEvent): void {
      if (event.key === 'Escape') this.$emit('cancel')
    },

    buildPrice (build: BuildModelInterface): number {
      return build.parts.reduce((sum, part) => sum + part.price, 0)
    },

    partName (build: BuildModelInterface, type: string): string {
      return build.parts.find(part => part.type === type)!.nameFull
    },

    async beginCalculation (): Promise<void> {
      this.errorMessage = ''
      if (!this.checkInputsValid()) return
      this.calculating = true

      await nextTick()

      const newBuilds = await generateBuildMeets3dmarkScore(
        this.parts,
        {
          desiredScore: this.buildGenerationInfo.desiredScore,
          budget: this.build.budget || 0,
          playerLevel: this.playerLevel || 0,
          limit: this.buildGenerationInfo.limit || 1000,
          useBudget: this.buildGenerationInfo.useBudget && this.build.budget > 0,
          usePlayerLevel: this.buildGenerationInfo.usePlayerLevel,
          slowDownProcess: true,
        },
      )

      this.generatedBuilds = newBuilds
      this.calculating = false
      this.calculatedAtLeastOnce = true
    },

    checkInputsValid (): boolean {
      if (Number(this.buildGenerationInfo.desiredScore) < 1) {
        this.errorMessage = 'The desired 3dmark score should be a positive number'
        return false
      }

      return true
    },

    selectBuild (build: BuildModelInterface): void {
      this.$emit('addPartsToBuild', build.parts?.map(part => ({
        ...part,
        isNewPart: true,
        isBeingKept: true,
      })))
    },
  },
})
</script>

<style lang="scss" scoped>
.modal-body {
  overflow-y: auto;

  padding: 5px 10px;

  h3.summary {
    margin-bottom: 15px;
    font-size: 1.1rem;
  }

  h3.section {
    font-size: 1.3rem;
  }

  h3.section-large {
    font-size: 1.5rem;
  }

  button {
    margin: 20px 0 10px;
  }
}

.error-message {
  margin: 10px 0 0;

  color: $colorError;
  font-size: 0.9rem;
  font-weight: bold;
}
</style>
