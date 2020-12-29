import { Action, Subscriber } from "@quickplaymod/quickplay-actions-js";
import store from "../store/index";

class AddUserCountHistorySubscriber extends Subscriber {
  async run(action: Action): Promise<void> {
    store.commit("ALTER_CONNECTION_HISTORY", {
      timestamp: action.getPayloadObject(0).readUInt32BE(0) * 1000,
      count: action.getPayloadObject(1).readUInt32BE(0),
      clearHistory: action.getPayloadObject(2).readUInt8(0) != 0
    });
  }
}

export default AddUserCountHistorySubscriber;
