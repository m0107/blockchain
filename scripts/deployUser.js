// scripts/deployUser.js
const { ethers } = require("hardhat");

async function main() {
  // 1️⃣ Get the factory
  const UserManagement = await ethers.getContractFactory("UserManagement");

  console.log("Deploying UserManagement contract...");

  // 2️⃣ Deploy (no constructor args)
  const userContract = await UserManagement.deploy();
console.log(userContract, "userContract");
  // 3️⃣ Wait for it to be mined
  await userContract.waitForDeployment();
    console.log(userContract, "userContract after waitForDeployment");
  // In ethers v6 the deployed address lives in .target
  console.log("✅ UserManagement deployed to:", userContract.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error deploying UserManagement contract:", error);
    process.exit(1);
  });