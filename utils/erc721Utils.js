import { providers, Contract } from "ethers";
import wc from "@/api/platforms/walletConnect/setup.js";
import { abi } from "@/data/abi/HamERC721";

export const safeMint = (uri, contractAddress) => {
  return new Promise(async (resolve, reject) => {
    try {
      const web3Provider = wc.modal.getWalletProvider();
      const provider = new providers.Web3Provider(web3Provider);
      const signer = provider.getSigner();
      const contract = new Contract(contractAddress, abi, signer);

      const transaction = await contract.safeMint(uri);
      await transaction.wait();

      resolve(transaction);
    } catch (error) {
      console.error("Mint failed:", error);
      reject(new Error(error));
    }
  });
};
