import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Index from "../views/Index.vue";
import Logout from "../views/Logout.vue";
import AdminPanel from "../views/AdminPanel.vue";
import Error404 from "../views/Error404.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "",
    name: "Home",
    component: Index,
    meta: { title: "Home" }
  },
  {
    path: "/logout",
    name: "Logout",
    component: Logout,
    meta: { title: "Logout" }
  },
  {
    path: "/admin",
    redirect: "/admin/screens",
    meta: { title: "Admin" }
  },
  {
    path: "/admin/:type",
    name: "Admin",
    component: AdminPanel,
    meta: { title: "Admin" }
  },
  {
    path: "*",
    name: "404",
    component: Error404,
    meta: { title: "404 Error" }
  }
];

const router = new VueRouter({
  mode: "history",
  // base: process.env.VUE_APP_BASE_PATH,
  routes
});

export default router;
