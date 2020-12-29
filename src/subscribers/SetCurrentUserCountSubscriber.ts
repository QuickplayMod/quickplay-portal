import { Action, Subscriber } from "@quickplaymod/quickplay-actions-js";
import store from "../store/index";

class SetCurrentUserCountSubscriber extends Subscriber {
  async run(action: Action): Promise<void> {
    store.commit(
      "SET_CURRENT_CONNECTIONS",
      action.getPayloadObject(0).readUInt32BE(0)
    );
  }
}

export default SetCurrentUserCountSubscriber;
