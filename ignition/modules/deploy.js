// scripts/deploy.js
const { ethers } = require("hardhat");
const { uploadAllMetadata } = require("./uploadMetadata");
const { createMerkleTree, getMerkleProof } = require("./merkleTree");

async function main() {
  // Deploy the contract
  const VehicleToken = await ethers.getContractFactory("VehicleToken");
  console.log("Deploying VehicleToken...");
  const vehicleToken = await VehicleToken.deploy();
  await vehicleToken.deployed();
  console.log(`VehicleToken deployed to: ${vehicleToken.address}`);

  // Upload metadata and create tokens
  console.log("Uploading metadata and creating tokens...");
  const metadataResults = await uploadAllMetadata();

  // Get the signer
  const [signer] = await ethers.getSigners();

  // Create Merkle tree
  const vehicles = metadataResults.map(r => ({
    vin: r.metadata.vin,
    metadataCID: r.ipfsHash
  }));
  
  // Generate Merkle tree
  const merkleTree = createMerkleTree(vehicles);
  const merkleRoot = merkleTree.getRoot().toString('hex');

  // Set Merkle root in the contract
  await vehicleToken.setMerkleRoot(`0x${merkleRoot}`);
  console.log(`Merkle root set to: 0x${merkleRoot}`);

  // Create tokens and verify using Merkle proof
  for (const vehicle of vehicles) {
    const proof = getMerkleProof(merkleTree, vehicle);
    const isValid = await vehicleToken.verifyVehicle(vehicle.vin, vehicle.metadataCID, proof);
    
    if (isValid) {
      // Create message hash
      const nextTokenId = await vehicleToken.nextTokenId();
      const messageHash = ethers.utils.solidityKeccak256(
        ["address", "string", "uint256"],
        [await signer.getAddress(), vehicle.metadataCID, nextTokenId]
      );

      // Sign the message
      const signature = await signer.signMessage(ethers.utils.arrayify(messageHash));

      // Create the vehicle token
      const tx = await vehicleToken.createVehicle(vehicle.metadataCID, signature);
      await tx.wait();
      console.log(`Created token for ${vehicle.vin} with IPFS hash: ${vehicle.metadataCID}`);
    } else {
      console.log(`Vehicle verification failed for VIN: ${vehicle.vin}`);
    }
  }

  console.log("All tokens created successfully!");
}

// Handle errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
