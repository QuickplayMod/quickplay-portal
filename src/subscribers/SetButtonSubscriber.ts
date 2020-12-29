import { Action, Subscriber } from "@quickplaymod/quickplay-actions-js";
import store from "../store/index";
import Button from "@quickplaymod/quickplay-actions-js/dist/Button";

class SetButtonSubscriber extends Subscriber {
  async run(action: Action): Promise<void> {
    const button = new Button(action.getPayloadObjectAsString(0));
    button.availableOn = JSON.parse(action.getPayloadObjectAsString(1));
    button.actions = JSON.parse(action.getPayloadObjectAsString(2));
    button.imageURL = action.getPayloadObjectAsString(3);
    button.translationKey = action.getPayloadObjectAsString(4);
    button.visible = action.getPayloadObject(5).readUInt8(0) != 0;
    button.adminOnly = action.getPayloadObject(6).readUInt8(0) != 0;
    button.hypixelLocrawRegex = JSON.parse(action.getPayloadObjectAsString(7));
    button.hypixelRankRegex = action.getPayloadObjectAsString(8);
    button.hypixelPackageRankRegex = action.getPayloadObjectAsString(9);
    button.hypixelBuildTeamOnly = action.getPayloadObject(10).readUInt8(0) != 0;
    button.hypixelBuildTeamAdminOnly =
      action.getPayloadObject(11).readUInt8(0) != 0;
    store.commit("SET_BUTTON", { key: button.key, value: button });
  }
}

export default SetButtonSubscriber;
