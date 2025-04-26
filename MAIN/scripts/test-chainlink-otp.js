// scripts/test-chainlink-otp.js
const path = require('path');
const fs   = require('fs');

// Explicitly load .env from project root
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Debug: ensure env vars are loaded
console.log('Loaded ENV:', {
  RPC_URL: process.env.RPC_URL,
  PRIVATE_KEY: process.env.PRIVATE_KEY ? '[REDACTED]' : undefined,
  LINK_TOKEN_ADDRESS: process.env.LINK_TOKEN_ADDRESS,
  CHAINLINK_FEE: process.env.CHAINLINK_FEE
});

const SDK = require('../src/blockchainSDK');

async function run() {
  // Initialize SDK
  const sdk = new SDK(process.env.RPC_URL, process.env.PRIVATE_KEY);
  console.log('Using SDK account:', sdk.account.address);

  // 0️⃣ Fund the OTP consumer contract with LINK
  const consumerArt  = require('../abis/AadhaarOTPConsumer.json');
  const consumerAddr = consumerArt.deployedAddress;
  const linkAddress  = process.env.LINK_TOKEN_ADDRESS;
  const fee          = sdk.web3.utils.toBN(process.env.CHAINLINK_FEE);

  // Minimal ERC20 ABI for balanceOf() + transfer()
  const erc20Abi = [
    {
      constant: true,
      inputs: [{ name: 'account', type: 'address' }],
      name: 'balanceOf',
      outputs: [{ name: '', type: 'uint256' }],
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { name: 'to',    type: 'address' },
        { name: 'value', type: 'uint256' }
      ],
      name: 'transfer',
      outputs: [{ name: '', type: 'bool' }],
      type: 'function',
    }
  ];

  console.log(`\nDEBUG: LINK token address = ${linkAddress}`);
  console.log(`DEBUG: Consumer contract address = ${consumerAddr}`);

  const linkCtr = new sdk.web3.eth.Contract(erc20Abi, linkAddress);

  // Check balance before funding
  const balanceBefore = await linkCtr.methods.balanceOf(consumerAddr).call();
  console.log('Balance before funding:', balanceBefore);

  console.log(`\nFunding consumer at ${consumerAddr} with ${fee.toString()} LINK…`);
  const receipt = await linkCtr.methods
    .transfer(consumerAddr, fee.toString())
    .send({ from: sdk.account.address, gas: 200_000 });
  console.log('Funding tx status:', receipt.status);

  // Check balance after funding
  const balanceAfter = await linkCtr.methods.balanceOf(consumerAddr).call();
  console.log('Balance after funding:', balanceAfter, '\n');


  console.log(fee.toString());
  if (balanceAfter !== fee.toString()) {
    console.error('❌ Funding mismatch! Consumer did not receive correct amount of LINK.');
    process.exit(1);
  }
  console.log('✅ Consumer funded with correct LINK amount.\n');

  // 1️⃣ Request OTP on-chain
  console.log('▶️  Requesting OTP...');
  const reqId = await sdk.requestOtpOnChain('1234-5678-9012');
  console.log('Requested OTP, requestId =', reqId, '\n');

  // 2️⃣ Listen for the OTP fulfillment
  const consumer = new sdk.web3.eth.Contract(
    consumerArt.abi,
    consumerAddr
  );
  console.log('Waiting for OTP response…');

  consumer.events
    .LogReceiveOTP({ filter: { requestId: reqId } })
    .on('data', evt => {
      console.log('✅ Received OTP on-chain (bytes32):', evt.returnValues.otp);
      process.exit(0);
    })
    .on('error', err => {
      console.error('Event error:', err);
      process.exit(1);
    });
}

run().catch(err => {
  console.error('Script error:', err);
  process.exit(1);
});