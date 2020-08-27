import {Action, Subscriber} from "@quickplaymod/quickplay-actions-js";
import store from "../store/index";

interface Translation {
    key: string,
    lang: string,
    value: string
}

class SetTranslationSubscriber extends Subscriber {

    async run(action: Action): Promise<void> {
        const translation: Translation = {key: "", lang: "", value: ""}
        translation.key = action.getPayloadObjectAsString(0);
        translation.lang = action.getPayloadObjectAsString(1);
        translation.value = action.getPayloadObjectAsString(2);
        store.commit("SET_TRANSLATION", {
            key: translation.key,
            lang: translation.lang,
            value: translation.value
        })
    }
}

export default SetTranslationSubscriber
export { Translation }
