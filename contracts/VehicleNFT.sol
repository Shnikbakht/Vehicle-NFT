// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract VehicleToken is ReentrancyGuard {
        bytes32 public merkleRoot;

    function setMerkleRoot(bytes32 _merkleRoot) external onlyManufacturer {
        merkleRoot = _merkleRoot;
    }

    function verifyVehicle(string memory _vin, string memory _metadataCID, bytes32[] memory _proof) public view returns (bool) {
        bytes32 leaf = keccak256(abi.encodePacked(_vin, _metadataCID));
        return MerkleProof.verify(_proof, merkleRoot, leaf);
    }


    struct Vehicle {
        address manufacturer;
        string vin;
        uint256 tokenId;
        address owner;
        string metadataCID; // IPFS CID for the metadata
    }

    mapping(uint256 => Vehicle) public vehicles;
    mapping(address => bool) public manufacturers;
    mapping(string => bool) public vinUsed;

    uint256 public nextTokenId = 1;

    event VehicleCreated(uint256 indexed tokenId, address indexed manufacturer, string vin, string metadataCID);
    event VehicleTransferred(uint256 indexed tokenId, address indexed from, address indexed to);

    constructor() {
        manufacturers[msg.sender] = true;
    }

    modifier onlyManufacturer() {
        require(manufacturers[msg.sender], "Not a manufacturer");
        _;
    }

    function addManufacturer(address _manufacturer) external onlyManufacturer {
        manufacturers[_manufacturer] = true;
    }

    function createVehicle(string calldata _metadataCID, bytes calldata _signature) external onlyManufacturer nonReentrant {
        bytes32 messageHash = keccak256(abi.encodePacked(msg.sender, _metadataCID, nextTokenId));
        bytes32 ethSignedMessageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));

        require(SignatureChecker.isValidSignatureNow(msg.sender, ethSignedMessageHash, _signature), "Invalid signature");

        // Extract VIN from metadata (assuming it's the first 17 characters of the CID for simplicity)
        string memory vin = substring(_metadataCID, 0, 17);
        require(!vinUsed[vin], "VIN already used");

        vehicles[nextTokenId] = Vehicle({
            manufacturer: msg.sender,
            vin: vin,
            tokenId: nextTokenId,
            owner: msg.sender,
            metadataCID: _metadataCID
        });

        vinUsed[vin] = true;
        emit VehicleCreated(nextTokenId, msg.sender, vin, _metadataCID);
        nextTokenId++;
    }

    function transferVehicle(uint256 _tokenId, address _to, bytes calldata _signature) external nonReentrant {
        Vehicle storage vehicle = vehicles[_tokenId];
        require(vehicle.owner == msg.sender, "Not the vehicle owner");

        bytes32 messageHash = keccak256(abi.encodePacked(msg.sender, _to, _tokenId));
        bytes32 ethSignedMessageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));

        require(SignatureChecker.isValidSignatureNow(msg.sender, ethSignedMessageHash, _signature), "Invalid signature");

        vehicle.owner = _to;
        emit VehicleTransferred(_tokenId, msg.sender, _to);
    }

    function getVehicle(uint256 _tokenId) external view returns (Vehicle memory) {
        return vehicles[_tokenId];
    }
    

    // Helper function to extract VIN from metadata CID
    function substring(string memory str, uint startIndex, uint length) internal pure returns (string memory) {
        bytes memory strBytes = bytes(str);
        bytes memory result = new bytes(length);
        for(uint i = 0; i < length; i++) {
            result[i] = strBytes[i + startIndex];
        }
        return string(result);
    }
}