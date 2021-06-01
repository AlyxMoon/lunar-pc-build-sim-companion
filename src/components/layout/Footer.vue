<template>
  <footer>
    <div class="container">
      <p>
        This is not an official app. If you have any questions/comments/concerns about the app feel free to leave an issue in the Github Repo or contact me. A link to my Discord server is below, you can find me there.
      </p>

      <ul>
        <li>
          <router-link
            :to="{ name: 'PrivacyPolicy' }"
          >
            Privacy Policy
          </router-link>
        </li>

        <li
          v-for="link in links"
          :key="link.href"
        >
          <a
            :href="link.href"
            target="_blank"
          >
            {{ link.text }}
          </a>
        </li>
      </ul>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Footer',

  data: () => ({
    links: [
      {
        href: 'https://allistermoon.com',
        text: 'Made by Allister Moon',
      },
      {
        href: 'https://github.com/AlyxMoon/lunar-pc-build-sim-companion',
        text: 'Github Repo',
      },
      {
        href: 'https://discord.gg/CVCTYxE',
        text: 'My Personal Discord Server',
      },
      {
        href: 'https://discord.com/invite/pcbuildingsim',
        text: 'Official PC Building Simulator Discord',
      },
      {
        href: 'https://steamcommunity.com/app/621060',
        text: 'Steam Community',
      },
    ],
  }),
})
</script>

<style lang="scss" scoped>
footer {
  flex-shrink: 0;

  min-height: 100px;
  margin: 20px 0 0;
  padding: 20px 3%;

  background-color: $colorPrimary;
  border-top: 3px solid $colorPrimaryAccent;
  color: white;
}

.container {
  height: 100%;

  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
}

a {
  margin-bottom: 5px;

  color: #DDDDDD;
  font-size: 1rem;
  text-decoration: none;
  text-align: right;

  transition-duration: 0.2s;

  &:hover {
    color: $colorPrimaryAccent;
  }
}
</style>
