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

        <h1>Quickplay</h1>
      </div>

      <div class="nav-buttons">
        <VBtn text>
          Home
        </VBtn>
      </div>
    </VAppBar>

    <VMain class="main-body">
      <QuickplayTitle />
    </VMain>
  </VApp>
</template>

<script lang="ts">
import Vue from "vue";
import QuickplayTitle from "@/components/QuickplayTitle.vue";

export default Vue.extend({
  name: "App",

  components: {
    QuickplayTitle
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
</style>
