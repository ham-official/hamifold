import { providers, Contract } from "ethers";
import { abi as contractDeployerABI } from "@/data/abi/ERC721Deployer";
import { abi as erc721ABI } from "@/data/abi/HamERC721";
import { abi as erc721EditionABI } from "@/data/abi/HamERC721Edition";
import { nextTokenTypeId } from "./erc721EditionUtils";

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
const rpcProvider = new providers.JsonRpcProvider(rpcURL, network);

const editionDeployerContract = new Contract(
  ERC721_EDITION_CONTRACT_DEPLOYER,
  contractDeployerABI,
  rpcProvider
);
const standardDeployerContract = new Contract(
  ERC721_CONTRACT_DEPLOYER,
  contractDeployerABI,
  rpcProvider
);

export const getNumberOfEditionContractsForCreator = (wallet) => {
  return editionDeployerContract.getNumberOfContractsForCreator(wallet);
};

export const getEditionCreatorContractAtIndex = (wallet, index) => {
  return editionDeployerContract.getCreatorContractAtIndex(wallet, index);
};

export const getEditionContractNameAndSymbol = (address) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contract = new Contract(address, erc721EditionABI, rpcProvider);
      const name = await contract.name();
      const symbol = await contract.symbol();

      resolve({ name, symbol });
    } catch (error) {
      reject(error);
    }
  });
};

export const getNumberOfStandardContractsForCreator = (wallet) => {
  return standardDeployerContract.getNumberOfContractsForCreator(wallet);
};

export const getStandardCreatorContractAtIndex = (wallet, index) => {
  return standardDeployerContract.getCreatorContractAtIndex(wallet, index);
};

export const getStandardContractNameAndSymbol = (address) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contract = new Contract(address, erc721ABI, rpcProvider);
      const name = await contract.name();
      const symbol = await contract.symbol();

      resolve({ name, symbol });
    } catch (error) {
      reject(error);
    }
  });
};

export const getAllNftsForWallet = (wallet) => {
  return new Promise(async (resolve, reject) => {
    try {
      const getNftsUrl = `${BLOCK_EXPLORER_URL}/api/v2/addresses/${wallet}/nft/collections?type=ERC-721`;
      const request = await fetch(getNftsUrl);
      const jsonPromise = await request.json();
      resolve(jsonPromise.items);
    } catch (error) {
      reject(error);
    }
  });
};

export const getContractType = (address) => {
  return new Promise(async (resolve, reject) => {
    const getContractUrl = `${BLOCK_EXPLORER_URL}/api/v2/smart-contracts/${address}`;
    const request = await fetch(getContractUrl).catch((err) => {
      reject(err);
    });
    const data = await request.json();
    const implementation = data.verified_twin_address_hash;

    switch (implementation) {
      case ERC721_CONTRACT_IMPLEMENTATION:
        resolve("ERC-721");
        break;
      case ERC721_EDITION_CONTRACT_IMPLEMENTATION:
        resolve("ERC-721-EDITION");
        break;
      default:
        resolve(null);
        break;
    }
  });
};

export const getStandardTokenUri = (address, tokenId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contract = new Contract(address, erc721ABI, rpcProvider);
      const uri = await contract.tokenURI(tokenId);

      resolve(uri);
    } catch (error) {
      reject(error);
    }
  });
};

export const getMetadataFromTokenUri = (uri) => {
  return new Promise(async (resolve, reject) => {
    try {
      const request = await fetch(uri.replace("io//ipfs", "io/ipfs"));
      const data = await request.json();

      resolve({
        metadata: {
          description: data.description,
          name: data.title,
          type: "ERC-721",
          image: data.image_url.replace("io//ipfs", "io/ipfs"),
          imageUrl: data.image_url.replace("io//ipfs", "io/ipfs"),
        },
        type: "ERC-721",
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const getClaimPages = (contractAddress) => {
  return new Promise(async (resolve, reject) => {
    try {
      const pages = [];
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
