<template>
  <VDialog max-width="600px" v-model="$store.state.logoutMessage">
    <VCard>
      <VCardTitle>
        Logged out
      </VCardTitle>
      <VCardText>
        If you are on a public computer, make sure you also
        <a href="https://discord.com/app">log out of Discord</a>, or else
        someone else may be able to log back in as you.
      </VCardText>
      <VCardActions>
        <VBtn
          color="primary"
          @click="$store.commit('SHOW_LOGOUT_MESSAGE', false)"
          class="logged-out-okay"
        >
          Okay
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script>
export default {
  name: "LoggedOutNotification"
};
</script>

<style scoped>
.logged-out-okay {
  margin-bottom: 10px;
  float: right;
}
</style>
