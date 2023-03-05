const { getNamedAccounts, deployments, network } = require("hardhat");
const { developmentChains} = require("../helper-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const ourToken = await deploy("GameToken", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  log(`ourToken deployed at ${ourToken.address}`);

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY_GOERLI
  ) {
    await verify(ourToken.address, []);
  }
};

module.exports.tags = ["all", "token"];