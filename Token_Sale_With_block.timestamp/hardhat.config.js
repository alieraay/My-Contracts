// require("hardhat-deploy");
// require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY_GOERLI = process.env.ETHERSCAN_API_KEY_GOERLI;

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      blockConfirmations: 1,
    },
    localhost: {
      chainId: 31337,
    },
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/Xyz_PGOMv-qdFCasQ-2RZt3JzVTaVk2W",
      accounts: ["01a800d5e14db0e4fa7d232fc6fae6aa918f68c0937ef928049542558469ce58"],
      chainId: 5,
      blockConfirmations: 6,
    },
  },
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY_GOERLI,
  },
  mocha: {
    timeout: 400000, // 400 seconds
  },
};

