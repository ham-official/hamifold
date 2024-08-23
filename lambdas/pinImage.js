require("dotenv").config();
const { File, FormData } = require("formdata-node");
const busboy = require("busboy");
const GATEWAY_URL = process.env.PINATA_IPFS_GATEWAY;
const PINATA_AUTH_TOKEN = process.env.PINATA_AUTH_TOKEN;
const crypto = require("crypto-js");

/************************************************************************************************************************
When developing this code, several issues were encountered. Here’s a brief explanation of the solutions:

  •	Busboy: The image is handled as a buffer because passing it as a string made it impossible to reconstruct the image 
  correctly for pinning to Pinata/IPFS.

  •	Crypto: A SHA-256 hash of the image was generated to attach as a property of the image for added integrity and 
  identification.
************************************************************************************************************************/

const parseMultipartForm = (event) => {
  return new Promise((resolve) => {
    const fields = { image: [] };
    const incomingData = {
      createdBy: null,
      name: null,
      attributes: null,
      imgDetails: null,
      description: null,
      title: null,
    };
    const bb = busboy({ headers: event.headers });

    bb.on("file", (name, file, info) => {
      const { filename, mimeType } = info;

      file.on("data", (data) => {
        if (!fields[name]) fields[name] = [];

        fields[name].push({
          filename,
          type: mimeType,
          content: data,
        });
      });
    });

    bb.on("field", (name, val) => {
      if (name in incomingData) {
        incomingData[name] =
          name === "attributes" || name === "imgDetails"
            ? JSON.parse(val)
            : val;
      }
    });

    bb.on("close", () => {
      resolve({ ...fields, ...incomingData });
    });

    bb.end(Buffer.from(event.body, "base64"));
  });
};

async function uploadBuffer(buffer, name) {
  try {
    const blob = new Blob([buffer]);
    const file = new File([blob], name);
    const data = new FormData();
    data.append("file", file);

    const upload = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + PINATA_AUTH_TOKEN,
        },
        body: data,
      }
    ).catch((err) => console.error(err));

    const uploadRes = await upload.json();
    return uploadRes;
  } catch (error) {
    console.log(error);
  }
}

exports.handler = async function (event, context) {
  try {
    const fields = await parseMultipartForm(event);
    if (!fields) {
      throw new Error("Unable to parse image");
    }

    const image = fields.image[0];

    const pinataImg = await uploadBuffer(image.content, fields.title);
    const imgUrl = `${GATEWAY_URL}/ipfs/${pinataImg.IpfsHash}`;
    const hash = crypto.SHA256(image.content).toString(crypto.enc.Hex);
    return {
      statusCode: 200,
      body: JSON.stringify({
        imgUrl,
        sha256Hash: hash,
        ...pinataImg,
      }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      body: error.toString(),
    };
  }
};
