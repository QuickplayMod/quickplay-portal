<template>
  <div class="title-wrapper">
    <h1 class="qp-title">Hello, {{ $store.state.mcName || "User" }}.</h1>
    <div class="quote">
      <p class="quote-header">Quote of the day:</p>
      <FontAwesomeIcon :icon="['fas', 'quote-left']" class="quote-icon" />
      <p class="quote-of-day">{{ quoteOfTheDay.quote }}</p>
      <p class="quote-author">- {{ quoteOfTheDay.author }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import quotes from "@/assets/quotes";
import moment from "moment";
export default Vue.extend({
  name: "QuickplayWelcome",
  computed: {
    quoteOfTheDay(): { quote: string; author: string } {
      const dayOfTheYear = moment().dayOfYear();
      const index = dayOfTheYear % quotes.length;
      return quotes[index];
    }
  }
});
</script>

<style lang="scss" scoped>
.title-wrapper {
  padding-top: 40px;
  text-align: center;
}
.qp-title {
  font-size: 2.5em;
}

.quote {
  margin-top: 25px;
  .quote-header {
    font-size: 1.3em;
  }
  .quote-icon {
    font-size: 1.6em;
  }
  .quote-of-day {
    font-size: 1.7em;
    font-style: italic;
    margin: 0 6px 6px 20px;
  }
  .quote-author {
    color: #aaa;
    font-size: 1.3em;
  }
}
</style>
