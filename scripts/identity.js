require("dotenv").config();
const { Identity } = require("@semaphore-protocol/identity");
const ethers = require("ethers");

async function main() {
  console.log("🔐 Semaphore Identity Management\n");
  
  // Setup provider and wallet
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const privateKey = process.env.PRIVATE_KEY.startsWith('0x') 
    ? process.env.PRIVATE_KEY 
    : '0x' + process.env.PRIVATE_KEY;
  const wallet = new ethers.Wallet(privateKey, provider);
  
  console.log("👤 Ethereum Account:", wallet.address);
  console.log("💰 Balance:", ethers.utils.formatEther(await wallet.getBalance()), "ETH\n");

  // Create a consistent message for this application
  const message = "Lemocracy Voting dApp - Semaphore Identity";
  
  console.log("📝 Signing message:", message);
  
  // Sign the message with the Ethereum account
  const signature = await wallet.signMessage(message);
  console.log("✍️  Signature:", signature);
  
  // Create deterministic Semaphore identity from the signature
  const identity = new Identity(signature);
  
  console.log("\n🔑 Semaphore Identity Details:");
  console.log("   Private Key:", identity.privateKey);
  console.log("   Public Key:", identity.publicKey);
  console.log("   Commitment:", identity.commitment.toString());
  
  // Test message signing with Semaphore identity
  console.log("\n📝 Testing Semaphore message signing:");
  const testMessage = "Hello from Semaphore!";
  const semaphoreSignature = identity.signMessage(testMessage);
  console.log("   Message:", testMessage);
  console.log("   Signature:", semaphoreSignature);
  
  // Verify the signature
  const isValid = Identity.verifySignature(testMessage, semaphoreSignature, identity.publicKey);
  console.log("   Signature Valid:", isValid);
  
  // Export/Import test
  console.log("\n💾 Testing identity export/import:");
  const exportedKey = identity.export();
  console.log("   Exported Key:", exportedKey);
  
  const importedIdentity = Identity.import(exportedKey);
  console.log("   Imported Commitment:", importedIdentity.commitment.toString());
  console.log("   Import Match:", identity.commitment.toString() === importedIdentity.commitment.toString());
  
  console.log("\n✅ Identity management working correctly!");
  console.log("💡 This identity can now be used for anonymous voting");
}

main().catch(console.error);
