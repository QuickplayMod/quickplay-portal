<template>
  <VApp dark>
    <VAppBar app color="teal darken-1" dark>
      <div class="d-flex align-center">
        <VImg
          alt="Quickplay Logo"
          class="shrink mr-2"
          contain
          :src="logoUrl"
          transition="scale-transition"
          width="40"
        />

        <h1 class="nav-title">Quickplay</h1>
      </div>

      <div class="nav-buttons">
        <RouterLink to="/">
          <VBtn text>
            Home
          </VBtn>
        </RouterLink>
        <RouterLink
          to="/admin"
          v-if="$store.state.isAdmin && $store.state.loggedIn"
        >
          <VBtn text>
            Admin
          </VBtn>
        </RouterLink>
        <VBtn
          v-if="$store.state.isAdmin && $store.state.loggedIn"
          text
          @click="showEditLog = !showEditLog"
        >
          Edit Log
        </VBtn>
        <RouterLink
          to="/logout"
          v-if="$store.state.loggedIn"
          class="login-button"
        >
          <VBtn text>
            Log out
          </VBtn>
        </RouterLink>
        <VBtn text v-else @click="login" class="login-button">
          Log in
        </VBtn>
        <VBtn text v-if="$store.state.loggedIn">
          Users: {{ $store.state.currentConnections }}
        </VBtn>
      </div>
    </VAppBar>

    <VMain class="main-body">
      <VContainer>
        <Loading class="loader" v-if="$store.state.loading" />
        <LinkDiscordForm
          v-else-if="!$store.state.loggedIn && $store.state.unlinkedDiscord"
        />
        <LoginFailed v-else-if="$store.state.loginFailed" />
        <RouterView v-else />
        <EditLog
          v-model="showEditLog"
          :edit-log="$store.state.editHistory.events"
        />
        <LoggedOutNotification />
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
import LoginFailed from "@/components/LoginFailed.vue";
import LinkDiscordForm from "@/components/LinkDiscordForm.vue";
import { mapState } from "vuex";
import EditLog from "@/components/EditLog.vue";
import LoggedOutNotification from "@/components/LoggedOutNotification.vue";

export default Vue.extend({
  name: "App",
  data() {
    return {
      snackbar: false,
      errorMessageTimer: -1,
      showEditLog: false
    };
  },
  components: {
    LoggedOutNotification,
    EditLog,
    Loading,
    LoginFailed,
    LinkDiscordForm
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
    logoUrl(): string {
      return process.env.VUE_APP_BASE_URL + "/img/quickplay-white.png";
    },
    currentErrorMessage(): string {
      if (!this.errorMessages || !this.errorMessages.length) {
        return "";
      }
      return this.errorMessages[0];
    },
    ...mapState(["errorMessages"])
  },
  methods: {
    async login() {
      await this.$store.dispatch("login");
    },
    async init() {
      if (this.$route.query.code) {
        return;
      }
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
.login-button {
  position: absolute;
  right: 0;
  height: 87%;
}
</style>
