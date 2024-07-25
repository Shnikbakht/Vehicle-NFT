// uploadMetadata.js
require('dotenv').config();
const axios = require('axios');

async function uploadToPinata(metadata) {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  const response = await axios.post(url, metadata, {
    headers: {
      pinata_api_key: process.env.PINATA_API_KEY,
      pinata_secret_api_key: process.env.PINATA_API_SECRET,
    },
  });
  return response.data.IpfsHash;
}

const carMetadata = [
  {
    make: 'Toyota',
    model: 'Camry',
    year: 2021,
    vin: '4T1BE46K77U123456',
    color: 'Blue',
    features: [
      'Backup Camera',
      'Bluetooth',
      'Adaptive Cruise Control',
      'Lane Departure Warning',
    ],
  },
];

async function uploadAllMetadata() {
  const results = [];
  for (const metadata of carMetadata) {
    const ipfsHash = await uploadToPinata(metadata);
    results.push({ metadata, ipfsHash });
    console.log(
      `Pinata IPFS Hash for ${metadata.make} ${metadata.model}: ${ipfsHash}`
    );
  }
  return results;
}

module.exports = {
  uploadAllMetadata,
  carMetadata,
};
