<template>
  <h1>Privacy Policy</h1>

  <h6>Last updated {{ lastUpdated }}</h6>

  <hr>

  <p>
    Wow, I was looking up how to set up a privacy policy and TOS. That search returned a whole lot of sites saying a whole lot of words that fly right over my head. I thought using a generator would help but considering how verbose and dense those get I couldn't be bothered to read through it all. I can't very well put up a privacy policy I haven't bothered to read myself.
  </p>

  <p>
    I am not a lawyer and I am terrible at legalese. So screw it, here's my quick privacy policy rundown. If you have any questions on things feel free to reach out. There are some links in the footer, or you can email me at <a href="mailto:allisterbytes@gmail.com">allisterbytes@gmail.com</a>
  </p>

  <ul>
    <li>I am using Google Analytics for tracking.</li>
    <li>I am not currently, but plan to, use Google Adsense.</li>
    <li>Both of these items I will add add options for disabling. Google Analytics will be enabled by default, Adsense will be opt-in</li>
    <li>There will be cookies used for Analytics and Adsense, as well as tracking your decision to enable/disable them</li>
    <li>This app uses the browser local storage as well. This storage is used only for data related to the app, such as what options are selected (player level, color mode, etc.) and your builds.</li>
  </ul>

  <h3>Notes on Google Analytics</h3>
  <p>
    I use Google Analytics for tracking page views. There's a bunch of fun ways to view that data but that's essentially it. By using it, Google does store information but none of it is personally identifiable. It includes stuff such as:
  </p>
  <ul>
    <li>What kind of browser you are using</li>
    <li>What your screen size is</li>
    <li>The geographic location associated with your IP</li>
    <li>The language set in your browser</li>
  </ul>

  <p>
    If you'd rather not have that information tracked I totally understand. You are welcome to turn off the analytics tracking. There will be an option on this page and on the options page to switch that.
  </p>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PagePrivacyPolicy',

  data: (): {
    lastUpdated: string,
    contactEmail: string,
  } => ({
    lastUpdated: 'April 07, 2021',
    contactEmail: 'allisterbytes@gmail.com',
  }),
})
</script>
