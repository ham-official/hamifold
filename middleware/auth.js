import { navigateTo } from "nuxt/app";
import { boilerplateStore } from "../store";

const publicRoutes = ["index", "sign-in"];

export const isPrivateRoute = (route) => {
  return !publicRoutes.includes(route.name);
};

export default defineNuxtRouteMiddleware((to, from) => {
  const user = boilerplateStore.getters.wallet
  // skip middleware on server
  if (process.server) return;
  const homeNotAuthRoute = "/sign-in";
  if (isPrivateRoute(to) && !user) {
    return navigateTo(homeNotAuthRoute)
  }
});
