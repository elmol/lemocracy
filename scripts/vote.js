require("dotenv").config();
const { Identity } = require("@semaphore-protocol/identity");
const { Group } = require("@semaphore-protocol/group");
const ethers = require("ethers");

async function main() {
  console.log("Starting vote process...");
  console.log("RPC URL:", process.env.RPC_URL);
  console.log("Voting Address:", process.env.VOTING_ADDRESS);
  
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  
  // Ensure private key has 0x prefix
  const privateKey = process.env.PRIVATE_KEY.startsWith('0x') 
    ? process.env.PRIVATE_KEY 
    : '0x' + process.env.PRIVATE_KEY;
    
  const wallet = new ethers.Wallet(privateKey, provider);
  console.log("Wallet address:", wallet.address);

  const votingAddress = process.env.VOTING_ADDRESS;
  const voting = new ethers.Contract(
    votingAddress,
    [
      "function castVote(uint256 groupId, tuple(uint256 merkleTreeDepth, uint256 merkleTreeRoot, uint256 nullifier, uint256 message, uint256 scope, uint256[8] points) proof) external",
    ],
    wallet
  );

  const identity = new Identity();
  const identityCommitment = identity.commitment;
  console.log("Identity commitment:", identityCommitment.toString());

  // Create a group and add the identity commitment
  const group = new Group();
  group.addMember(identityCommitment);
  const root = group.root;

  const groupId = 1;
  const signal = "yes";
  const message = ethers.utils.formatBytes32String(signal);

  // Generate proof (API depends on semaphore version)
  // Replace with actual proof generation method from @semaphore-protocol/proof
  const proof = {
    merkleTreeDepth: 20,
    merkleTreeRoot: BigInt(root),
    nullifier: BigInt(ethers.utils.keccak256(Buffer.from("dummy-nullifier"))),
    message: BigInt(message),
    scope: BigInt(ethers.utils.formatBytes32String("voting")),
    points: Array(8).fill(0) // placeholder
  };

  const tx = await voting.castVote(
    groupId,
    proof,
    { gasLimit: 1_000_000 }
  );

  console.log("Vote tx:", tx.hash);
  await tx.wait();
  console.log("Vote submitted ✅");
}

main().catch(console.error);
