import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import Trend from "vuetrend"

import { library } from "@fortawesome/fontawesome-svg-core";
import { faQuoteLeft } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(faQuoteLeft)
Vue.component('FontAwesomeIcon', FontAwesomeIcon)

Vue.config.productionTip = false;

Vue.use(Trend)
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
