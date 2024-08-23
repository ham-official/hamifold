import { providers, Contract } from "ethers";
import wc from "@/api/platforms/walletConnect/setup.js";
import { abi as contractDeployerABI } from "@/data/abi/ERC721Deployer";
// import { abi as contractDeployerEditionABI } from "@/data/abi/DeployHamERC721Edition";

const CHAIN_ID = import.meta.env.VITE_CHAIN_ID;
const ERC721_CONTRACT_DEPLOYER = import.meta.env.VITE_ERC721_CONTRACT_DEPLOYER;
const ERC721_EDITION_CONTRACT_DEPLOYER = import.meta.env.VITE_ERC721_EDITION_CONTRACT_DEPLOYER;

export const hamERC721ContractDeployer = (name, tokenName) => {
  return new Promise(async (resolve, reject) => {
    try {
      const web3Provider = wc.modal.getWalletProvider();

      const provider = new providers.Web3Provider(web3Provider);

      const signer = provider.getSigner();

      const contract = new Contract(
        ERC721_CONTRACT_DEPLOYER,
        contractDeployerABI,
        signer
      );

      const transaction = await contract.ham721Deploy(name, tokenName);

      resolve(transaction);
    } catch (error) {
      console.error("Deployment failed:", error);
      reject(new Error(error));
    }
  });
};

export const hamERC721EditionContractDeployer = (name, tokenName) => {
  return new Promise(async (resolve, reject) => {
    try {
      const web3Provider = wc.modal.getWalletProvider();

      const provider = new providers.Web3Provider(web3Provider);

      const signer = provider.getSigner();

      const contract = new Contract(
        ERC721_EDITION_CONTRACT_DEPLOYER,
        contractDeployerABI,
        signer
      );
      const transaction = await contract.ham721Deploy(name, tokenName);

      resolve(transaction);
    } catch (error) {
      console.error("Deployment failed:", error);
      reject(new Error(error));
    }
  });
};
