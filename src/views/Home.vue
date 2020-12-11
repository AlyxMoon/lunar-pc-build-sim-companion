<template>
  <h1>Home</h1>

  <p>
    This is a companion app for PC Building Simulator. It's actively in development so check back in occassionally for updates. I'll add more of a description later.
  </p>

  <div>
    <h5>General Options</h5>

    <label for="player-level">
      Player Level
      <input
        v-model="playerLevel"
        name="player-level"
      >
    </label>
    <p class="help">
      Use this as an app-wide filter for parts. Any parts above this level will not be displayed in the relevant tables.
    </p>
  </div>

  <div>
    For the builds I have started implementing some validation rules. Here are the list of rules currently being checked:

    <ul>
      <li>
        If the sum of new parts are above the budget
      </li>
      <li>
        If the power supply fits in the case
      </li>
      <li>
        If the motherboard fits in the case
      </li>
      <li>
        If the CPU is compatible with the motherboard
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'PageActiveBuild',

  computed: {
    playerLevel: {
      get () {
        return this.$store.state.playerLevel
      },

      set (value) {
        this.$store.commit('UPDATE_PLAYER_LEVEL', value)
      },
    },
  },
}
</script>

<style lang="scss" scoped>
div {
  margin-top: 40px;
}
</style>
