<template>
  <VRow>
    <VCol cols="12" md="6" sm="12">
      <ConnectionsChart />
    </VCol>
    <VCol cols="12" md="6" sm="12" class="welcome-col">
      <QuickplayWelcome />
    </VCol>
    <ControlTable />
  </VRow>
</template>

<script lang="ts">
import ConnectionsChart from "./ConnectionsChart.vue";
import QuickplayWelcome from "./QuickplayWelcome.vue";
import ControlTable from "@/components/ControlTable.vue";
export default {
  components: {
    ControlTable,
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
