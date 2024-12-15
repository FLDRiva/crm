import Vue from "vue";
import Router from "vue-router";
import LoadingPage from "../src/views/LoadingPage";
import axios from "axios";

axios.defaults.withCredentials = true;
Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      component: LoadingPage,
      beforeEnter: (to, from, next) => {
        const token = localStorage.getItem('token');
        if (token) {
          next('/profile');
        } else {
          next();
        }
      }
    },
    {
      path: "/login",
      component: LoadingPage,
    },
    {
      path: "/signup",
      component: () => import("../src/views/SignUp"),
    },
    {
      path: "/reset",
      component: () => import("../src/views/ResetPage.vue"),
    },
    {
      path: "/profile",
      component: () => import("../src/views/UsersProfile"),
      beforeEnter: (to, from, next) => {
        const token = localStorage.getItem('token');
        if (token) {
          next();
        } else {
          next('/');
        }
      }
    },
  ],
});
