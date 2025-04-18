// scripts/interact.js
const { ethers } = require("hardhat");

async function main() {
  // 1. fill in your deployed address
  const addr = "0xYourDeployedAddress";

  // 2. get the contract
  const userMgmt = await ethers.getContractAt("UserManagement", addr);

  // 3. prepare data & PIN hash
  const aadhaar = "1111‑2222‑3333";
  const dataJson = JSON.stringify({ name: "Bob", email: "bob@example.com" });
  const pinHash = ethers.keccak256(ethers.toUtf8Bytes("4321"));

  // 4. create or update
  console.log("Creating user…");
  const tx = await userMgmt.createUser(aadhaar, dataJson, pinHash);
  await tx.wait();    // wait for mining

  // 5. fetch and print
  const [data, storedHash] = await userMgmt.getUser(aadhaar);
  console.log("Stored data:", data);
  console.log("Stored PIN hash:", storedHash);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  });