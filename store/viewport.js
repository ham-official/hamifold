const maxMobileWidth = 640;
const minTabletWidth = 768;
const desktopWidth = 1024;

export const viewportModule = {
  state: () => ({
    viewport: null,
    isBiggerThanMobile: null,
    isBiggerThanTablet: null,
    isDesktop: null,
  }),
  mutations: {
    setViewportSize: (state, viewport) => {
      state.viewport = viewport;
      state.isBiggerThanMobile = viewport.width > maxMobileWidth;
      state.isBiggerThanTablet = viewport.width > minTabletWidth;
      state.isDesktop = viewport.width > desktopWidth;
    },
  },
  actions: {
    setViewportSize: ({ commit }, viewport) => {
      commit('setViewportSize', viewport);
    },
  },
  getters: {
    viewport: (state) => state.viewport,
    isBiggerThanMobile: (state) => state.isBiggerThanMobile,
    isBiggerThanTablet: (state) => state.isBiggerThanTablet,
    isDesktop: (state) => state.isDesktop,
  },
};
