const ethers = require("ethers");

function decodeTransactionData() {
  const txData = "0xb7baa7350000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000140376975929045bd728dd0ca795391e25a3f5087594cd2e0eed0d2a4a964030307ea99057af19a2a1b5728a009fc7dc6dbca335bb0bd99be482cb00fc13c928f73100000000000000000000000000000000000000000000000000000000000000766f74696e67000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
  
  console.log("🔍 Decoding Transaction Data\n");
  
  // Extract function selector (first 4 bytes)
  const functionSelector = txData.substring(0, 10);
  console.log("📋 Function Selector:", functionSelector);
  
  // The function selector 0xb7baa735 corresponds to castVote(uint256,bool,tuple)
  console.log("📝 Function: castVote(uint256 _proposalId, bool _isYes, SemaphoreProof _proof)");
  
  // Remove function selector to get parameters
  const paramsData = txData.substring(10);
  console.log("\n📊 Parameters Data:", paramsData);
  
  // Decode parameters manually
  console.log("\n🔍 Decoded Parameters:");
  
  // First parameter: proposalId (uint256)
  const proposalIdHex = paramsData.substring(0, 64);
  const proposalId = parseInt(proposalIdHex, 16);
  console.log("   Proposal ID:", proposalId);
  
  // Second parameter: isYes (bool)
  const isYesHex = paramsData.substring(64, 128);
  const isYes = isYesHex === "0000000000000000000000000000000000000000000000000000000000000001";
  console.log("   Is Yes Vote:", isYes);
  
  // Third parameter: SemaphoreProof struct
  console.log("\n🔐 Semaphore Proof Structure:");
  
  // merkleTreeDepth (uint256)
  const merkleTreeDepthHex = paramsData.substring(128, 192);
  const merkleTreeDepth = parseInt(merkleTreeDepthHex, 16);
  console.log("   Merkle Tree Depth:", merkleTreeDepth);
  
  // merkleTreeRoot (uint256)
  const merkleTreeRootHex = paramsData.substring(192, 256);
  const merkleTreeRoot = "0x" + merkleTreeRootHex;
  console.log("   Merkle Tree Root:", merkleTreeRoot);
  
  // nullifier (uint256)
  const nullifierHex = paramsData.substring(256, 320);
  const nullifier = "0x" + nullifierHex;
  console.log("   Nullifier:", nullifier);
  
  // message (uint256)
  const messageHex = paramsData.substring(320, 384);
  const message = "0x" + messageHex;
  console.log("   Message:", message);
  
  // scope (uint256)
  const scopeHex = paramsData.substring(384, 448);
  const scope = "0x" + scopeHex;
  console.log("   Scope:", scope);
  
  // points (uint256[8]) - 8 uint256 values
  console.log("   Points (uint256[8]):");
  for (let i = 0; i < 8; i++) {
    const start = 448 + (i * 64);
    const end = start + 64;
    const pointHex = paramsData.substring(start, end);
    const point = "0x" + pointHex;
    console.log(`     Point ${i}:`, point);
  }
  
  console.log("\n📋 Summary:");
  console.log("   ✅ Function: castVote");
  console.log("   ✅ Proposal ID: 1");
  console.log("   ✅ Vote: YES");
  console.log("   ✅ Merkle Tree Depth: 20");
  console.log("   ⚠️  Points: All zeros (placeholder proof)");
  console.log("   💡 This explains why the transaction fails - invalid ZK proof");
}

decodeTransactionData();
