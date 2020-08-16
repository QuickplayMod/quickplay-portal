import Vue from "vue";
import * as VueCookie from "vue-cookies";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { LoaderPlugin } from "vue-google-login";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faQuoteLeft } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(faQuoteLeft)

Vue.use(VueCookie)
Vue.use(LoaderPlugin, {
  // eslint-disable-next-line @typescript-eslint/camelcase
  client_id: process.env.VUE_APP_GOOGLE_CLIENT_ID
})
Vue.component('FontAwesomeIcon', FontAwesomeIcon)

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
