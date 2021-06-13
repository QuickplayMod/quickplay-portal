import Vue from "vue";
import * as VueCookie from "vue-cookies";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faQuoteLeft,
  faPencil,
  faTrash,
  faChevronDown,
  faArrowAltDown,
  faArrowAltUp,
  faCaretDown,
  faChevronUp,
  faCheckCircle,
  faCheckSquare,
  faPlus,
  faSearch,
  faChevronLeft,
  faChevronRight,
  faLink,
  faUpload
} from "@fortawesome/pro-solid-svg-icons";
import { faCircle, faSquare } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(
  faQuoteLeft,
  faPencil,
  faTrash,
  faChevronDown,
  faChevronUp,
  faChevronRight,
  faChevronLeft,
  faCircle,
  faCheckCircle,
  faSquare,
  faCheckSquare,
  faPlus,
  faSearch,
  faArrowAltDown,
  faArrowAltUp,
  faCaretDown,
  faLink,
  faUpload
);

Vue.use(VueCookie);
Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.component("FontAwesomeIcon", FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
