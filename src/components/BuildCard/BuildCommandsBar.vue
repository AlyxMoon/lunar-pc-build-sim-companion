<template>
  <nav>
    <button
      class="pure-button"
      :disabled="showDialogGenerate3dmark"
      @click="showDialogGenerate3dmark = true"
    >
      Add parts to meet 3Dmark score
    </button>
  </nav>

  <DialogGenerate3dmark
    v-if="showDialogGenerate3dmark"
    :build="build"
    @cancel="showDialogGenerate3dmark = false"
    @addPartsToBuild="addPartsToBuild"
  />
</template>

<script lang="ts">
import { BuildModelInterface, Parts } from '@/typings'
import { defineComponent } from 'vue'

import BuildModel from '@/models/Build.model'
import DialogGenerate3dmark from '@/components/DialogGenerate3dmark/index.vue'

export default defineComponent({
  name: 'BuildCommandsBar',
  components: {
    DialogGenerate3dmark,
  },

  emits: ['addPartsToBuild'],

  props: {
    build: {
      type: BuildModel,
      default: (): BuildModelInterface => new BuildModel(),
    },
  },

  data: () => ({
    showDialogGenerate3dmark: false,
  }),

  methods: {
    addPartsToBuild (parts: Parts.BaseInterface[]): void {
      this.$emit('addPartsToBuild', parts)
      this.showDialogGenerate3dmark = false
    },
  },
})
</script>

<style lang="scss" scoped>
nav {
  margin-bottom: 20px;
}
</style>
