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
      :key="`${i}-${build.name}`"
      :build="build"
      @update="updateBuild({ data: $event, index: i })"
      @addPartToBuild="startDialogPartLookup(i, $event)"
      @remove="removeBuild(i)"
    />
  </section>

  <DialogPartLookup
    v-if="!!showDialogPartLookup"
    :part-type="showDialogPartLookup.partType"
    @cancel="showDialogPartLookup = null"
    @selected="addPartToBuild($event)"
  />
</template>

<script>
import { mapActions, mapState } from 'vuex'

import BuildCard from '@/components/BuildCard'
import DialogPartLookup from '@/components/DialogPartLookup'

export default {
  name: 'PageActiveBuilds',
  components: {
    BuildCard,
    DialogPartLookup,
  },

  data: () => ({
    showDialogPartLookup: null,
  }),

  computed: {
    ...mapState({
      builds: 'builds',
    }),
  },

  methods: {
    ...mapActions(['createBuild', 'updateBuild', 'removeBuild']),

    startDialogPartLookup (index, { field, partType }) {
      this.showDialogPartLookup = {
        index,
        field,
        partType,
      }
    },

    addPartToBuild (part) {
      const { field, index } = this.showDialogPartLookup
      const build = this.builds[index].attributes

      this.updateBuild({
        index: index,
        data: {
          ...build,
          [field]: [
            ...build[field],
            part,
          ],
        },
      })

      this.showDialogPartLookup = null
    },
  },
}
</script>

<style lang="scss" scoped>
section.build-card-grid {
  max-width: 50em;
  margin: 30px 0;

  display: grid;
  grid-gap: 20px;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  justify-content: flex-start;
}
</style>
