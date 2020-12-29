import Vue from "vue";
import Vuex from "vuex";
import {
  Action,
  ActionBus,
  AuthBeginHandshakeAction,
  AuthCompleteAction,
  AuthFailedAction,
  DisableModAction,
  InitializeClientAction,
  RemoveAliasedActionAction,
  RemoveButtonAction,
  RemoveScreenAction,
  RemoveTranslationAction,
  Resolver,
  SendChatComponentAction,
  SetAliasedActionAction,
  SetButtonAction,
  SetScreenAction,
  SetTranslationAction,
  SystemOutAction,
  Screen,
  Button,
  AliasedAction,
  PushEditHistoryEventAction, SetCurrentUserCountAction
} from "@quickplaymod/quickplay-actions-js";
import { Buffer } from "buffer";
import AuthCompleteSubscriber from "@/subscribers/AuthCompleteSubscriber";
import AuthBeginSubscriber from "@/subscribers/AuthBeginSubscriber";
import AuthFailedSubscriber from "@/subscribers/AuthFailedSubscriber";
import SetScreenSubscriber from "@/subscribers/SetScreenSubscriber";
import SetButtonSubscriber from "@/subscribers/SetButtonSubscriber";
import SetAliasedActionSubscriber from "@/subscribers/SetAliasedActionSubscriber";
import SetTranslationSubscriber from "@/subscribers/SetTranslationSubscriber";
import DisableModSubscriber from "@/subscribers/DisableModSubscriber";
import RemoveAliasedActionSubscriber from "@/subscribers/RemoveAliasedActionSubscriber";
import RemoveButtonSubscriber from "@/subscribers/RemoveButtonSubscriber";
import RemoveScreenSubscriber from "@/subscribers/RemoveScreenSubscriber";
import SendChatComponentSubscriber from "@/subscribers/SendChatComponentSubscriber";
import AddUserCountHistorySubscriber from "@/subscribers/AddUserCountHistorySubscriber";
import SystemOutSubscriber from "@/subscribers/SystemOutSubscriber";
import RemoveTranslationSubscriber from "@/subscribers/RemoveTranslationSubscriber";
import PushEditHistoryEventSubscriber from "@/subscribers/PushEditHistoryEventSubscriber";
import AddUserCountHistoryAction from "@quickplaymod/quickplay-actions-js/dist/actions/clientbound/AddUserCountHistoryAction";
import SetCurrentUserCountSubscriber from "@/subscribers/SetCurrentUserCountSubscriber";

Vue.use(Vuex);

interface StateInterface {
  actionBus?: ActionBus;
  socket?: WebSocket;
  loggedIn: boolean;
  isAdmin: boolean;
  loading: boolean;
  loginFailed: boolean;
  googleId?: string;
  googleJwt?: string;
  mcName?: string;
  mcUuid?: string;
  errorMessages: string[];
  screens: Record<string, Screen>;
  buttons: Record<string, Button>;
  aliasedActions: Record<string, AliasedAction>;
  translations: Record<string, Record<string, string>>;
  connectionHistory: Record<number, number>;
  currentConnections: number;
  editHistory: {
    events: Record<string, unknown>[];
    keyIndex: Record<string, number[]>;
  };
}
interface StoreContext {
  state: StateInterface;
  commit: Function;
  dispatch: Function;
}

const state: StateInterface = {
  loginFailed: false,
  loggedIn: false,
  isAdmin: false,
  loading: true,
  errorMessages: [],
  screens: {},
  buttons: {},
  aliasedActions: {},
  translations: {},
  mcName: "",
  editHistory: {
    events: [],
    keyIndex: {}
  },
  currentConnections: 0,
  connectionHistory: {}
};
const getters = {};

const mutations = {
  SET_SCREEN(state: StateInterface, arg: { key: string; value: Screen }) {
    if (!state.screens) {
      Vue.set(state, "screens", {});
    }
    Vue.set(state.screens, arg.key, arg.value);
  },
  SET_BUTTON(state: StateInterface, arg: { key: string; value: Button }) {
    if (!state.buttons) {
      Vue.set(state, "buttons", {});
    }
    Vue.set(state.buttons, arg.key, arg.value);
  },
  SET_ALIASED_ACTION(
    state: StateInterface,
    arg: { key: string; value: AliasedAction }
  ) {
    if (!state.aliasedActions) {
      Vue.set(state, "aliasedActions", {});
    }
    Vue.set(state.aliasedActions, arg.key, arg.value);
  },
  SET_TRANSLATION(
    state: StateInterface,
    arg: { key: string; lang: string; value: string }
  ) {
    if (!state.translations) {
      Vue.set(state, "translations", {});
    }
    if (!state.translations[arg.key]) {
      Vue.set(state.translations, arg.key, {});
    }
    Vue.set(state.translations[arg.key], arg.lang, arg.value);
  },
  PUSH_ERROR_MESSAGE(state: StateInterface, msg: string) {
    state.errorMessages.push(msg);
  },
  POP_ERROR_MESSAGE(state: StateInterface) {
    if (!state.errorMessages || !state.errorMessages.length) {
      return;
    }
    state.errorMessages.splice(0, 1);
  },
  PUSH_EDIT_EVENT(state: StateInterface, editEvent: Record<string, unknown>) {
    state.editHistory.events.push(editEvent);
    if (editEvent.itemKey) {
      // Create an item key index array if one does not already exist for this item key
      if (!state.editHistory.keyIndex[editEvent.itemKey as string]) {
        state.editHistory.keyIndex[editEvent.itemKey as string] = [];
      }
      // Push this event's key in the events array into the item key index array for this item key
      state.editHistory.keyIndex[editEvent.itemKey as string].push(
        state.editHistory.events.length - 1
      );
    }
  },
  SET_LOADING(state: StateInterface, loading: boolean) {
    state.loading = loading;
  },
  SET_LOGGED_IN(state: StateInterface, loggedIn: boolean) {
    state.loggedIn = loggedIn;
  },
  SET_IS_ADMIN(state: StateInterface, isAdmin: boolean) {
    state.isAdmin = isAdmin;
  },
  SET_MC_NAME(state: StateInterface, mcName: string) {
    state.mcName = mcName;
  },
  SET_MC_UUID(state: StateInterface, mcUuid: string) {
    state.mcUuid = mcUuid;
  },
  SET_GOOGLE_ID(state: StateInterface, id: string) {
    state.googleId = id;
  },
  SET_GOOGLE_JWT(state: StateInterface, jwt: string) {
    state.googleJwt = jwt;
  },
  SET_LOGIN_FAILED(state: StateInterface, loginFailed: boolean) {
    state.loginFailed = loginFailed;
  },
  CREATE_NEW_SOCKET(state: StateInterface) {
    if (state.socket != null && state.socket.readyState != WebSocket.CLOSED) {
      state.socket.close();
    }
    state.socket = new WebSocket(process.env.VUE_APP_SOCKET_URL);
    state.actionBus = new ActionBus();
    state.socket.addEventListener("message", async message => {
      const action = Resolver.from(
        Buffer.from(await message.data.arrayBuffer())
      );
      state?.actionBus?.publish(action);
    });
  },
  ALTER_CONNECTION_HISTORY(
    state: StateInterface,
    data: { timestamp: number; count: number; clearHistory: boolean }
  ) {
    if (data.clearHistory) {
      Vue.set(state, "connectionHistory", {});
    }
    Vue.set(state.connectionHistory, data.timestamp, data.count);
  },
  SET_CURRENT_CONNECTIONS(state: StateInterface, currentConnections: number) {
    state.currentConnections = currentConnections;
  }
};
const actions = {
  async logout(ctx: StoreContext) {
    const auth2 = await (Vue as any).GoogleAuth;
    await auth2.signOut();
    Vue.$cookies.remove(process.env.VUE_APP_SESSION_COOKIE);
    Vue.$cookies.remove(process.env.VUE_APP_GOOGLE_ACCOUNT_COOKIE);
    ctx.commit("SET_LOADING", false);
    ctx.commit("SET_LOGGED_IN", false);
    ctx.state.socket?.close();
  },
  async initialize(ctx: StoreContext) {
    ctx.commit("SET_LOADING", true);
    const auth2 = await (Vue as any).GoogleAuth;
    const accIdCookie = Vue.$cookies.get(
      process.env.VUE_APP_GOOGLE_ACCOUNT_COOKIE
    );
    // If the Google account ID is cached (i.e. has signed in in past 3 hours), use the cached cookie as the login ID.
    if (accIdCookie) {
      ctx.commit("SET_GOOGLE_ID", accIdCookie);
    } else {
      // Otherwise, sign out (in case user was signed in) and attempt to sign into Google.
      await auth2.signOut();
      try {
        const res = await auth2.signIn();
        Vue.$cookies.set(
          process.env.VUE_APP_GOOGLE_ACCOUNT_COOKIE,
          res.getBasicProfile().getId(),
          "3h"
        );
        ctx.commit("SET_GOOGLE_ID", res.getBasicProfile().getId());
        ctx.commit("SET_GOOGLE_JWT", res.getAuthResponse().id_token);
      } catch (e) {
        console.error(e);
        ctx.commit("SET_LOADING", false);
        ctx.commit("SET_LOGGED_IN", false);
        ctx.commit("SET_LOGIN_FAILED", true);
        return;
      }
    }

    await ctx.dispatch("createSocket");
    await ctx.dispatch("sendInitializeClientAction");
  },
  async sendInitializeClientAction(ctx: StoreContext) {
    ctx.dispatch("sendAction", {
      action: new InitializeClientAction(
        ctx.state.googleId,
        "GOOGLE",
        "Quickplay Portal",
        process.env.VUE_APP_PORTAL_VERSION,
        "en_us",
        "",
        ""
      )
    });
  },
  async createSocket(ctx: StoreContext) {
    ctx.commit("CREATE_NEW_SOCKET");
    await new Promise(resolve => {
      if (ctx.state.socket == null) {
        return;
      }
      ctx.state.socket.addEventListener("open", () => {
        resolve();
      });
      ctx.state.socket.addEventListener("close", () => {
        console.log("Socket closed");
        ctx.commit("SET_LOGGED_IN", false);
        ctx.commit("SET_LOGIN_FAILED", true);
        ctx.commit("PUSH_ERROR_MESSAGE", "Socket connection closed.");
      });
      ctx.state.socket.addEventListener("error", () => {
        ctx.commit(
          "PUSH_ERROR_MESSAGE",
          "ERROR: Something went wrong while connected to the backend!"
        );
      });
    });
    ctx.state.actionBus?.subscribe(
      AuthCompleteAction,
      new AuthCompleteSubscriber()
    );
    ctx.state.actionBus?.subscribe(
      AuthBeginHandshakeAction,
      new AuthBeginSubscriber()
    );
    ctx.state.actionBus?.subscribe(
      AuthFailedAction,
      new AuthFailedSubscriber()
    );
    ctx.state.actionBus?.subscribe(SetScreenAction, new SetScreenSubscriber());
    ctx.state.actionBus?.subscribe(SetButtonAction, new SetButtonSubscriber());
    ctx.state.actionBus?.subscribe(
      SetAliasedActionAction,
      new SetAliasedActionSubscriber()
    );
    ctx.state.actionBus?.subscribe(
      SetTranslationAction,
      new SetTranslationSubscriber()
    );
    ctx.state.actionBus?.subscribe(
      DisableModAction,
      new DisableModSubscriber()
    );
    ctx.state.actionBus?.subscribe(
      RemoveAliasedActionAction,
      new RemoveAliasedActionSubscriber()
    );
    ctx.state.actionBus?.subscribe(
      RemoveButtonAction,
      new RemoveButtonSubscriber()
    );
    ctx.state.actionBus?.subscribe(
      RemoveScreenAction,
      new RemoveScreenSubscriber()
    );
    ctx.state.actionBus?.subscribe(
      RemoveTranslationAction,
      new RemoveTranslationSubscriber()
    );
    ctx.state.actionBus?.subscribe(
      SendChatComponentAction,
      new SendChatComponentSubscriber()
    );
    ctx.state.actionBus?.subscribe(
      SetCurrentUserCountAction,
      new SetCurrentUserCountSubscriber()
    );
    ctx.state.actionBus?.subscribe(
      AddUserCountHistoryAction,
      new AddUserCountHistorySubscriber()
    );
    ctx.state.actionBus?.subscribe(SystemOutAction, new SystemOutSubscriber());
    ctx.state.actionBus?.subscribe(
      PushEditHistoryEventAction,
      new PushEditHistoryEventSubscriber()
    );
  },
  sendAction(ctx: StoreContext, payload: { action: Action }) {
    if (
      ctx.state.socket == null ||
      ctx.state.socket.readyState != WebSocket.OPEN
    ) {
      throw new Error("Socket connection is null or not open.");
    }
    ctx.state.socket.send(payload.action.build());
  }
};
const modules = {};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules
});
