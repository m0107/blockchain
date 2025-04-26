// scripts/deploy-link.js
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const Link = await hre.ethers.getContractFactory("LinkToken");
  const link = await Link.deploy();
  await link.deployed();
  console.log("✅ Mock LINK deployed to:", link.address);
}

main()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });