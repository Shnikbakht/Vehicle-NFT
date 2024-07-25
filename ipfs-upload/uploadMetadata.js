const  create  = require('ipfs-http-client');

async function uploadMetadata(metadata) {
    const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
    const { cid } = await ipfs.add(JSON.stringify(metadata));
    console.log('CID:', cid.toString());
}

const metadata = {
    manufacturer: "Tesla",
    vin: "5YJSA1E26MF123456",
    model: "Model S",
    year: 2023
};

uploadMetadata(metadata);
