require("dotenv").config();
const pinataSDK = require("@pinata/sdk");
const pinata = new pinataSDK({
  pinataApiKey: process.env.PINATA_HAM_KEY,
  pinataSecretApiKey: process.env.PINATA_HAM_SECRET,
});
const GATEWAY_URL = process.env.PINATA_IPFS_GATEWAY;

exports.handler = async function (event, context) {
  return new Promise(async (resolve, reject) => {
    try {
      const { imgUrl, createdBy, attributes, imgDetails, description, title } =
        JSON.parse(event.body);

      const metadata = {
        created_by: createdBy,
        title,
        description,
        attributes: attributes,
        image_details: imgDetails,
        image: imgUrl,
        image_url: imgUrl,
      };
      const options = {
        pinataMetadata: {
          name: title,
        },
        pinataOptions: { cidVersion: 0 },
      };
      const pinataJson = await pinata.pinJSONToIPFS(metadata, options);

      const jsonUrl = `${GATEWAY_URL}/ipfs/${pinataJson.IpfsHash}`;
      resolve({
        statusCode: 200,
        body: JSON.stringify({ jsonUrl, ...pinataJson }),
      });
    } catch (error) {
      console.error("Error pinning to IPFS:", error);
      reject(error);
    }
  });
};
