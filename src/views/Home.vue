<template>
  <h1>Home</h1>

  <p>
    This is a companion app for PC Building Simulator. It's actively in development so check back in occasionally for updates. I'll add more of a description later.
  </p>

  <div>
    <h2>App Data</h2>

    <p>Want to save the data in the app? This will save it to a json file which can be imported later.</p>
    <button
      class="pure-button"
      title="Export player data"
      @click="exportPlayerData"
    >
      Export Data
    </button>

    <p>
      <label for="import-data">Want to import data you previously exported? Got it here.</label>
    </p>
    <input
      id="import-data"
      type="file"
      accept=".json, .txt"
      ref="importData"
      :disabled="handlingImport"
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
  name: 'PageHome',
  components: {
    BuildValidationList,
  },

  data: (): PlainObject => ({
    handlingImport: false,
  }),

  methods: {
    ...mapActions(['exportPlayerData', 'importPlayerData']),

    handleFileInput (): void {
      const importData = this.$refs.importData as HTMLInputElement
      const file = importData.files?.[0]
      if (!file) return

      this.handlingImport = true
      const reader = new FileReader()
      reader.onloadend = (): void => {
        importData.value = ''
        this.handlingImport = false
      }

      reader.onload = (event): void => {
        try {
          const stuff = JSON.parse(event.target?.result as string)
          this.importPlayerData(stuff)
          alert('Import successful!')
        } catch (error) {
          console.error('could not parse JSON, was the file correct?', error)
        }

      }

      reader.readAsText(file)
    },
  },
})
</script>

<style lang="scss" scoped>
div {
  margin-top: 40px;
}

h2 {
  font-size: 1.3rem;
}
</style>
