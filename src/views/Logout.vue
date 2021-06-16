<template>
  <div></div>
</template>

<script>
export default {
  name: "Logout",
  components: {},
  mounted() {
    this.$store.dispatch("logout");
    this.$router.push("/");
  }
};
</script>

<style scoped></style>
