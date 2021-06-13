import {
  Action,
  AuthDiscordEndHandshakeAction,
  AuthReestablishAuthedConnectionAction,
  Subscriber
} from "@quickplaymod/quickplay-actions-js";
import Vue from "vue";
import store from "../store/index";

class AuthBeginSubscriber extends Subscriber {
  async run(action: Action): Promise<void> {
    const sessCookie = Vue.$cookies.get(process.env.VUE_APP_SESSION_COOKIE);
    const idCookie = Vue.$cookies.get(process.env.VUE_APP_DISCORD_ID_COOKIE);
    // If ID is cookie is set, we assume that the cached ID was sent in the InitializeClientAction.
    if (sessCookie && idCookie) {
      await store.dispatch("sendAction", {
        action: new AuthReestablishAuthedConnectionAction(sessCookie)
      });
    } else {
      const state = action.getPayloadObjectAsString(0);
      // Open a new window with the Discord OAuth page, which will redirect back to the main page of this app.
      const newWindow = window.open(
        "https://discord.com/api/oauth2/authorize?client_id=" +
          process.env.VUE_APP_DISCORD_APP_ID +
          "&redirect_uri=" +
          process.env.VUE_APP_BASE_URL +
          "&response_type=code&scope=identify%20guilds.join&state=" +
          state
      );

      if (newWindow == null) {
        store.commit("SET_LOADING", false);
        store.commit("SET_LOGGED_IN", false);
        store.commit("SET_LOGIN_FAILED", true);
        store.commit(
          "PUSH_ERROR_MESSAGE",
          "Auth failed: Couldn't open Discord sign-in window!"
        );
        return;
      }

      try {
        const code = await new Promise<string>((resolve, reject) => {
          // Every second, check if the user has been redirected back and attempt to get the code and state from the window's URL.
          const interval = setInterval(() => {
            try {
              const urlSearchParams = new URLSearchParams(
                newWindow.document.location.search
              );
              const localCode = urlSearchParams.get("code");
              const localState = urlSearchParams.get("state");

              // Empty codes are invalid, and if state and local state don't match, CSRF possible.
              if (!localCode || localState != state) {
                throw new Error("Invalid code or state received in response!");
              }
              // Once valid code is received, resolve this blocking Promise and send the code in AuthDiscordEndHandshakeAction
              resolve(localCode);
            } catch (e) {
              if (
                e != null &&
                e.message != null &&
                e.message.startsWith("Blocked a frame with origin")
              ) {
                return; // Ignore CORS errors, they are expected until the user returns from Discord login page.
              }
              reject(e);
              clearInterval(interval);
            }
          }, 1000);
        });
        newWindow.close();
        await store.dispatch("sendAction", {
          action: new AuthDiscordEndHandshakeAction(code, state)
        });
      } catch (e) {
        store.commit("SET_LOADING", false);
        store.commit("SET_LOGGED_IN", false);
        store.commit("SET_LOGIN_FAILED", true);
        Vue.$cookies.remove(process.env.VUE_APP_SESSION_COOKIE);
        store.commit("PUSH_ERROR_MESSAGE", "Auth failed: " + e.message);
        console.error(e);
      }
    }
  }
}

export default AuthBeginSubscriber;
