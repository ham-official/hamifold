import { createWeb3Modal, defaultConfig } from "@web3modal/ethers5/vue";

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

const chains = [
  {
    chainId: 5112,
    name: "Ham",
    currency: "ETH",
    explorerUrl: "https://explorer.ham.fun",
    rpcUrl: "https://rpc.ham.fun",
  }
];
if (import.meta.env.VITE_DEV_ENVIRONMENT === 'TRUE') {
  const baseSepoliaNetwork = {
    chainId: 84532,
    name: "Base Sepolia",
    currency: "ETH",
    explorerUrl: "",
    rpcUrl: "https://sepolia.base.org/",
  }
  chains.push(baseSepoliaNetwork)
}
const chainImages = {
  5112: "https://ham.fun/assets/ham-chain-icon-DEsPojCt.png",
};
const ethersConfig = defaultConfig({
  metadata: {
    name: "Ham Modal",
    description: "Ham chain Laboratory",
    url: "https://ham.fun/",
    icons: ["https://avatars.githubusercontent.com/u/37784886"],
  },
  defaultChainId: 1,
  rpcUrl: "https://cloudflare-eth.com",
});

export default {
  modal: createWeb3Modal({
    ethersConfig,
    projectId,
    chains,
    chainImages,
    allowUnsupportedChain: false,
    themeMode: "light",
    themeVariables: {
      "--w3m-color-mix": "#EB4747",
      "--w3m-color-mix-strength": 0,
      "--w3m-accent": "#EB4747",
    },
  }),
};
