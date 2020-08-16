import {Action, AuthReestablishAuthedConnectionAction, Subscriber} from "@quickplaymod/quickplay-actions-js";
import Vue from 'vue'
import store from '../store/index'
import AuthGoogleEndHandshakeAction
    from "@quickplaymod/quickplay-actions-js/dist/actions/serverbound/AuthGoogleEndHandshakeAction";

class AuthBeginSubscriber extends Subscriber {

    async run(action: Action, ...args: Record<string, unknown>[]): Promise<void> {

        const sessCookie = Vue.$cookies.get(process.env.VUE_APP_SESSION_COOKIE);
        if(sessCookie) {
            await store.dispatch("sendAction", { action: new AuthReestablishAuthedConnectionAction(sessCookie) })
        } else {
            const googleId = store.state.googleId
            const googleJwt = store.state.googleJwt
            if(!googleId || !googleJwt) {
                store.commit("SET_LOADING", false)
                store.commit("SET_LOGGED_IN", false)
                store.commit("SET_LOGIN_FAILED", true)
                return
            }
            await store.dispatch("sendAction", { action: new AuthGoogleEndHandshakeAction(googleJwt)})
        }
    }
}

export default AuthBeginSubscriber
