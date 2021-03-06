import { Action, Subscriber } from "@quickplaymod/quickplay-actions-js";
import Vue from "vue";
import axios from "axios";
import store from "../store/index";

class AuthCompleteSubscriber extends Subscriber {
  async run(action: Action): Promise<void> {
    console.log("Authentication Complete");
    store.commit("SET_LOGGED_IN", true);
    Vue.$cookies.set(
      process.env.VUE_APP_SESSION_COOKIE,
      action.getPayloadObjectAsString(0),
      process.env.VUE_APP_SESSION_LENGTH || "3h"
    );
    // Used during reestablishment of connections
    Vue.$cookies.set(
      process.env.VUE_APP_DISCORD_ID_COOKIE,
      action.getPayloadObjectAsString(3),
      process.env.VUE_APP_SESSION_LENGTH || "3h"
    );

    const isAdmin = !!action.getPayloadObject(5).readUInt8(0);
    store.commit("SET_IS_ADMIN", isAdmin);
    const mcUuid = action.getPayloadObjectAsString(2);
    store.commit("SET_MC_UUID", mcUuid);

    this.getLatestUsername(mcUuid).then(name => {
      store.commit("SET_MC_NAME", name || "User");
    });

    store.commit("SET_LOADING", false);
  }

  async getLatestUsername(uuid: string): Promise<string> {
    // Should be changed to not use an external CORS bypass service, but this works fine for now...
    const res = await axios.get(`https://quickplay.bugg.co/proxy/name/${uuid}`);
    if (res.status != 200 || !res.data) {
      return "";
    }

    return res.data;
  }
}

export default AuthCompleteSubscriber;
