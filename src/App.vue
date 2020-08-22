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
        <VBtn
          text
          v-if="$store.state.loggedIn"
          @click="$store.dispatch('logout')"
        >
          Log out
        </VBtn>
        <VBtn text v-else @click="init">
          Log in
        </VBtn>
      </div>
    </VAppBar>

    <VMain class="main-body">
      <VContainer>
        <Loading class="loader" v-if="$store.state.loading" />
        <LoginFailed
          class="login-failed"
          v-else-if="$store.state.loginFailed"
        />
        <NoPermission
          class="login-failed"
          v-else-if="!$store.state.loggedIn || !$store.state.isAdmin"
        />
        <LoggedInBody v-else />
      </VContainer>
    </VMain>
    <VSnackbar v-model="snackbar" bottom color="error">
      {{ currentErrorMessage }}
    </VSnackbar>
  </VApp>
</template>

<script lang="ts">
import Vue from "vue";
import Loading from "@/components/Loading.vue";
import LoggedInBody from "@/components/LoggedInBody.vue";
import LoginFailed from "@/components/LoginFailed.vue";
import NoPermission from "@/components/NoPermission.vue";
import { mapState } from "vuex";

export default Vue.extend({
  name: "App",
  data() {
    return {
      snackbar: false,
      errorMessageTimer: -1
    };
  },
  components: {
    NoPermission,
    LoginFailed,
    LoggedInBody,
    Loading
  },
  async mounted() {
    // Initialize the application by connecting the socket.
    this.init();
  },
  watch: {
    errorMessages() {
      if (this.errorMessageTimer == -1) {
        this.showErrorMessage();
      }
    }
  },
  computed: {
    currentErrorMessage(): string {
      if (!this.errorMessages || !this.errorMessages.length) {
        return "";
      }
      return this.errorMessages[0];
    },
    ...mapState(["errorMessages"])
  },
  methods: {
    async init() {
      await this.$store.dispatch("initialize");
    },
    showErrorMessage() {
      if (!this.currentErrorMessage) {
        clearTimeout(this.errorMessageTimer);
        this.errorMessageTimer = -1;
        return;
      }
      this.snackbar = true;
      this.errorMessageTimer = setTimeout(() => {
        this.$store.commit("POP_ERROR_MESSAGE");
        this.showErrorMessage();
      }, 7000); // Default snackbar timeout is 6000
    }
  }
});
</script>

<style lang="scss" scoped>
@import "~vuetify/src/styles/styles.sass";
.login-failed {
  text-align: center;
  margin-top: 15vh;
}
.loader {
  margin-left: 50%;
  transform: translateX(-50%);
  margin-top: 15vh;
}
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
.signin-button {
  position: relative;
  right: 0;
}
</style>
