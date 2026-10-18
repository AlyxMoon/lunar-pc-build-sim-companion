<template>
  <h1>Home</h1>

  <p>
    This is a companion app for PC Building Simulator. It's actively in development so check back in occassionally for updates. I'll add more of a description later.
  </p>

  <div>
    <h5>App Data</h5>

    <p>Want to save the data in the app? This will save it to a json file which can be imported later.</p>
    <button
      class="pure-button"
      title="Export player data"
      @click="exportPlayerData"
    >
      Export Data
    </button>

    <p>Want to import data you previously exported? Got it here.</p>
    <input
      type="file"
      accept=".json, .txt"
      ref="importData"
      :disable="handlingImport"
      @change="handleFileInput"
    >
  </div>

  <BuildValidationList />
</template>

<script lang="ts">
import { PlainObject } from '@/typings'
import { defineComponent } from 'vue'
import { mapActions } from 'vuex'

import BuildValidationList from '@/components/BuildValidationList.vue'

export default defineComponent({
  name: 'PageActiveBuild',
  components: {
    BuildValidationList,
  },

  data: (): PlainObject => ({
    handlingImport: false,
  }),

  methods: {
    ...mapActions(['exportPlayerData', 'importPlayerData']),

    handleFileInput (): void {
      this.handlingImport = true

      const reader = new FileReader()
      const importData = this.$refs.importData as PlainObject

      reader.onload = (event): void => {
        importData.value = null
        try {
          const stuff = JSON.parse(event.target?.result as string)
          this.importPlayerData(stuff)
          alert('Import successful!')
        } catch (error) {
          console.error('could not parse JSON, was the file correct?', error)
        }

        this.handlingImport = false
      }

      reader.readAsText(importData.files[0])
    },
  },
})
</script>

<style lang="scss" scoped>
div {
  margin-top: 40px;
}
</style>
