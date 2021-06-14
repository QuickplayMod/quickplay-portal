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
  PushEditHistoryEventAction,
  SetCurrentUserCountAction,
  SetRegexAction,
  RemoveRegexAction
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
import SetRegexSubscriber from "@/subscribers/SetRegexSubscriber";
import RemoveRegexSubscriber from "@/subscribers/RemoveRegexSubscriber";
import { IdentifierTypes } from "@quickplaymod/quickplay-actions-js/dist/actions/serverbound/InitializeClientAction";

Vue.use(Vuex);

interface StateInterface {
  actionBus?: ActionBus;
  socket?: WebSocket;
  loggedIn: boolean;
  loggedOut: boolean;
  isAdmin: boolean;
  loading: boolean;
  loginFailed: boolean;
  unlinkedDiscord?: boolean;
  mcName?: string;
  mcUuid?: string;
  errorMessages: string[];
  screens: Record<string, Screen>;
  buttons: Record<string, Button>;
  aliasedActions: Record<string, AliasedAction>;
  translations: Record<string, Record<string, string>>;
  regexes: Record<string, string>;
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
  loggedOut: false,
  isAdmin: false,
  loading: true,
  errorMessages: [],
  screens: {},
  buttons: {},
  aliasedActions: {},
  translations: {},
  regexes: {},
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
  SET_REGEX(state: StateInterface, arg: { key: string; value: string }) {
    if (!state.regexes) {
      Vue.set(state, "regexes", {});
    }
    Vue.set(state.regexes, arg.key, arg.value);
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
  SET_LOGGED_OUT(state: StateInterface, loggedOut: boolean) {
    state.loggedOut = loggedOut;
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
  SET_UNLINKED_DISCORD(state: StateInterface, isDiscordUnlinked: boolean) {
    state.unlinkedDiscord = isDiscordUnlinked;
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
    Vue.$cookies.remove(process.env.VUE_APP_SESSION_COOKIE);
    ctx.commit("SET_LOADING", false);
    ctx.commit("SET_LOGGED_IN", false);
    ctx.commit("SET_LOGGED_OUT", true);
    ctx.state.socket?.close();
  },
  async initialize(ctx: StoreContext) {
    ctx.commit("SET_LOADING", true);
    await ctx.dispatch("createSocket");
    await ctx.dispatch("sendInitializeClientAction");
  },
  async sendInitializeClientAction(ctx: StoreContext) {
    const idCookie = Vue.$cookies.get(process.env.VUE_APP_DISCORD_ID_COOKIE);
    // Discord does not return client ID until client is fully authenticated w/ application secret.
    // If cached from prev. connection we'll use that so we can reestablish that prev. connection. Otherwise
    // it's left blank for now.
    const discordId = idCookie || "";
    ctx.dispatch("sendAction", {
      action: new InitializeClientAction(
        discordId,
        IdentifierTypes.DISCORD,
        "Quickplay Portal",
        process.env.VUE_APP_QUICKPLAY_COMPLIANT_VERSION,
        "en_us",
        "",
        process.env.VUE_APP_PORTAL_VERSION
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
    ctx.state.actionBus?.subscribe(SetRegexAction, new SetRegexSubscriber());
    ctx.state.actionBus?.subscribe(
      RemoveRegexAction,
      new RemoveRegexSubscriber()
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
