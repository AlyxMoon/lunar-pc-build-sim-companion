<template>
  <h1>Settings</h1>

  <h2>Player Options</h2>

  <label for="player-level">
    Player Level
    <input
      id="player-level"
      v-model.number="playerLevel"
      type="number"
      name="player-level"
      aria-describedby="player-level-help"
    >
  </label>
  <p
    id="player-level-help"
    class="help"
  >
    Use this as an app-wide filter for parts. Any parts above this level will not be displayed in the relevant tables.
  </p>

  <label for="allow-modded-parts-hem">
    Allow HEM Parts
    <input
      id="allow-modded-parts-hem"
      v-model="allowModdedPartsHEM"
      type="checkbox"
      name="allow-modded-parts-hem"
    >
  </label>

  <label for="color-mode">
    Color Mode
    <select
      id="color-mode"
      v-model="colorMode"
      name="color-mode"
    >
      <option value="light">Light Mode</option>
      <option value="dark">Dark Mode</option>
    </select>
  </label>

  <h2>Privacy</h2>

  <label for="analytics-enabled">
    Enable Analytics
    <input
      id="analytics-enabled"
      v-model="analyticsEnabled"
      type="checkbox"
      role="switch"
      name="analytics-enabled"
      aria-describedby="analytics-help"
    >
  </label>
  <p id="analytics-help">
    Analytics is off by default. Turn it on to share page views with Google Analytics through our tag manager.
    Your choice is saved in this browser. Turning it off reloads the page to stop analytics that has already loaded.
    This site shows no ads.
    <router-link :to="{ name: 'PrivacyPolicy' }">
      Read the privacy policy.
    </router-link>
  </p>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PageSettings',

  computed: {
    playerLevel: {
      get (): number {
        return this.$store.state.playerLevel || 0
      },
      set (value: number): void {
        this.$store.commit('UPDATE_PLAYER_LEVEL', value)
      },
    },
    allowModdedPartsHEM: {
      get (): boolean {
        return this.$store.state.allowModdedPartsHEM || false
      },
      set (value: boolean): void {
        this.$store.commit('UPDATE_ALLOW_MODDED_PARTS_HEM', value)
      },
    },
    colorMode: {
      get (): string {
        return this.$store.state.colorMode || 'light'
      },
      set (value: string): void {
        this.$store.commit('UPDATE_COLOR_MODE', value)
      },
    },
    analyticsEnabled: {
      get (): boolean {
        return this.$store.state.analyticsEnabled === true
      },
      set (value: boolean): void {
        this.$store.commit('UPDATE_ANALYTICS_ENABLED', value)
      },
    },
  },
})
</script>
