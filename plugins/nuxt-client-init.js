import { boilerplateStore } from '../store';

export default defineNuxtPlugin(async () => {
  boilerplateStore.dispatch('setViewportSize', {
    height: window.innerHeight,
    width: window.innerWidth,
  });
  window.onresize = () => {
    boilerplateStore.dispatch('setViewportSize', {
      height: window.innerHeight,
      width: window.innerWidth,
    });
  };
});
