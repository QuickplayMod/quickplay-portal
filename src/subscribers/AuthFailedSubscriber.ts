import { Action, Subscriber } from "@quickplaymod/quickplay-actions-js";
import store from "../store/index";
import Vue from "vue";

class AuthFailedSubscriber extends Subscriber {
  async run(action: Action): Promise<void> {
    const sessCookie = Vue.$cookies.get(process.env.VUE_APP_SESSION_COOKIE);
    const discordIdCookie = Vue.$cookies.get(
      process.env.VUE_APP_DISCORD_ID_COOKIE
    );
    if (sessCookie || discordIdCookie) {
      Vue.$cookies.remove(process.env.VUE_APP_SESSION_COOKIE);
      Vue.$cookies.remove(process.env.VUE_APP_DISCORD_ID_COOKIE);
      console.log(
        "Authentication failed. Removed cookies and re-attempting authentication."
      );
      await store.dispatch("initialize");
    } else {
      console.log(
        "Authentication failed. Reason: " + action.getPayloadObjectAsString(0)
      );
      store.commit("SET_LOADING", false);
      store.commit("SET_LOGGED_IN", false);
      store.commit("SET_LOGIN_FAILED", true);
    }

    const reason = action.getPayloadObjectAsString(0);
    // Received when user's login was successful but there's no account in the DB with this Discord account ID.
    if (reason == "UNLINKED_DISCORD") {
      store.commit("SET_UNLINKED_DISCORD", true);
    } else {
      store.commit("PUSH_ERROR_MESSAGE", "Auth failed: Please try refreshing!");
    }
  }
}

export default AuthFailedSubscriber;
