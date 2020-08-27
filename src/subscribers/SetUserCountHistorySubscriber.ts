import {Action, Subscriber} from "@quickplaymod/quickplay-actions-js";

class SetUserCountHistorySubscriber extends Subscriber {

    async run(action: Action): Promise<void> {
        return Promise.resolve(undefined);
        // TODO
    }

}

export default SetUserCountHistorySubscriber
