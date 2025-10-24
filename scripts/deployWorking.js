const hre = require("hardhat");

async function main() {
  console.log("Starting WorkingVoting deployment...");
  console.log("Network:", hre.network.name);

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const WorkingVoting = await hre.ethers.getContractFactory("WorkingVoting");
  console.log("Deploying WorkingVoting contract...");

  const workingVoting = await WorkingVoting.deploy();
  await workingVoting.deployed();
  console.log("WorkingVoting deployed to:", workingVoting.address);
  
  console.log("\n💾 Add this to your .env file:");
  console.log(`WORKING_VOTING_ADDRESS=${workingVoting.address}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
