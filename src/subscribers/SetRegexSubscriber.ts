import { Action, Subscriber } from "@quickplaymod/quickplay-actions-js";
import store from "../store/index";

class SetRegexSubscriber extends Subscriber {
  async run(action: Action): Promise<void> {
    store.commit("SET_REGEX", {
      key: action.getPayloadObjectAsString(0),
      value: action.getPayloadObjectAsString(1)
    });
  }
}

export default SetRegexSubscriber;
