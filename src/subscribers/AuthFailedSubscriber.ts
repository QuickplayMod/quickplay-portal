import {Action, Subscriber} from "@quickplaymod/quickplay-actions-js";
import store from '../store/index'

class AuthFailedSubscriber extends Subscriber {

    async run(action: Action, ...args: Record<string, unknown>[]): Promise<void> {
        console.log("Authentication failed");
        store.commit("SET_LOADING", false)
        store.commit("SET_LOGGED_IN", false)
        store.commit("SET_LOGIN_FAILED", true)
    }
}

export default AuthFailedSubscriber
