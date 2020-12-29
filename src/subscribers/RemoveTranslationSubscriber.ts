import { Action, Subscriber } from "@quickplaymod/quickplay-actions-js";
import store from "../store/index";

class RemoveTranslationSubscriber extends Subscriber {
  async run(action: Action): Promise<void> {
    store.commit("SET_TRANSLATION", {
      key: action.getPayloadObjectAsString(0),
      lang: action.getPayloadObjectAsString(1),
      value: undefined
    });
  }
}

export default RemoveTranslationSubscriber;
