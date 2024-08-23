import { boilerplateStore } from '~/store';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(boilerplateStore);
});
