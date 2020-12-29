import { Action, Subscriber } from "@quickplaymod/quickplay-actions-js";
import store from "../store/index";

class RemoveAliasedActionSubscriber extends Subscriber {
  async run(action: Action): Promise<void> {
    store.commit("SET_ALIASED_ACTION", {
      key: action.getPayloadObjectAsString(0),
      value: null
    });
  }
}

export default RemoveAliasedActionSubscriber;
