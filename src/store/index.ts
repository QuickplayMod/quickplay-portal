import Vue from "vue";
import Vuex from "vuex";
import {
  Action,
  ActionBus,
  AuthBeginHandshakeAction, AuthCompleteAction, AuthFailedAction,
  InitializeClientAction,
  Resolver
} from "@quickplaymod/quickplay-actions-js";
import {Buffer} from "buffer";
import AuthCompleteSubscriber from "@/subscribers/AuthCompleteSubscriber";
import AuthBeginSubscriber from "@/subscribers/AuthBeginSubscriber";
import AuthFailedSubscriber from "@/subscribers/AuthFailedSubscriber";

Vue.use(Vuex);

interface StateInterface {
  actionBus?: ActionBus
  socket?: WebSocket,
  loggedIn: boolean,
  isAdmin: boolean,
  loading: boolean
  loginFailed: boolean,
  googleId?: string,
  googleJwt?: string
  mcName?: string,
  mcUuid?: string
}
interface StoreContext {
  state: StateInterface,
  commit: Function,
  dispatch: Function
}

const state: StateInterface = {
  loginFailed: false,
  loggedIn: false,
  isAdmin: false,
  loading: true
}
const getters = {

}
const mutations = {
  SET_LOADING(state: StateInterface, loading: boolean) {
    state.loading = loading
  },
  SET_LOGGED_IN(state: StateInterface, loggedIn: boolean) {
    state.loggedIn = loggedIn
  },
  SET_IS_ADMIN(state: StateInterface, isAdmin: boolean) {
    state.isAdmin = isAdmin
  },
  SET_MC_NAME(state: StateInterface, mcName: string) {
    state.mcName = mcName
  },
  SET_MC_UUID(state: StateInterface, mcUuid: string) {
    state.mcUuid = mcUuid
  },
  SET_GOOGLE_ID(state: StateInterface, id: string) {
    state.googleId = id
  },
  SET_GOOGLE_JWT(state: StateInterface, jwt: string) {
    state.googleJwt = jwt
  },
  SET_LOGIN_FAILED(state: StateInterface, loginFailed: boolean) {
    state.loginFailed = loginFailed
  },
  CREATE_NEW_SOCKET(state: StateInterface) {
    if(state.socket != null && state.socket.readyState != WebSocket.CLOSED) {
      state.socket.close()
    }
    state.socket = new WebSocket(process.env.VUE_APP_SOCKET_URL)
    state.actionBus = new ActionBus()
    state.socket.addEventListener("message", async (message) => {
      const action = Resolver.from(Buffer.from(await message.data.arrayBuffer()))
      state?.actionBus?.publish(action)
    });
  }
}
const actions = {
  async logout(ctx: StoreContext) {
    const auth2 = await (Vue as any).GoogleAuth;
    await auth2.signOut()
    Vue.$cookies.remove(process.env.VUE_APP_SESSION_COOKIE)
    Vue.$cookies.remove(process.env.VUE_APP_GOOGLE_ACCOUNT_COOKIE)
    ctx.commit("SET_LOADING", false)
    ctx.commit("SET_LOGGED_IN", false)
    ctx.state.socket?.close()
  },
  async initialize(ctx: StoreContext) {
    ctx.commit("SET_LOADING", true)
    const auth2 = await (Vue as any).GoogleAuth;
    const accIdCookie = Vue.$cookies.get(process.env.VUE_APP_GOOGLE_ACCOUNT_COOKIE);
    // If the Google account ID is cached (i.e. has signed in in past 3 hours), use the cached cookie as the login ID.
    if (accIdCookie) {
      ctx.commit("SET_GOOGLE_ID", accIdCookie)
    } else {
      // Otherwise, sign out (in case user was signed in) and attempt to sign into Google.
      await auth2.signOut()
      try {
        const res = await auth2.signIn();
        Vue.$cookies.set(process.env.VUE_APP_GOOGLE_ACCOUNT_COOKIE, res.getBasicProfile().getId(), '3h')
        ctx.commit("SET_GOOGLE_ID", res.getBasicProfile().getId())
        ctx.commit("SET_GOOGLE_JWT", res.getAuthResponse().id_token)
      } catch (e) {
        console.error(e);
        ctx.commit("SET_LOADING", false)
        ctx.commit("SET_LOGGED_IN", false)
        ctx.commit("SET_LOGIN_FAILED", true)
        return
      }
    }

    await ctx.dispatch("createSocket")
    await ctx.dispatch("sendInitializeClientAction")
  },
  async sendInitializeClientAction (ctx: StoreContext) {
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
  async createSocket (ctx: StoreContext) {
    ctx.commit("CREATE_NEW_SOCKET")
    await new Promise((resolve) => {
      if(ctx.state.socket == null) {
        return
      }
      ctx.state.socket.addEventListener("open", () => {
        resolve()
      })
      ctx.state.socket.addEventListener("close", () => {
        console.log("Socket closed")
        ctx.commit("SET_LOGGED_IN", false)
        ctx.commit("SET_LOGIN_FAILED", true)
      })
      ctx.state.socket.addEventListener("error", () => {
        // TODO notify user of error
      })
    })
    ctx.state.actionBus?.subscribe(AuthCompleteAction, new AuthCompleteSubscriber())
    ctx.state.actionBus?.subscribe(AuthBeginHandshakeAction, new AuthBeginSubscriber())
    ctx.state.actionBus?.subscribe(AuthFailedAction, new AuthFailedSubscriber())
  },
  sendAction(ctx: StoreContext, payload: {action: Action}) {
    if(ctx.state.socket == null || ctx.state.socket.readyState != WebSocket.OPEN) {
      throw new Error('Socket connection is null or not open.')
    }
    ctx.state.socket.send(payload.action.build())
  }
}
const modules = {

}

export default new Vuex.Store({
  state, getters, mutations, actions, modules
});
