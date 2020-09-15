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
        screen.visible = action.getPayloadObject(7).readUInt8(0) != 0
        screen.adminOnly = action.getPayloadObject(8).readUInt8(0) != 0
        screen.hypixelLocrawRegex = JSON.parse(action.getPayloadObjectAsString(9))
        screen.hypixelRankRegex = action.getPayloadObjectAsString(10)
        screen.hypixelPackageRankRegex = action.getPayloadObjectAsString(11)
        screen.hypixelBuildTeamOnly = action.getPayloadObject(12).readUInt8(0) != 0
        screen.hypixelBuildTeamAdminOnly = action.getPayloadObject(13).readUInt8(0) != 0
        store.commit("SET_SCREEN", {key: screen.key, value: screen})
    }
}

export default SetScreenSubscriber
