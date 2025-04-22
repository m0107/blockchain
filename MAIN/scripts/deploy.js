// scripts/deploy.js
const hre = require("hardhat");
const fs  = require("fs");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with", deployer.address);

  // 1️⃣ Deploy RBACManager
  const RBAC       = await hre.ethers.getContractFactory("RBACManager");
  const rbac       = await RBAC.deploy(deployer.address);
  await rbac.deployed();
  console.log("✅ RBACManager at", rbac.address);

  // 2️⃣ Deploy UserManagement
  const UserMgmt   = await hre.ethers.getContractFactory("UserManagement");
  const userMgmt   = await UserMgmt.deploy(rbac.address);
  await userMgmt.deployed();
  console.log("✅ UserManagement at", userMgmt.address);

  // 3️⃣ Write ABIs + addresses into /abis
  const artifacts = [
    { name: "RBACManager", contract: rbac },
    { name: "UserManagement", contract: userMgmt }
  ];
  for (const { name, contract } of artifacts) {
    const artifact = await hre.artifacts.readArtifact(name);
    artifact.deployedAddress = contract.address;
    fs.writeFileSync(
      `./abis/${name}.json`,
      JSON.stringify(artifact, null, 2)
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });