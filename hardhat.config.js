require("@nomiclabs/hardhat-ethers");
//require('@nomiclabs/hardhat-ethers');
require('dotenv').config();

module.exports = {
  solidity: '0.8.20',
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    localhost:{
      url: 'http://localhost:8545',
      accounts: [process.env.PRIVATE_KEY],
      //gasPrice: 1000000000  // 1 gwei (10^9)
    },
    ganache:{
      url: 'http://localhost:7545',
      
      accounts: [process.env.PRIVATE_KEY],
      //gasPrice: 1000000000  // 1 gwei (10^9)  
    }
  },
  sourcify: {
    enabled: true
  }, 
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY, // Your Etherscan API key
  }
};