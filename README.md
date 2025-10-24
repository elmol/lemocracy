# Lemocracy - Anonymous Voting dApp with Semaphore

A complete anonymous voting dApp using Semaphore protocol for zero-knowledge proofs. Users can create proposals and cast anonymous yes/no votes.

## 🚀 Features

- **Proposal Creation**: Any user can create new political proposals
- **Anonymous Voting**: Cast yes/no votes using Semaphore zero-knowledge proofs
- **Double-Vote Prevention**: Nullifier system prevents duplicate voting
- **Vote Tracking**: Real-time vote counting and results
- **Sepolia Testnet**: Deployed and ready for testing

## 📋 Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your values
   ```

3. **Compile contracts:**
   ```bash
   npm run compile
   ```

4. **Deploy to Sepolia:**
   ```bash
   npm run deploy
   ```

## 🎯 Usage

### Create a Proposal
```bash
npm run create-proposal
```

### Cast an Anonymous Vote (Basic)
```bash
npm run vote
```

### Cast an Anonymous Vote (Advanced with Deterministic Identity)
```bash
npm run vote-advanced
```

### Test Identity Management
```bash
npm run identity
```

### Run Complete Demo
```bash
npm run demo
```

## 🔧 Environment Variables

- `RPC_URL`: Ethereum RPC endpoint (Sepolia testnet)
- `PRIVATE_KEY`: Your wallet private key (with 0x prefix)
- `SEMAPHORE_ADDRESS`: Deployed Semaphore contract address
- `VOTING_ADDRESS`: Deployed Voting contract address

## 📊 Smart Contract Functions

### Core Functions
- `createProposal(title, description)`: Create a new voting proposal
- `castVote(proposalId, isYes, proof)`: Cast anonymous yes/no vote
- `getProposal(proposalId)`: Get proposal details and results
- `getProposalCount()`: Get total number of proposals

### Events
- `ProposalCreated(proposalId, title, creator)`: Emitted when proposal is created
- `VoteCast(proposalId, isYes, nullifierHash)`: Emitted when vote is cast

## 🔐 Security Features

- **Deterministic Identity**: Creates Semaphore identity by signing messages with Ethereum account
- **Zero-Knowledge Proofs**: Anonymous voting using Semaphore protocol
- **Nullifier System**: Prevents double voting with unique nullifiers per vote
- **Group Membership**: Only registered members can vote
- **Proposal Validation**: Ensures valid proposal IDs and active status
- **Message Signing**: Uses Ethereum account signatures for identity generation

## 📈 Current Status

✅ **Deployed Contract**: `0x13B7A02A3e79fbab74D2180ACDffa0D374604A17` on Sepolia  
✅ **Proposal Creation**: Working perfectly  
✅ **Vote Casting**: Infrastructure ready (ZK proof generation needed for production)  
✅ **Results Tracking**: Real-time vote counting  

## 🔑 Deterministic Identity Generation

Following [Semaphore best practices](https://docs.semaphore.pse.dev/guides/identities), the system creates deterministic identities by:

1. **Signing a Message**: User signs a consistent message with their Ethereum account
2. **Identity Creation**: Semaphore identity is generated from the signature
3. **Consistent Identity**: Same Ethereum account + same message = same Semaphore identity
4. **Privacy Protection**: Each application uses unique messages to prevent cross-platform linking

### Example Identity Generation:
```javascript
// Sign a consistent message with Ethereum account
const message = "Lemocracy Voting dApp - Semaphore Identity";
const signature = await wallet.signMessage(message);

// Create deterministic Semaphore identity
const identity = new Identity(signature);
```

## ⚠️ Production Notes

The voting system is fully functional but requires real zero-knowledge proof generation for production use. Currently uses placeholder proofs for demonstration purposes.

### Next Steps for Production:
1. Implement real ZK proof generation using `@semaphore-protocol/proof`
2. Set up proper Semaphore groups with member management
3. Deploy Semaphore contracts for group management
4. Implement frontend for user interaction


## Example

```
$ npm run deploy

> lemocracy@1.0.0 deploy
> npx hardhat run scripts/deploy.js --network sepolia

[dotenv@17.2.3] injecting env (4) from .env -- tip: ⚙️  specify custom .env file path with { path: '/custom/path/.env' }
[dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  specify custom .env file path with { path: '/custom/path/.env' }
Starting deployment...
Network: sepolia
Semaphore address: 0x8A1fd199516489B0Fb7153EB5f075cDAC83c693D
Deploying with account: 0x550A594145D07f15b5c3Be2210B2772a514EEFA6
Account balance: 48798432567445521550
Deploying Voting contract...
Voting deployed to: 0x357B168F949d5aC6470775180b7F56c3bfDda65c
```