import {Action, Subscriber} from "@quickplaymod/quickplay-actions-js";
import store from "../store/index";
import Vue from "vue";

class AuthFailedSubscriber extends Subscriber {

    async run(action: Action, ...args: Record<string, unknown>[]): Promise<void> {
        const sessCookie = Vue.$cookies.get(process.env.VUE_APP_SESSION_COOKIE)
        const googleIdCookie = Vue.$cookies.get(process.env.VUE_APP_GOOGLE_ACCOUNT_COOKIE)
        if(sessCookie || googleIdCookie) {
            Vue.$cookies.remove(process.env.VUE_APP_SESSION_COOKIE)
            Vue.$cookies.remove(process.env.VUE_APP_GOOGLE_ACCOUNT_COOKIE)
            await store.dispatch("initialize")
        } else {
            console.log("Authentication failed");
            store.commit("PUSH_ERROR_MESSAGE", "Auth failed: Please try refreshing!")
            store.commit("SET_LOADING", false)
            store.commit("SET_LOGGED_IN", false)
            store.commit("SET_LOGIN_FAILED", true)
        }
    }
}

export default AuthFailedSubscriber
