// scripts/interact-web3.js
require("dotenv").config();
const Web3 = require("web3").default;
const fs   = require("fs");
const path = require("path");

async function main() {
  // 1️⃣ Setup provider & account
  const web3 = new Web3(process.env.RPC_URL);
  const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
  web3.eth.accounts.wallet.add(account);
  web3.eth.defaultAccount = account.address;

  console.log("Using account:", account.address);

  // 2️⃣ Load ABI & contract instance
  const artifact = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../artifacts/contracts/UserManagement.sol/UserManagement.json"),
      "utf8"
    )
  );
  const userMgmt = new web3.eth.Contract(
    artifact.abi,
    process.env.CONTRACT_ADDRESS
  );

  // 3️⃣ Prepare data
  const aadhaar = "2111-2222-3333";
  const dataJson = JSON.stringify({ name: "Charlie", email: "charlie@example.com" });
  const pinPlain = "2468";
  const pinHash = web3.utils.keccak256(web3.utils.utf8ToHex(pinPlain));

  // 4️⃣ Call createUser (state‑changing → send tx)
  // console.log("▶️  createUser...");
  // const tx1 = userMgmt.methods.createUser(aadhaar, dataJson, pinHash);
  // const receipt1 = await tx1.send({
  //   from: account.address,
  //   gas: 300_000
  // });
  // console.log(receipt1, "receipt1");
  // console.log("   tx hash:", receipt1.transactionHash);

  // 5️⃣ Call getUser (view → call)
  console.log("🔍 getUser...");
  const result = await userMgmt.methods.getUser(aadhaar).call();
  console.log("   data:", result[0]);
  console.log("   stored pinHash:", result[1]);

  // 6️⃣ Update user data
  console.log("▶️  updateUser...");
  const newData = JSON.stringify({ name: "Charlie", age: 29 });
  const receipt2 = await userMgmt.methods
    .updateUser(aadhaar, newData)
    .send({ from: account.address, gas: 200_000 });
  console.log("   tx hash:", receipt2.transactionHash);

  // 7️⃣ Change PIN
  console.log("▶️  changePin...");
  const newPinHash = web3.utils.keccak256(web3.utils.utf8ToHex("8642"));
  const receipt3 = await userMgmt.methods
    .changePin(aadhaar, pinHash, newPinHash)
    .send({ from: account.address, gas: 200_000 });
  console.log("   tx hash:", receipt3.transactionHash);

  // 8️⃣ Verify updated PIN
  console.log("🔍 getUser (after PIN change)...");
  const after = await userMgmt.methods.getUser(aadhaar).call();
  console.log("   new pinHash:", after[1]);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});