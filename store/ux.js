export const uxModule = {
  state: () => ({
    showGeneralModal: false,
    modalData: null,
  }),
  mutations: {
    SET_MODAL_DATA: (state, data) => {
      state.modalData = data;
    },
    SET_SHOW_GENERAL_MODAL: (state, status) => {
      state.showGeneralModal = status;
    },
  },
  actions: {
    setModalData: ({ commit }, data) => {
      commit('SET_MODAL_DATA', data);
    },
    setShowGeneralModal: ({ commit }, data) => {
      commit('SET_SHOW_GENERAL_MODAL', data);
    },
  },
  getters: {
    modalData: (state) => state.modalData,
    showGeneralModal: (state) => state.showGeneralModal
  },
};
