<template>
  <div class="home">
    <img alt="Logo" src="../assets/quickplay-white.png" />
    <QuickplayTitle />
  </div>
</template>

<script>
// @ is an alias to /src
import QuickplayTitle from "@/components/QuickplayWelcome.vue";

export default {
  name: "index",
  components: {
    QuickplayTitle
  }
};
</script>
