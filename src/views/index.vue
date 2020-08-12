<template>
  <div class="home">
    <img alt="Logo" src="../assets/quickplay-white.png" />
    <QuickplayTitle />
  </div>
</template>

<script>
// @ is an alias to /src
import QuickplayTitle from "@/components/QuickplayTitle.vue";

export default {
  name: "index",
  components: {
    QuickplayTitle
  }
};
</script>
