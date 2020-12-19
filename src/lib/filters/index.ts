import { defineComponent } from 'vue'
import currency from './currency'

const filtersMixin = defineComponent({
  data: () => ({
    displayFilters: {
      currency,
    },
  }),
})

export default filtersMixin
