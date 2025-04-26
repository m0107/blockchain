// scripts/test-sdk.js
require("dotenv").config();
const SDK = require("../src/blockchainSDK");
const sdk = new SDK(process.env.RPC_URL, process.env.PRIVATE_KEY);

async function run() {
  // 1️⃣ Create a new role "EDITOR"
  await sdk.createRole("EDITOR", "ADMIN_ROLE");
  console.log("✅ EDITOR role created");

  // 2️⃣ Grant it to Alice
  const alice = "0xE25583099BA105D9ec0A67f5Ae86D90e50036425";
  await sdk.grantRole("EDITOR", alice);
  console.log(`✅ EDITOR granted to ${alice}`);

  // 3️⃣ Gate updateUser to EDITOR
  const sig = sdk.web3.utils
    .keccak256("updateUser(string,string,string)")
    .slice(0, 10);
  await sdk.assignFunctionRole("EDITOR", sig);
  console.log("✅ updateUser() now requires EDITOR");

  // // 4️⃣ Create a user (you’re ADMIN_ROLE)
  // const result = await sdk.createUser("A-123", { name: "Alice" }, "0000", "QmCID");
  // console.log(result);
  // console.log("✅ User A-123 created");

  // 5️⃣ Attempt update from ADMIN (should revert)
  try {
    await sdk.updateUser("A-123", { name: "Alicia" }, "QmCID2");
    console.log("— updateUser succeeded (unexpected)");
  } catch (e) {
    console.log("✗ updateUser reverted as expected (ADMIN lacks EDITOR):", e.message);
  }

  // 6️⃣ Attempt update from a non-EDITOR account (Bob), should also revert
  const bobPrivateKey = "0x39725efee3fb28614de3bacaffe4cc4bd8c436257e2c8bb887c4b5c4be45e76d";
  // switch signer to Bob
  sdk.web3.eth.accounts.wallet.clear();
  sdk.web3.eth.accounts.wallet.add(bobPrivateKey);
  sdk.web3.eth.defaultAccount = sdk.web3.eth.accounts.wallet[0].address;
  try {
    await sdk.updateUser("A-123", { name: "Bobby" }, "QmCID3");
    console.log("— updateUser succeeded (unexpected)");
  } catch (e) {
    console.log("✗ updateUser reverted as expected (non-EDITOR Bob):", e.message);
  }
}
run();