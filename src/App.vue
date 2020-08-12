<template>
  <VApp dark>
    <VAppBar app color="teal darken-1" dark>
      <div class="d-flex align-center">
        <VImg
          alt="Quickplay Logo"
          class="shrink mr-2"
          contain
          src="/img/quickplay-white.png"
          transition="scale-transition"
          width="40"
        />

        <h1 class="nav-title">Quickplay</h1>
      </div>

      <div class="nav-buttons">
        <VBtn text>
          Home
        </VBtn>
      </div>
    </VAppBar>

    <VMain class="main-body">
      <VContainer>
        <VRow>
          <VCol cols="12" md="6" sm="12">
            <ConnectionsChart />
          </VCol>
          <VCol cols="12" md="6" sm="12" class="welcome-col">
            <QuickplayWelcome />
          </VCol>
        </VRow>
      </VContainer>
    </VMain>
  </VApp>
</template>

<script lang="ts">
import Vue from "vue";
import QuickplayWelcome from "@/components/QuickplayWelcome.vue";
import ConnectionsChart from "@/components/ConnectionsChart.vue";

export default Vue.extend({
  name: "App",

  components: {
    QuickplayWelcome,
    ConnectionsChart
  },

  data: () => ({
    //
  })
});
</script>

<style lang="scss" scoped>
@import "~vuetify/src/styles/styles.sass";
.nav-buttons {
  margin-left: 20px;
  height: 100%;
  button {
    height: 100% !important;
  }
}
.main-body {
  background-color: map-get($grey, darken-4);
}
.welcome-col {
  @media (max-width: 960px) {
    order: -1;
  }
}
.nav-title {
  @media (max-width: 500px) {
    display: none;
  }
}
</style>
