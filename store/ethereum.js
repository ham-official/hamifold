export const ethereumModule = {
  state: () => ({
    chainId: null,
    isConnected: false,
    wallet: null,
    ens: null,
  }),
  mutations: {
    setChainId(state, chainId) {
      state.chainId = chainId;
    },
    setIsConnected: (state, isConnected) => {
      state.isConnected = isConnected;
    },
    setWallet(state, wallet) {
      state.wallet = wallet;
    },
    setEns(state, ens) {
      state.ens = ens;
    },
  },
  actions: {
    setChainId: ({ commit }, chainId) => {
      commit("setChainId", chainId);
    },
    setIsConnected: ({ commit }, isConnected) => {
      commit("setIsConnected", isConnected);
    },
    setWallet: ({ commit }, wallet) => {
      commit("setWallet", wallet);
    },
    setEns: ({ commit }, ens) => {
      commit("setEns", ens);
    },
  },
  getters: {
    chainId: (state) => state.chainId,
    isConnected: (state) => state.isConnected,
    wallet: (state) => state.wallet,
    ens: (state) => state.ens,
  },
};
