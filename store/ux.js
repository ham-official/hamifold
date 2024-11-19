export const uxModule = {
  state: () => ({
    currentTokenIndex: -1,
    modalData: null,
    showGeneralModal: false,
    showSlideOver: false,
    slideOverData: null,
    totalTokens: 0,
    visibleTokens: null,
  }),
  mutations: {
    SET_CURRENT_TOKEN_INDEX: (state, index) => {
      state.currentTokenIndex = index
    },
    SET_MODAL_DATA: (state, data) => {
      state.modalData = data;
    },
    SET_SHOW_GENERAL_MODAL: (state, status) => {
      state.showGeneralModal = status;
    },
    SET_SHOW_SLIDE_OVER: (state, status) => {
      state.showSlideOver = status;
    },
    SET_SLIDE_OVER_DATA: (state, data) => {
      state.slideOverData = data;
    },
    SET_TOTAL_TOKENS: (state, totalTokens) => {
      state.totalTokens = totalTokens
    },
    SET_VISIBLE_TOKENS: (state, tokens) => {
      state.visibleTokens = tokens
      state.totalTokens = tokens.length
    },
  },
  actions: {
    setCurrentTokenIndex: ({ commit }, index) => {
      commit('SET_CURRENT_TOKEN_INDEX', index);
    },
    setModalData: ({ commit }, data) => {
      commit('SET_MODAL_DATA', data);
    },
    setShowGeneralModal: ({ commit }, status) => {
      commit('SET_SHOW_GENERAL_MODAL', status);
    },
    setShowSlideOver: ({ commit }, status) => {
      commit('SET_SHOW_SLIDE_OVER', status);
    },
    setSlideOverData: ({ commit }, data) => {
      commit('SET_SLIDE_OVER_DATA', data);
    },
    setVisibleTokens: ({ commit }, tokens) => {
      commit('SET_VISIBLE_TOKENS', tokens)
    },
  },
  getters: {
    currentTokenIndex: (state) => state.currentTokenIndex,
    modalData: (state) => state.modalData,
    showGeneralModal: (state) => state.showGeneralModal,
    showSlideOver: (state) => state.showSlideOver,
    slideOverData: (state) => state.slideOverData,
    totalTokens: (state) => state.totalTokens,
    visibleTokens: (state) => state.visibleTokens
  },
};
