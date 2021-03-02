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
import { PlainObject } from '@/typings'
import Accordion from '@/components/Accordion.vue'

export default {
  name: 'BuildValidationList',
  components: {
    Accordion,
  },

  data: (): PlainObject => ({
    implemented: [
      'Budget: If the sum of new parts are above the budget',
      'Case: Can fit the CPU Cooler',
      'Case: Can fit the GPU(s)',
      'Case: Can fit the Motherboard',
      'Case: Can fit the PSU',
      'CPU: Can fit the provided CPU Cooler',
      'GPU: If a build contains 2 GPU\'s, whether they are compatible',
      'Memory: If a build contains more than 1 stick, check if they are compatible',
      'Motherboard: If the CPU is compatible with the motherboard',
      'Motherboard: If a build contains 2 GPU\'s, whether it supports that multi-GPU',
      'PSU: Provides enough voltage for all the included parts',
    ],
    notImplemented: [
      'Build: if a flag is set, require at least 1 of every part',
      'Build: contains no more than 1 case',
      'Build: can fit the included number of case fans',
      'Build: contains no more than 1 motherboard',
      'Build: contains no more than 1 CPU',
      'Build: contains no more than 1 CPU Cooler',
      'Build: contains no more than 2 GPUs',
      'Build: contains no more than 1 PSU',
      'Build: motherboard supports amount of storage',
      'Build: motherboard supports amount of RAM',
      'Motherboard: if build contains RAM, the frequency is supported',
      'Motherboard: if build contains storage, can support the amount provided',
    ],
  }),
}
</script>

<style lang="scss">

</style>
