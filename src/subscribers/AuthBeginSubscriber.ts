import {
  AuthReestablishAuthedConnectionAction,
  Subscriber
} from "@quickplaymod/quickplay-actions-js";
import Vue from "vue";
import store from "../store/index";
import AuthGoogleEndHandshakeAction from "@quickplaymod/quickplay-actions-js/dist/actions/serverbound/AuthGoogleEndHandshakeAction";

class AuthBeginSubscriber extends Subscriber {
  async run(): Promise<void> {
    const sessCookie = Vue.$cookies.get(process.env.VUE_APP_SESSION_COOKIE);
    if (sessCookie) {
      await store.dispatch("sendAction", {
        action: new AuthReestablishAuthedConnectionAction(sessCookie)
      });
    } else {
      const googleId = store.state.googleId;
      const googleJwt = store.state.googleJwt;
      if (!googleId || !googleJwt) {
        console.error(
          "Session cookie does not exist but issing JWT or Google ID during AuthBeginHandshake. Clearing cookies."
        );
        Vue.$cookies.remove(process.env.VUE_APP_SESSION_COOKIE);
        Vue.$cookies.remove(process.env.VUE_APP_GOOGLE_ACCOUNT_COOKIE);
        store.commit("SET_LOADING", false);
        store.commit("SET_LOGGED_IN", false);
        store.commit("SET_LOGIN_FAILED", true);
        return;
      }
      await store.dispatch("sendAction", {
        action: new AuthGoogleEndHandshakeAction(googleJwt)
      });
    }
  }
}

export default AuthBeginSubscriber;
