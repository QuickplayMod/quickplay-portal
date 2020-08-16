<template>
  <VRow>
    <VCol cols="12" md="6" sm="12">
      <ConnectionsChart />
    </VCol>
    <VCol cols="12" md="6" sm="12" class="welcome-col">
      <QuickplayWelcome />
    </VCol>
  </VRow>
</template>

<script lang="ts">
import ConnectionsChart from "./ConnectionsChart.vue";
import QuickplayWelcome from "./QuickplayWelcome.vue";
export default {
  components: {
    ConnectionsChart,
    QuickplayWelcome
  },
  name: "LoggedInBody"
};
</script>

<style lang="scss" scoped>
.welcome-col {
  @media (max-width: 960px) {
    order: -1;
  }
}
</style>
