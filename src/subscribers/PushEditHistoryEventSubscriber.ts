import {Action, Subscriber} from "@quickplaymod/quickplay-actions-js";
import store from "../store/index"

class PushEditHistoryEventSubscriber extends Subscriber {

    async run(action: Action): Promise<void> {
        store.commit("PUSH_EDIT_EVENT", {
            timestamp: new Date(action.getPayloadObject(0).readUInt32BE(0) * 1000),
            editedBy: action.getPayloadObject(1).readUInt32BE(0),
            itemType: action.getPayloadObjectAsString(2),
            itemKey: action.getPayloadObjectAsString(3),
            deleted: action.getPayloadObject(4).readUInt8(0) != 0,
            prevVersion: JSON.parse(action.getPayloadObjectAsString(5))
        })
    }

}

export default PushEditHistoryEventSubscriber
