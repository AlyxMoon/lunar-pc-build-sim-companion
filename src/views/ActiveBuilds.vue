<template>
  <h1>Active Builds</h1>

  <button
    class="pure-button"
    @click="createBuild"
  >
    Start New Build
  </button>

  <section class="build-card-grid">
    <BuildCard
      v-for="(build, i) in builds"
      :key="build.id"
      :build="build"
      @update="updateBuild({ data: $event, index: i })"
      @addPartToBuild="startDialogPartLookup(i, $event)"
      @remove="removeBuild(i)"
    />
  </section>

  <button
    v-if="!!builds.length"
    class="pure-button"
    @click="createBuild"
  >
    Start New Build
  </button>

  <DialogPartLookup
    v-if="!!showDialogPartLookup"
    :part-type="showDialogPartLookup.partType"
    @cancel="showDialogPartLookup = null"
    @selected="addPartToBuild($event)"
  />
</template>

<script lang="ts">
import { BuildModelInterface, PlainObject } from '@/typings/interface'

import { defineComponent } from 'vue'
import { mapActions, mapState } from 'vuex'

import BuildCard from '@/components/BuildCard/index.vue'
import DialogPartLookup from '@/components/DialogPartLookup.vue'

export default defineComponent({
  name: 'PageActiveBuilds',
  components: {
    BuildCard,
    DialogPartLookup,
  },

  data: (): PlainObject => ({
    showDialogPartLookup: null,
  }),

  computed: {
    ...mapState({
      builds: 'builds',
    }),
  },

  methods: {
    ...mapActions(['createBuild', 'updateBuild', 'removeBuild']),

    startDialogPartLookup (
      index: number,
      { partType, build }: { partType: string, build: BuildModelInterface },
    ): void {
      this.showDialogPartLookup = {
        index,
        partType,
        build,
      }
    },

    addPartToBuild (part: Parts.BaseInterface): void {
      const { build, index } = this.showDialogPartLookup

      build.parts.push(part)
      build.validate()

      this.updateBuild({
        index: index,
        data: build.attributes,
      })

      this.showDialogPartLookup = null
    },
  },
})
</script>

<style lang="scss" scoped>
section.build-card-grid {
  width: 100%;
  max-width: 100em;
  margin: 30px 0;

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  justify-content: flex-start;
}
</style>
