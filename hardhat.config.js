require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: "0.8.23",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    sepolia: {
      url: process.env.RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/demo",
      accounts: [process.env.PRIVATE_KEY].filter(Boolean),
    },
  },
};
