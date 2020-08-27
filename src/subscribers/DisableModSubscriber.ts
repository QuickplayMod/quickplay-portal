import {Action, Subscriber} from "@quickplaymod/quickplay-actions-js";
import store from "../store/index";

class DisableModSubscriber extends Subscriber {

    async run(action: Action): Promise<void> {
        store.commit("PUSH_ERROR_MESSAGE",
            "Quickplay was disabled remotely. Reason: " + action.getPayloadObjectAsString(0))
        store.commit("SET_LOGIN_FAILED", true)
    }

}

export default DisableModSubscriber
