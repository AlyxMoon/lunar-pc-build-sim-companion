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

<script>
export default {
  name: 'Accordion',

  data: () => ({
    show: false,
  }),
}
</script>

<style lang="scss" scoped>
.accordion {
  padding: 0 20px;

  transition: margin 0.1s;

  &-header {
    padding: 0 20px;
    border: 1px solid black;

    display: flex;
    align-items: center;
    justify-content: space-between;

    cursor: pointer;
  }

  &-content {
    display: none;
  }

  &-toggle {
    font-size: 24px;

    transition: transform 0.3s;
  }

  &.show {
    margin: 10px 5px;

    .accordion-content {
      display: block;
    }

    .accordion-toggle {
      transform: rotate(90deg);
    }
  }
}
</style>
