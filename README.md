# Lemocracy - Anonymous Voting dApp with Semaphore

A minimal anonymous voting dApp using Semaphore protocol for zero-knowledge proofs.

## Setup

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

5. **Cast a vote:**
   ```bash
   npm run vote
   ```

## Environment Variables

- `RPC_URL`: Ethereum RPC endpoint (default: Sepolia)
- `PRIVATE_KEY`: Your wallet private key
- `SEMAPHORE_ADDRESS`: Deployed Semaphore contract address
- `VOTING_ADDRESS`: Deployed Voting contract address

## Usage

1. Deploy Semaphore contract first
2. Set `SEMAPHORE_ADDRESS` in your environment
3. Deploy the Voting contract
4. Set `VOTING_ADDRESS` in your environment
5. Run the vote script to cast an anonymous vote

## Features

- Anonymous voting using zero-knowledge proofs
- Double-vote prevention via nullifiers
- Semaphore protocol integration
- Ethereum smart contract deployment


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