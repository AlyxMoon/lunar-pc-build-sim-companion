<template>
  <h1>Privacy Policy</h1>

  <p class="last-updated">
    Last updated October 18, 2026
  </p>

  <hr>

  <h2>Your browser's storage</h2>
  <p>
    This app saves your builds, player level, color mode, HEM parts preference and analytics choice in your browser's local storage.
    These settings stay on this browser until you change them or clear the site's storage. Clearing storage also resets analytics to off.
  </p>

  <h2>Optional analytics</h2>
  <p>
    Analytics is off by default, including on your first visit. You can turn on Enable Analytics on the
    <router-link :to="{ name: 'Settings' }">
      Settings page
    </router-link>, which is linked from the navbar.
    Your choice is saved in this browser and applies across the site's pages.
    While the switch is off, the app does not request the tag-manager script or send analytics page views.
  </p>
  <p>
    When you opt in, the app loads Google Tag Manager from Google (googletagmanager.com) for Google Analytics.
    The app sends a page view with the page address and title when analytics starts and when you navigate between pages.
    Analytics may use cookies and collect information such as your browser, device, language and approximate location inferred from your IP address.
    Your saved builds and player options are not included in the app's page-view events.
  </p>
  <p>
    You can turn analytics off at any time in Settings. The app saves your choice and reloads the page to stop analytics scripts that have already loaded.
    Turning it off stops future collection by this app; it does not delete information already collected or existing analytics cookies.
    You can remove cookies and local storage using your browser's site-data controls.
  </p>

  <h2>Advertising</h2>
  <p>This site shows no ads.</p>

  <h2>Contact</h2>
  <p>
    For privacy questions, email <a href="mailto:allisterbytes@gmail.com">allisterbytes@gmail.com</a>.
  </p>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PagePrivacyPolicy',
})
</script>

<style lang="scss" scoped>
.last-updated {
  font-size: 1.1rem;
  font-weight: bold;
}
</style>
