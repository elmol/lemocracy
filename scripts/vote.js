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
      "function castVote(uint256 _proposalId, bool _isYes, tuple(uint256 merkleTreeDepth, uint256 merkleTreeRoot, uint256 nullifier, uint256 message, uint256 scope, uint256[8] points) _proof) external",
      "function getProposal(uint256 _proposalId) external view returns (uint256, string, string, address, uint256, uint256, bool)",
      "function getProposalCount() external view returns (uint256)"
    ],
    wallet
  );

  // Create deterministic identity by signing a consistent message with Ethereum account
  const messageToSign = "Lemocracy Voting dApp - Semaphore Identity";
  console.log("📝 Signing message for identity:", messageToSign);
  
  // Sign the message with the wallet
  const signature = await wallet.signMessage(messageToSign);
  console.log("✍️  Signature:", signature);
  
  // Create deterministic identity from the signature
  const identity = new Identity(signature);
  const identityCommitment = identity.commitment;
  console.log("👤 Identity commitment:", identityCommitment.toString());

  // Create a group and add the identity commitment
  const group = new Group();
  group.addMember(identityCommitment);
  const root = group.root;

  // Get proposal count and use the first proposal
  const proposalCount = await voting.getProposalCount();
  if (proposalCount.toNumber() === 0) {
    console.log("❌ No proposals found. Please create a proposal first.");
    return;
  }
  
  const proposalId = 7; // Vote on the first proposal
  const isYes = true; // Vote "yes"
  
  console.log("🗳️  Voting on proposal ID:", proposalId);
  console.log("📊 Vote choice:", isYes ? "YES" : "NO");
  
  // Create a unique nullifier for this specific vote
  const nullifier = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ["uint256", "uint256", "address"],
      [proposalId, identityCommitment, wallet.address]
    )
  );
  
  const message = ethers.utils.formatBytes32String(isYes ? "1" : "0");

  // Generate proof (API depends on semaphore version)
  // Replace with actual proof generation method from @semaphore-protocol/proof
  const proof = {
    merkleTreeDepth: 20,
    merkleTreeRoot: BigInt(root),
    nullifier: BigInt(nullifier),
    message: BigInt(message),
    scope: BigInt(ethers.utils.formatBytes32String("voting")),
    points: Array(8).fill(0) // placeholder
  };

  const tx = await voting.castVote(
    proposalId,
    isYes,
    proof,
    { gasLimit: 1_000_000 }
  );

  console.log("Vote tx:", tx.hash);
  await tx.wait();
  console.log("Vote submitted ✅");
}

main().catch(console.error);
