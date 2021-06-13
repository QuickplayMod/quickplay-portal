import { Subscriber } from "@quickplaymod/quickplay-actions-js";
import store from "../store/index";
import Vue from "vue";

class AuthFailedSubscriber extends Subscriber {
  async run(): Promise<void> {
    const sessCookie = Vue.$cookies.get(process.env.VUE_APP_SESSION_COOKIE);
    if (sessCookie) {
      Vue.$cookies.remove(process.env.VUE_APP_SESSION_COOKIE);
      await store.dispatch("initialize");
    } else {
      console.log("Authentication failed");
      store.commit("PUSH_ERROR_MESSAGE", "Auth failed: Please try refreshing!");
      store.commit("SET_LOADING", false);
      store.commit("SET_LOGGED_IN", false);
      store.commit("SET_LOGIN_FAILED", true);
    }
  }
}

export default AuthFailedSubscriber;
