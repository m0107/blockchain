// scripts/deploy-all.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const hre = require('hardhat');
const { ethers, artifacts } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying with deployer:', deployer.address);

  // Ensure abis directory exists
  const abisDir = path.resolve(__dirname, '../abis');
  if (!fs.existsSync(abisDir)) fs.mkdirSync(abisDir, { recursive: true });

  // 1️⃣ Deploy Mock LINK token
  const LinkToken = await ethers.getContractFactory('LinkToken');
  const link = await LinkToken.deploy();
  await link.deployed();
  console.log('✅ LinkToken deployed at', link.address);

  // 2️⃣ Deploy Chainlink Operator contract
  const Operator = await ethers.getContractFactory('ChainlinkOperator');
  const operator = await Operator.deploy(link.address, deployer.address);
  await operator.deployed();
  console.log('✅ Operator deployed at', operator.address);

  // Transfer ownership to Chainlink node operator EOA, if provided
  const operatorEOA = process.env.CHAINLINK_OPERATOR_ADDRESS;
  if (operatorEOA && operatorEOA.toLowerCase() !== deployer.address.toLowerCase()) {
    await operator.transferOwnership(operatorEOA);
    console.log('✅ Oracle ownership transferred to', operatorEOA);
  }

  // 3️⃣ Deploy RBACManager
  const RBAC = await ethers.getContractFactory('RBACManager');
  const rbac = await RBAC.deploy(deployer.address);
  await rbac.deployed();
  console.log('✅ RBACManager deployed at', rbac.address);

  // 4️⃣ Deploy AadhaarOTPConsumer
  const rawId = process.env.CHAINLINK_JOB_ID;     // e.g. "68b59c99-24e3-4d9e-b722-3ed996db9aa1"
  const jobId  = ethers.utils.id(rawId);          // keccak256 hash of the UUID
  console.log("Using jobId (bytes32):", jobId);
  const fee      = ethers.BigNumber.from(process.env.CHAINLINK_FEE);
  const Consumer = await ethers.getContractFactory('AadhaarOTPConsumer');
  const consumer = await Consumer.deploy(link.address, operator.address, jobId, fee);
  await consumer.deployed();
  console.log('✅ AadhaarOTPConsumer deployed at', consumer.address);

  // 5️⃣ Deploy UserManagement
  const UserMgmt = await ethers.getContractFactory('UserManagement');
  const userMgmt = await UserMgmt.deploy(rbac.address, consumer.address);
  await userMgmt.deployed();
  console.log('✅ UserManagement deployed at', userMgmt.address);

  // 6️⃣ Fund the consumer contract with LINK
  const linkCtr = LinkToken.attach(link.address);
  await linkCtr.connect(deployer).transfer(consumer.address, fee);
  console.log(`✅ Funded consumer at ${consumer.address} with ${fee.toString()} LINK`);

  // 7️⃣ Write ABIs + addresses to abis/
  const deployments = [
    { name: 'LinkToken',           instance: link },
    { name: 'Operator',            instance: operator },
    { name: 'RBACManager',         instance: rbac },
    { name: 'AadhaarOTPConsumer',  instance: consumer },
    { name: 'UserManagement',      instance: userMgmt }
  ];

  for (const { name, instance } of deployments) {
    const artifact = await artifacts.readArtifact(name);
    artifact.deployedAddress = instance.address;
    fs.writeFileSync(
      path.join(abisDir, `${name}.json`),
      JSON.stringify(artifact, null, 2)
    );
    console.log(`📦 Wrote ABI + address for ${name} to abis/${name}.json`);
  }

  console.log('\n🎉 Deployment complete!');
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Deployment error:', err);
    process.exit(1);
  });
