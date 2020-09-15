import {Action, Resolver, Subscriber} from "@quickplaymod/quickplay-actions-js";
import store from "../store/index";
import AliasedAction from "@quickplaymod/quickplay-actions-js/dist/AliasedAction";

class SetAliasedActionSubscriber extends Subscriber {

    async run(action: Action): Promise<void> {
        const aliasedAction = new AliasedAction(action.getPayloadObjectAsString(0))
        aliasedAction.availableOn = JSON.parse(action.getPayloadObjectAsString(1))
        aliasedAction.action = Resolver.from(action.getPayloadObject(2))
        aliasedAction.visible = action.getPayloadObject(3).readUInt8(0) != 0
        aliasedAction.adminOnly = action.getPayloadObject(4).readUInt8(0) != 0
        aliasedAction.hypixelLocrawRegex = JSON.parse(action.getPayloadObjectAsString(5))
        aliasedAction.hypixelRankRegex = action.getPayloadObjectAsString(6)
        aliasedAction.hypixelPackageRankRegex = action.getPayloadObjectAsString(7)
        aliasedAction.hypixelBuildTeamOnly = action.getPayloadObject(8).readUInt8(0) != 0
        aliasedAction.hypixelBuildTeamAdminOnly = action.getPayloadObject(9).readUInt8(0) != 0
        store.commit("SET_ALIASED_ACTION", {key: aliasedAction.key, value: aliasedAction})
    }
}

export default SetAliasedActionSubscriber
