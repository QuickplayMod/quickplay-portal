import {Action, Subscriber} from "@quickplaymod/quickplay-actions-js";
import ChatComponent from "@quickplaymod/quickplay-actions-js/dist/chat-components/ChatComponent";
import store from "../store/index"

class SendChatComponentSubscriber extends Subscriber {

    async run(action: Action): Promise<void> {
        const msg = JSON.parse(action.getPayloadObjectAsString(0))
        const str = this.getChatComponentText(msg.message)
        store.commit("PUSH_ERROR_MESSAGE", str)
    }

    /**
     * Get the text of a chat component by flattening out it's text and its extra components into a string.
     * @param component
     */
    getChatComponentText(component: ChatComponent) {
        let str = "";
        if(component?.text) {
            str += component.text
        }
        if(component?.extra) {
            for(let i = 0; i < component.extra.length; i++) {
                str += this.getChatComponentText(component.extra[i])
            }
        }

        return str
    }

}

export default SendChatComponentSubscriber
