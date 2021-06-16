<template>
  <div class="content">
    <h1>Unknown Account</h1>
    <h3>
      We couldn't find a Quickplay account linked to your Discord account.
      Please open Minecraft and connect to
      <span class="ip">{{ ip }}</span> to get an authorization code, and enter
      it below:
    </h3>
    <VTextField v-model="value" @input="valueChange" class="code-input" />
    <VBtn color="primary" @click="submit" :disabled="this.value.length !== 9">
      Submit
    </VBtn>
    <img src="../assets/discord-link.gif" alt="Example" class="example-img" />
  </div>
</template>

<script>
import { LinkDiscordAction } from "@quickplaymod/quickplay-actions-js";
export default {
  name: "LinkDiscordForm",
  data() {
    return {
      value: "",
      ip: process.env.VUE_APP_DISCORD_LINK_IP
    };
  },
  methods: {
    submit() {
      if (this.value.length !== 9) {
        return;
      }
      this.$store.commit("SET_LOADING", true);
      this.$store.dispatch("sendAction", {
        action: new LinkDiscordAction(this.value)
      });
    },
    valueChange() {
      this.$nextTick(() => {
        this.value = this.value
          .toUpperCase()
          .replace(/[^0-9ABCDEF]/g, "")
          .substr(0, 9);
        if (this.value.length >= 4) {
          this.value = this.value.substr(0, 4) + "-" + this.value.substr(4, 4);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~vuetify/src/styles/styles.sass";
.code-input {
  width: 300px;
  margin-left: auto;
  margin-right: auto;
}
.ip {
  color: var(--v-primary-base);
}
.example-img {
  width: 70%;
  margin-top: 50px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.content {
  text-align: center;
  margin-top: 10vh;
}
</style>
<style lang="scss">
.code-input input {
  text-align: center;
}
</style>
