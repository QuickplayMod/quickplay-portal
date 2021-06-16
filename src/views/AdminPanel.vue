<template>
  <div>
    <ConnectionsChart :width="null" :height="300" />
    <ControlTable />
  </div>
</template>

<script>
import ControlTable from "@/components/ControlTable";
import ConnectionsChart from "@/components/ConnectionsChart";
export default {
  name: "AdminPanel",
  components: {
    ControlTable,
    ConnectionsChart
  }
};
</script>

<style scoped></style>
