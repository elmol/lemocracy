require("dotenv").config();
const ethers = require("ethers");

async function main() {
  console.log("📝 Creating a new proposal...\n");
  
  // Setup provider and wallet
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const privateKey = process.env.PRIVATE_KEY.startsWith('0x') 
    ? process.env.PRIVATE_KEY 
    : '0x' + process.env.PRIVATE_KEY;
  const wallet = new ethers.Wallet(privateKey, provider);
  
  console.log("👤 Wallet:", wallet.address);
  console.log("💰 Balance:", ethers.utils.formatEther(await wallet.getBalance()), "ETH\n");

  // Connect to deployed contract
  const votingAddress = process.env.VOTING_ADDRESS;
  const voting = new ethers.Contract(
    votingAddress,
    [
      "function createProposal(string memory _title, string memory _description) external",
      "function getProposalCount() external view returns (uint256)",
      "function getProposal(uint256 _proposalId) external view returns (uint256, string, string, address, uint256, uint256, bool)"
    ],
    wallet
  );

  // Get current proposal count
  const currentCount = await voting.getProposalCount();
  console.log("📊 Current proposals:", currentCount.toString());

  // Create proposal
  const title = "Implement Carbon Neutrality by 2030";
  const description = "This proposal aims to make our community carbon neutral by 2030 through renewable energy adoption, electric vehicle incentives, and sustainable building practices.";
  
  console.log("📋 Proposal Title:", title);
  console.log("📄 Description:", description);
  
  const tx = await voting.createProposal(title, description);
  console.log("\n📤 Transaction hash:", tx.hash);
  
  await tx.wait();
  console.log("✅ Proposal created successfully!");

  // Get the new proposal details
  const newCount = await voting.getProposalCount();
  const proposalId = newCount.toNumber();
  
  console.log("\n📊 New Proposal Details:");
  const proposal = await voting.getProposal(proposalId);
  console.log("   ID:", proposal[0].toString());
  console.log("   Title:", proposal[1]);
  console.log("   Description:", proposal[2]);
  console.log("   Creator:", proposal[3]);
  console.log("   Yes votes:", proposal[4].toString());
  console.log("   No votes:", proposal[5].toString());
  console.log("   Active:", proposal[6]);
  
  console.log("\n🎉 Proposal creation completed!");
}

main().catch(console.error);
