import {Action, Resolver, Subscriber} from "@quickplaymod/quickplay-actions-js";
import store from "../store/index";
import AliasedAction from "@quickplaymod/quickplay-actions-js/dist/AliasedAction";

class SetAliasedActionSubscriber extends Subscriber {

    async run(action: Action): Promise<void> {
        const aliasedAction = new AliasedAction(action.getPayloadObjectAsString(0))
        aliasedAction.availableOn = JSON.parse(action.getPayloadObjectAsString(1))
        aliasedAction.action = Resolver.from(action.getPayloadObject(2))
        store.commit("SET_ALIASED_ACTION", {key: aliasedAction.key, value: aliasedAction})
    }
}

export default SetAliasedActionSubscriber
