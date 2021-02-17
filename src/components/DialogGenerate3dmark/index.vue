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
          <h6>
            Current estimated 3Dmark score:
            {{ build.estimatedScore || 'N/A (not enough parts to calculate)' }}
          </h6>

          <h6>
            Current budget:
            {{ displayFilters.currency(build.budget || 0) }}
          </h6>

          <h5>How this works</h5>
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

          <h5>Options</h5>
          <form class="form-vertical">
            <label>Desired 3Dmark Score</label>
            <input
              type="text"
              v-model="buildGenerationInfo.desiredScore"
            >

            <label>Consider budget</label>
            <input
              type="checkbox"
              v-model="buildGenerationInfo.useBudget"
            >

            <label>Consider player level</label>
            <input
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
            <h4>Builds</h4>

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
                {{ displayFilters.currency(item.parts.reduce((sum, part) => sum + part.Price, 0)) }}
              </template>

              <template #column-2="{ item }">
                {{ item.parts.find(part => part['Part Type'].startsWith('GPU'))['Full Part Name'] }}
              </template>

              <template #column-3="{ item }">
                {{ item.parts.find(part => part['Part Type'] === 'CPU')['Full Part Name'] }}
              </template>

              <template #column-4="{ item }">
                {{ item.parts.find(part => part['Part Type'] === 'Memory')['Full Part Name'] }}
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
import { defineComponent } from 'vue'
import { mapState } from 'vuex'

import BuildModel from '@/models/Build.model'
import generateBuildMeets3dmarkScore from '@/lib/util/generateBuildMeets3dmarkScore'

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
      useBudget: true,
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

  methods: {
    async beginCalculation (): Promise<void> {
      if (!this.checkInputsValid()) return
      this.calculating = true

      // Calculation was a bit much and the button wasn't updating correctly
      // for this.calculating. This brief pause gives the view a chance to update.
      // probably a better way. That's always the way of it, eh?
      await new Promise(resolve => setTimeout(resolve, 50))

      const newBuilds = await generateBuildMeets3dmarkScore(
        this.parts,
        {
          desiredScore: this.buildGenerationInfo.desiredScore,
          budget: this.build.budget || 0,
          playerLevel: this.playerLevel || 0,
          limit: this.buildGenerationInfo.limit || 1000,
          useBudget: this.buildGenerationInfo.useBudget,
          usePlayerLevel: this.buildGenerationInfo.usePlayerLevel,
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

  h6 {
    margin-bottom: 15px;
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
