<template>
  <Accordion>
    <template #header>
      Build Validation Rules
    </template>

    <template #content>
      <p>
        This is a list of all the validation rules I can think of for builds and whether I've implemented them or not. If you see something missing or implemented but not working right, feel free to reach out and let me know.
      </p>
      <p>
        Whenever you make a change to a build (in active builds), these validation rules will run. If there's an error, it'll show up in the errors section in the build card.
      </p>

      <h6>Implemented</h6>
      <ul>
        <li
          v-for="rule in implemented"
          :key="rule"
        >
          {{ rule }}
        </li>
      </ul>

      <h6>Not Implemented</h6>
      <ul>
        <li
          v-for="rule in notImplemented"
          :key="rule"
        >
          {{ rule }}
        </li>
      </ul>
    </template>
  </Accordion>
</template>

<script lang="ts">
import { PlainObject } from '@/typings/interface'
import Accordion from '@/components/Accordion.vue'

export default {
  name: 'BuildValidationList',
  components: {
    Accordion,
  },

  data: (): PlainObject => ({
    implemented: [
      'Budget: If the sum of new parts are above the budget',
      'Case: If the power supply fits in the case',
      'Case: If the motherboard fits in the case',
      'GPU: If a build contains 2 GPU\'s, whether they are compatible',
      'Motherboard: If the CPU is compatible with the motherboard',
      'Motherboard: If a build contains 2 GPU\'s, whether it supports that multi-GPU',
    ],
    notImplemented: [

    ],
  }),
}
</script>

<style lang="scss">

</style>
