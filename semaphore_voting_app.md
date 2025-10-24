// Cursor project setup for a minimal anonymous voting dApp using Semaphore

// =========================
// 1. Project Initialization
// =========================
// Create folder and initialize npm project
// mkdir lemocracy && cd lemocracy
// npm init -y
// npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers
// npm install @semaphore-protocol/cli @semaphore-protocol/contracts @semaphore-protocol/protocol @semaphore-protocol/group @semaphore-protocol/identity @semaphore-protocol/proof

// =========================
// 2. Hardhat Configuration
// =========================
// hardhat.config.js

require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: process.env.RPC_URL || "https://rpc.sepolia.org",
      accounts: [process.env.PRIVATE_KEY].filter(Boolean),
    },
  },
};

// =========================
// 3. Voting Contract
// =========================
// contracts/Voting.sol

/*
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@semaphore-protocol/contracts/Semaphore.sol";
import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";

contract Voting {
    ISemaphore public semaphore;
    mapping(bytes32 => bool) public nullifierUsed;

    event VoteReceived(uint256 indexed proposalId, bytes32 nullifierHash, string signal);

    constructor(address _semaphoreAddress) {
        semaphore = ISemaphore(_semaphoreAddress);
    }

    function castVote(
        uint256[8] calldata proof,
        uint256 root,
        bytes32 signal,
        bytes32 nullifierHash,
        uint256 externalNullifier
    ) external {
        require(!nullifierUsed[nullifierHash], "Double vote");
        semaphore.verifyProof(proof, root, signal, nullifierHash, externalNullifier, address(this));
        nullifierUsed[nullifierHash] = true;
        emit VoteReceived(externalNullifier, nullifierHash, string(abi.encodePacked(signal)));
    }
}
*/

// =========================
// 4. Deployment Script
// =========================
// scripts/deploy.js

const hre = require("hardhat");

async function main() {
  const SEMAPHORE_ADDRESS = process.env.SEMAPHORE_ADDRESS || "0x0000000000000000000000000000000000000000";
  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy(SEMAPHORE_ADDRESS);
  await voting.deployed();
  console.log("Voting deployed to:", voting.address);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

// =========================
// 5. Vote Script
// =========================
// scripts/vote.js

const { Identity } = require("@semaphore-protocol/identity");
const { buildMerkleTree } = require("@semaphore-protocol/group");
const ethers = require("ethers");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const votingAddress = process.env.VOTING_ADDRESS;
  const voting = new ethers.Contract(
    votingAddress,
    [
      "function castVote(uint256[8], uint256, bytes32, bytes32, uint256) external",
    ],
    wallet
  );

  const identity = new Identity();
  const identityCommitment = identity.generateCommitment();
  console.log("Identity commitment:", identityCommitment.toString());

  const members = [identityCommitment.toString()];
  const tree = buildMerkleTree(members, { depth: 20 });
  const root = tree.root;

  const proposalId = 1;
  const signal = "yes";
  const externalNullifier = proposalId;

  // Generate proof (API depends on semaphore version)
  // Replace with actual proof generation method from @semaphore-protocol/proof
  const proof = Array(8).fill(0); // placeholder
  const nullifierHash = ethers.utils.keccak256(Buffer.from("dummy-nullifier"));

  const tx = await voting.castVote(
    proof,
    BigInt(root),
    ethers.utils.formatBytes32String(signal),
    nullifierHash,
    externalNullifier,
    { gasLimit: 1_000_000 }
  );

  console.log("Vote tx:", tx.hash);
  await tx.wait();
  console.log("Vote submitted ✅");
}

main().catch(console.error);

// =========================
// 6. Usage
// =========================
// export RPC_URL="https://rpc.sepolia.org"
// export PRIVATE_KEY="0xYOUR_KEY"
// export SEMAPHORE_ADDRESS="0xSEMAPHORE_DEPLOYED_ADDR"
// npx hardhat compile
// npx hardhat run scripts/deploy.js --network sepolia
// export VOTING_ADDRESS="0xYOUR_DEPLOYED_ADDRESS"
// node scripts/vote.js
