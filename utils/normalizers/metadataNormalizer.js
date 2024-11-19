import { removeUndefinedPropertiesFromObject } from "./removeUndefinedPropertiesFromObject";
export const metadataNormalizer = (data) => {
  return removeUndefinedPropertiesFromObject({
    createdBy: data.created_by,
    description: data.description,
    name: data.title,
    attributes: data.attributes,
    imageDetails: data.image_details,
    image: data.image,
    imageUrl: data.image_url,
    type: 'ERC 721' // TODO: fix this when we include the ERC-1155
  });
};
