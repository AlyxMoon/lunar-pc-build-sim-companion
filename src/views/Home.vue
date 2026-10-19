<template>
  <h1>Home</h1>

  <p>
    Plan your PC Building Simulator builds, check which parts work together, and find parts for your next job.
  </p>

  <nav aria-label="Get started">
    <ul>
      <li>
        <router-link to="/builds">
          Active Builds
        </router-link> - start a build and keep track of its parts and budget.
      </li>
      <li>
        <router-link to="/will-it-run">
          Will It Run
        </router-link> - find parts that meet a program's requirements.
      </li>
      <li>
        <router-link to="/parts">
          Parts List
        </router-link> - browse the available parts.
      </li>
    </ul>
  </nav>

  <section aria-labelledby="data-and-rules">
    <h2 id="data-and-rules">
      Data and Build Rules
    </h2>
    <p>Back up or restore your builds and player level, or read the build validation rules.</p>

    <h3>App Data</h3>

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
    <BuildValidationList />
  </section>
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
section {
  margin-top: 40px;
}

h2 {
  font-size: 1.3rem;
}

li {
  margin-bottom: 1rem;
}

p label {
  display: inline;
  margin: 0;
}
</style>
