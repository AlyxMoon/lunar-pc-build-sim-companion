<template>
  <nav>
    <router-link
      class="logo-wrapper"
      to="/"
    >
      <img src="@/assets/logo.png">
      <span>Home</span>
    </router-link>

    <div
      class="link-wrapper"
      :class="{ open: navbarOpen }"
    >
      <router-link
        v-for="route in routes"
        :key="route.name"
        :to="{ name: route.name }"
      >
        {{ route.title }}
      </router-link>
    </div>

    <div
      class="expand"
      @click="navbarOpen = !navbarOpen"
    >
      <FontAwesomeIcon icon="bars" />
    </div>
  </nav>
</template>

<script>

export default {
  name: 'Navbar',

  data: () => ({
    routes: [
      { name: 'ActiveBuilds', title: 'Active Builds' },
      { name: 'PartsList', title: 'Parts List' },
      { name: 'BuildPlanner', title: 'Build Planner' },
      { name: 'WillItRun', title: 'Will It Run' },
      { name: 'Overclocking', title: 'Overclocking' },
    ],

    navbarOpen: false,
  }),
}
</script>

<style lang="scss" scoped>
nav {
  position: relative;

  height: 50px;
  width: 100%;
  padding: 0 30px;

  display: flex;
  align-items: center;
  flex-direction: row;

  background-color: #262249;
  border-bottom: 3px solid #E94800;

  .logo-wrapper {
    display: flex;
    align-items: center;

    img {
      height: 30px;
      width: 30px;

      margin-right: 10px;
    }
  }

  a {
    color: #DDDDDD;
    font-size: 1rem;
    font-weight: bold;
    text-decoration: none;
    text-align: right;

    transition-duration: 0.2s;

    @include md {
      text-align: center;

      &:not(:last-child) {
        margin-right: 20px;
      }
    }

    @include lg {
      font-size: 1.2em;
    }

    &:hover, &.router-link-active {
      color: #E94800;
    }
  }

  .link-wrapper {
    flex-grow: 1;
    align-items: center;
    justify-content: flex-end;

    user-select: none;

    @include smAndBelow {
      display: grid;
      position: absolute;
      top: 50px;
      right: 0;
      width: 150px;

      max-height: 0;
      padding: 0 20px;

      grid-template-columns: auto;
      grid-row-gap: 15px;
      justify-content: flex-start;
      align-items: flex-end;

      background-color: #232031;

      overflow: hidden;
      pointer-events: none;
      visibility: hidden;

      transition:
        max-height 0.5s,
        padding 0.5s,
        visibility 1s 0.5s;

      &.open {
        max-height: 200px;
        padding: 20px;

        pointer-events: all;
        visibility: visible;
      }
    }

    @include md {
      display: flex;
    }
  }

  .expand {
    width: 40px;
    margin-left: auto;
    color: #DDDDDD;

    font-size: 1.5rem;

    cursor: pointer;
    transition-duration: 0.2s;

    &:hover {
      color: #A22744;
    }

    @include md {
      display: none;
    }
  }
}
</style>
