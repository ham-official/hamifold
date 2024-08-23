import { providers, Contract, utils } from "ethers";
import wc from "@/api/platforms/walletConnect/setup.js";
import { abi } from "@/data/abi/HamERC721Edition";

export const setEditionInfo = (editionData, contractAddress) => {
  return new Promise(async (resolve, reject) => {
    try {
      const web3Provider = wc.modal.getWalletProvider();
      const provider = new providers.Web3Provider(web3Provider);

      const signer = provider.getSigner();

      const contract = new Contract(contractAddress, abi, signer);

      // Get the number of tokens for this contract and this is what we should use for the type
      console.log({ contract, editionData });
      const transaction = await contract.createEditionInfo(
        editionData.tokenName,
        editionData.image,
        editionData.description,
        editionData.startDate ?? 0,
        editionData.endDate ?? 0,
        editionData.maxSupply ?? 0,
        utils.parseUnits(editionData.tokenPrice.toString(), 9),
        editionData.maxNumberOfTokensPerWallet ?? 0,
        {
          gasLimit: 5000000,
        }
      );

      await transaction.wait();

      resolve(transaction);
    } catch (error) {
      console.error("Set Edition failed:", error);
      reject(new Error(error));
    }
  });
};

export const mint = (tokenType, contractAddress) => {
  return new Promise(async (resolve, reject) => {
    try {
      const web3Provider = wc.modal.getWalletProvider();
      const provider = new providers.Web3Provider(web3Provider);

      const signer = provider.getSigner();

      const contract = new Contract(contractAddress, abi, signer);

      const transaction = await contract.mint(tokenType, {
        gasLimit: 5000000,
      });

      await transaction.wait();

      resolve(transaction);
    } catch (error) {
      console.error("Mint failed:", error);
      reject(new Error(error));
    }
  });
};
export const batchMint = (
  tokenType,
  contractAddress,
  numberOfTokens = 1,
  price = null
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const web3Provider = wc.modal.getWalletProvider();
      const provider = new providers.Web3Provider(web3Provider);

      const signer = provider.getSigner();

      const contract = new Contract(contractAddress, abi, signer);

      const options = {};

      options.gasLimit = 5000000;

      if (price && price > 0) {
        options.value = utils.parseEther((parseFloat(price) * numberOfTokens).toFixed(5));
      }
      const transaction = await contract.batchMint(
        tokenType,
        numberOfTokens,
        options
      );

      await transaction.wait();

      resolve(transaction);
    } catch (error) {
      console.error("Mint failed:", error);
      reject(new Error(error));
    }
  });
};

export const nextTokenTypeId = (contractAddress) => {
  return new Promise(async (resolve, reject) => {
    try {
      const rpcURL = import.meta.env.VITE_RPC_URL
      const network = {
        chainId: parseInt(import.meta.env.VITE_CHAIN_ID),
      }
      const provider = new providers.JsonRpcProvider(rpcURL, network);

      const contract = new Contract(contractAddress, abi, provider);

      const transaction = await contract.nextTokenTypeId();

      resolve(transaction);
    } catch (error) {
      console.error("Check nextTokenId failed:", error);
      reject(new Error(error));
    }
  });
};

export const listEditions = (contractAddress) => {
  return new Promise(async (resolve, reject) => {
    try {
      const web3Provider = wc.modal.getWalletProvider();
      const provider = new providers.Web3Provider(web3Provider);

      const signer = provider.getSigner();

      const contract = new Contract(contractAddress, abi, signer);

      const tokenTypeCount = await contract.nextTokenTypeId();

      const tokenTypes = [];
      for (let i = 0; i < tokenTypeCount; i++) {
        const element = await contract.typeIDToInfo(i);
        tokenTypes.push(element);
      }

      resolve(tokenTypes);
    } catch (error) {
      console.error("Listing editions failed:", error);
      reject(new Error(error));
    }
  });
};

export const getTokensForWallet = (wallet, contractAddress) => {
  return new Promise(async (resolve, reject) => {
    try {
      const web3Provider = wc.modal.getWalletProvider();
      const provider = new providers.Web3Provider(web3Provider);

      const signer = provider.getSigner();

      const contract = new Contract(contractAddress, abi, signer);
      const nextTokenId = await contract.nextTokenId();

      const totalTokensOfOwner = await contract.balanceOf(wallet);
      const tokensOfOwner = [];
      let i = 0;
      do {
        const owner = await contract.ownerOf(i);
        if (owner.toLowerCase() === wallet.toLowerCase()) {
          const typeId = await contract.tokenIdToEdition(i);
          const metadata = await contract.typeIDToInfo(parseInt(typeId, 16));
          tokensOfOwner.push({
            tokenId: i,
            typeId: parseInt(typeId.typeId, 16),
            metadata: {
              description: metadata[2],
              name: metadata[0],
              type: "ERC-721-EDITION",
              image: metadata[1],
              imageUrl: metadata[1],
            },
            type: "ERC-721-EDITION",
            contract: {
              contractAddress: contractAddress,
              name: await contract.name(),
              symbol: await contract.symbol(),
            },
          });
        }
        i++;
      } while (tokensOfOwner.length < totalTokensOfOwner && i < nextTokenId);

      resolve(tokensOfOwner);
    } catch (error) {
      console.error("Error getting tokens:", error);
      reject(new Error(error));
    }
  });
};

export const getTokenEditionMetadata = (contractAddress, tokenTypeId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const rpcURL = import.meta.env.VITE_RPC_URL
      const network = {
        chainId: parseInt(import.meta.env.VITE_CHAIN_ID),
      }
      const provider = new providers.JsonRpcProvider(rpcURL, network);

      const contract = new Contract(contractAddress, abi, provider);

      const transaction = await contract.typeIDToInfo(tokenTypeId);
      resolve(transaction);
    } catch (error) {
      console.error("Check getTokenEditionMetadata failed:", error);
      reject(new Error(error));
    }
  });
}
