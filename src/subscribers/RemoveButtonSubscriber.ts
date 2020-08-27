import {Action, Subscriber} from "@quickplaymod/quickplay-actions-js";
import store from "../store/index";

class RemoveButtonSubscriber extends Subscriber {

    async run(action: Action): Promise<void> {
        store.commit("SET_BUTTON", {key: action.getPayloadObjectAsString(0), value: null})
    }

}

export default RemoveButtonSubscriber
