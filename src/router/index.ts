import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Index from "../views/index.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Index
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.VUE_APP_BASE_PATH,
  routes
});

export default router;
