const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

function createMerkleTree(vehicles) {
  const leaves = vehicles.map(v => keccak256(v.vin + v.metadataCID));
  return new MerkleTree(leaves, keccak256, { sortPairs: true });
}

function getMerkleProof(tree, vehicle) {
  const leaf = keccak256(vehicle.vin + vehicle.metadataCID);
  return tree.getHexProof(leaf);
}

module.exports = { createMerkleTree, getMerkleProof };