import {Action, Subscriber} from "@quickplaymod/quickplay-actions-js";
import store from "../store/index";
import Screen from "@quickplaymod/quickplay-actions-js/dist/Screen";

class SetScreenSubscriber extends Subscriber {

    async run(action: Action): Promise<void> {
        const screen = new Screen(action.getPayloadObjectAsString(0), action.getPayloadObjectAsString(1))
        screen.availableOn = JSON.parse(action.getPayloadObjectAsString(2))
        screen.buttons = JSON.parse(action.getPayloadObjectAsString(3))
        screen.backButtonActions = JSON.parse(action.getPayloadObjectAsString(4))
        screen.translationKey = action.getPayloadObjectAsString(5)
        screen.imageURL = action.getPayloadObjectAsString(6)
        store.commit("SET_SCREEN", {key: screen.key, value: screen})
    }
}

export default SetScreenSubscriber
