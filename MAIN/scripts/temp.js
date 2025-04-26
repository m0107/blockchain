// scripts/deploy-all.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const hre = require('hardhat');
const { ethers, artifacts } = hre;

async function main() {
    console.log("mohit")
    const rawId = process.env.CHAINLINK_JOB_ID;     // e.g. "68b59c99-24e3-4d9e-b722-3ed996db9aa1"
const jobId  = ethers.utils.id(rawId);          // keccak256 hash of the UUID
console.log("Using jobId (bytes32):", jobId);
    const fee      = ethers.BigNumber.from("100000000000000000");
  const Consumer = await ethers.getContractFactory('AadhaarOTPConsumer');
  const consumer = await Consumer.deploy("0xb4B46bdAA835F8E4b4d8e208B6559cD267851051", "0x17435ccE3d1B4fA2e5f8A08eD921D57C6762A180", jobId, fee);
  await consumer.deployed();
  console.log('✅ AadhaarOTPConsumer deployed at', consumer.address);
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Deployment error:', err);
    process.exit(1);
  });
