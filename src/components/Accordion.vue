<template>
  <div
    class="accordion"
    :class="{ show }"
  >
    <div
      class="accordion-header"
      @click="show = !show"
    >
      <slot name="header" />

      <div class="accordion-toggle">
        <FontAwesomeIcon icon="chevron-right" />
      </div>
    </div>

    <div class="accordion-content">
      <slot name="content" />
    </div>
  </div>
</template>

<script lang="ts">
import { PlainObject } from '@/typings'

export default {
  name: 'Accordion',

  data: (): PlainObject => ({
    show: false,
  }),
}
</script>

<style lang="scss">
main.mode-light .accordion {
  --accordion-border-color: #111111;
}

main.mode-dark .accordion {
  --accordion-border-color: #EEEEEE;
}

</style>

<style lang="scss" scoped>
.accordion {
  margin: 10px 0;
  padding: 0 20px;

  transition: margin 0.1s;

  &-header {
    padding: 10px 20px;
    border: 1px solid var(--accordion-border-color);

    display: flex;
    align-items: center;
    justify-content: flex-start;

    cursor: pointer;
  }

  &-content {
    display: none;
  }

  &-toggle {
    margin-left: auto;

    font-size: 24px;
    transition: transform 0.3s;
  }

  &.show {
    .accordion-content {
      display: block;
    }

    .accordion-toggle {
      transform: rotate(90deg);
    }
  }
}
</style>
