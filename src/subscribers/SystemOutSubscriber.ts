import {Action, Subscriber} from "@quickplaymod/quickplay-actions-js";

class SystemOutSubscriber extends Subscriber {

    async run(action: Action): Promise<void> {
        console.log(action.getPayloadObjectAsString(0))
    }

}

export default SystemOutSubscriber
