// sampleUsage.js

const BlockchainSDK = require('./blockchainSDK');

const providerUrl = "http://127.0.0.1:57618";
const senderAddress = "0x8943545177806ED17B9F23F0a21ee5948eCaa776";
const privateKey = "0xbcdf20249abf0ed6d944c0288fad489e33f66b3960d9e6229c1cd214ed3bbe31";

const sdk = new BlockchainSDK(providerUrl, senderAddress, privateKey);

async function main() {
  try {
    const aadhaar = "123456789012";
    const userData = { name: "Alice", age: 28, address: "100 Main St" };
    console.log("Creating user...");
    let receipt = await sdk.createUser(aadhaar, userData);
    console.log("User created:", receipt);

    let user = await sdk.getUser(aadhaar);
    console.log("User data:", user);

    console.log("Updating user...");
    let newUserData = { name: "Alice", age: 29, address: "200 Main St" };
    receipt = await sdk.updateUser(aadhaar, newUserData);
    console.log("User updated:", receipt);

    user = await sdk.getUser(aadhaar);
    console.log("Updated user data:", user);
    
  } catch (error) {
    console.error("SDK Error:", error);
  }
}

main();