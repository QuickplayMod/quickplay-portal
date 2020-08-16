<template>
  <div class="wrapper">
    <VProgressCircular
      indeterminate
      color="teal lighten-3"
      :size="56"
      :width="6"
    />
    <p class="loading-text">Loading...</p>
  </div>
</template>

<script>
export default {
  name: "Loading"
};
</script>

<style scoped>
.wrapper {
  display: inline-block;
  text-align: center;
}
.loading-text {
  margin-top: 15px;
  font-size: 20px;
}
</style>
