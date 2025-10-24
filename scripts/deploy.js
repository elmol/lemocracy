const hre = require("hardhat");

async function main() {
  console.log("Starting deployment...");
  console.log("Network:", hre.network.name);
  
  const SEMAPHORE_ADDRESS = process.env.SEMAPHORE_ADDRESS || "0x0000000000000000000000000000000000000000";
  console.log("Semaphore address:", SEMAPHORE_ADDRESS);
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());
  
  const Voting = await hre.ethers.getContractFactory("Voting");
  console.log("Deploying Voting contract...");
  
  const voting = await Voting.deploy(SEMAPHORE_ADDRESS);
  await voting.deployed();
  console.log("Voting deployed to:", voting.address);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
