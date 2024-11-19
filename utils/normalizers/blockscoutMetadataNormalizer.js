export const editionNormalizer = (collection, token) => {
  return {
    tokenId: token.id,
    typeId: token.attributes
      ? token.attributes[0].value
      : token.metadata.attributes[0].value,
    metadata: {
      description: token.metadata.description,
      name: token.metadata.name,
      type: "ERC 721 EDITION",
      image: token.metadata.image,
      imageUrl: token.metadata.image,
    },
    type: "ERC 721 EDITION",
    contract: {
      contractAddress: collection.token.address,
      name: collection.token.name,
      symbol: collection.token.symbol,
    },
  };
};
