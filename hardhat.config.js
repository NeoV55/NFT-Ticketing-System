require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.20", // Use the Solidity version you need
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    baseTestnet: {
      url: "https://base-sepolia.blockpi.network/v1/rpc/public", // Ensure this is set in your .env
      accounts: [process.env.PRIVATE_KEY], // Ensure you have a valid private key
    },
  },
};
