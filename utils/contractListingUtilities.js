import { providers, Contract } from "ethers";
import wc from "@/api/platforms/walletConnect/setup.js";
import { abi as contractDeployerABI } from "@/data/abi/ERC721Deployer";
import { abi as erc721ABI } from "@/data/abi/HamERC721";
import { metadataNormalizer } from "@/utils/normalizers/metadataNormalizer";
import {
  getTokensForWallet as getEditionTokensForWallet,
  nextTokenTypeId,
} from "./erc721EditionUtils";
import { getContractType } from "./contractUtilities";
import axios from "axios";

const ERC721_CONTRACT_DEPLOYER = import.meta.env.VITE_ERC721_CONTRACT_DEPLOYER;
const ERC721_EDITION_CONTRACT_DEPLOYER = import.meta.env
  .VITE_ERC721_EDITION_CONTRACT_DEPLOYER;
const BLOCK_EXPLORER_URL = import.meta.env.VITE_BLOCK_EXPLORER_URL;
const rpcURL = import.meta.env.VITE_RPC_URL;
const ERC721_CONTRACT_IMPLEMENTATION = import.meta.env
  .VITE_ERC721_CONTRACT_IMPLEMENTATION;
const ERC721_EDITION_CONTRACT_IMPLEMENTATION = import.meta.env
  .VITE_ERC721_EDITION_CONTRACT_IMPLEMENTATION;
const network = {
  chainId: parseInt(import.meta.env.VITE_CHAIN_ID),
};
const provider = new providers.JsonRpcProvider(rpcURL, network);

export const hamERC721ListOfContracts = (address) => {
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

      const numberOfContractsForCreator =
        await contract.getNumberOfContractsForCreator(address);
      const creatorContracts = [];
      for (let index = 0; index < numberOfContractsForCreator; index++) {
        const contractAddress = await contract.getCreatorContractAtIndex(
          address,
          index
        );
        const { name, symbol } = await getContractNameAndSymbol(
          contractAddress,
          signer
        );
        creatorContracts.push({ contractAddress, name, symbol });
      }

      resolve(creatorContracts);
    } catch (error) {
      console.error("Querying failed:", error);
      reject(new Error(error));
    }
  });
};

export const hamERC721EditionListOfContracts = (address) => {
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
      const numberOfContractsForCreator =
        await contract.getNumberOfContractsForCreator(address);
      const creatorContracts = [];
      for (let index = 0; index < numberOfContractsForCreator; index++) {
        const contractAddress = await contract.getCreatorContractAtIndex(
          address,
          index
        );
        const { name, symbol } = await getContractNameAndSymbol(
          contractAddress,
          signer
        );
        creatorContracts.push({ contractAddress, name, symbol });
      }

      resolve(creatorContracts);
    } catch (error) {
      console.error("Querying failed:", error);
      reject(new Error(error));
    }
  });
};

const getContractNameAndSymbol = (address, signer) => {
  try {
    return new Promise(async (resolve, reject) => {
      const contract = new Contract(address, erc721ABI, signer);
      const name = await contract.name();
      const symbol = await contract.symbol();

      resolve({ name, symbol });
    });
  } catch (error) {
    reject(error);
  }
};

export const listERC721ByOwner = (wallet, contractAddress) => {
  return new Promise(async (resolve, reject) => {
    try {
      const web3Provider = wc.modal.getWalletProvider();
      const provider = new providers.Web3Provider(web3Provider);
      const signer = provider.getSigner();
      const contract = new Contract(contractAddress, erc721ABI, signer);

      const numberOfTokens = await contract.balanceOf(wallet);
      const tokens = [];
      for (let i = 0; i < numberOfTokens; i++) {
        const token = await contract.tokenOfOwnerByIndex(wallet, i);
        const uri = await contract.tokenURI(token);
        tokens.push({
          tokenId: parseInt(token, 16),
          uri,
          type: "ERC-721",
          contract: contractAddress,
        });
      }
      resolve(tokens);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const getContractInfo = (address) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contract = new Contract(address, erc721ABI, provider);
      const name = await contract.name();
      const symbol = await contract.symbol();
      const owner = await contract.owner();

      resolve({ name, symbol, owner });
    } catch (error) {
      reject(error);
    }
  });
};

export const listClaimPages = (address) => {
  return new Promise(async (resolve, reject) => {
    try {
      const erc721EditionContracts = await hamERC721EditionListOfContracts(
        address
      );
      const numberOfContracts = erc721EditionContracts.length;
      const pages = [];
      for (let index = 0; index < numberOfContracts; index++) {
        const contract = erc721EditionContracts[index];
        const contractAddress = contract.contractAddress;
        const numberOfTokenTypeIds = await nextTokenTypeId(contractAddress);
        pages.push({
          contractAddress,
          tokenTypes: Array.apply(
            null,
            Array(numberOfTokenTypeIds.toNumber())
          ).map(function (x, i) {
            return i;
          }),
        });
      }
      const claimPages = [];
      pages.forEach((page) =>
        page.tokenTypes.forEach((t) =>
          claimPages.push({
            url: `${page.contractAddress}-${t}`,
            c: page.contractAddress,
            tokenId: t,
          })
        )
      );
      const numberOfPages = claimPages.length;
      for (let index = 0; index < numberOfPages; index++) {
        const page = claimPages[index];
        const metadata = await getTokenEditionMetadata(page.c, page.tokenId);
        claimPages[index].type = "CLAIM PAGE";
        claimPages[index].metadata = {
          description: metadata[2],
          name: metadata[0],
          type: "ERC-721-EDITION",
          image: metadata[1],
          imageUrl: metadata[1],
        };
        claimPages[index].contract = {
          contractAddress: page.c,
        };
      }
      resolve(claimPages);
    } catch (error) {
      reject(error);
    }
  });
};

export const listNfts = (address) => {
  return new Promise(async (resolve, reject) => {
    try {
      const getNftsUrl = `${BLOCK_EXPLORER_URL}/api/v2/addresses/${address}/nft?type=ERC-721%2CERC-404%2CERC-1155`;

      const request = await axios.get(getNftsUrl);
      const tokens = request.data.items;

      const filteredTokens = [];

      const contracts = new Map();

      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i].token;
        if (!contracts.has(token.address)) {
          const contractType = await getContractType(token.address);
          contracts.set(token.address, contractType);

          if (contractType === "ERC-721") {
            const nfts = await listERC721ByOwner(address, token.address);
            for (let j = 0; j < nfts.length; j++) {
              const nft = nfts[j];
              const metadataRequest = await fetch(nft.uri)
              const metadata = await metadataRequest.json();
              filteredTokens.push({
                ...nft,
                contract: { contractAddress: token.address },
                metadata: metadataNormalizer(metadata),
              });
            };
          }
          if (contractType === "ERC-721-EDITION") {
            const nfts = await getEditionTokensForWallet(
              address,
              token.address
            );
            nfts.forEach((nft) => filteredTokens.push(nft));
          }
        }
      }
      resolve(filteredTokens);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};
