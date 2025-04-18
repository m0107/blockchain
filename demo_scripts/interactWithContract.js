// interact.js

// Import the Web3 library
const Web3 = require('web3').default;

// Connect to your Geth RPC endpoint (adjust the URL if needed)
const web3 = new Web3("http://127.0.0.1:57618");

// Set the sender address and its private key.
const senderAddress = "0x8943545177806ED17B9F23F0a21ee5948eCaa776";
const privateKey = "0xbcdf20249abf0ed6d944c0288fad489e33f66b3960d9e6229c1cd214ed3bbe31"; // Replace with the actual private key

// Your contract ABI (from your compiled contract)
const contractABI = [
  {
    "inputs": [],
    "name": "get",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "x",
        "type": "uint256"
      }
    ],
    "name": "set",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "storedData",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Your deployed contract address (from your previous deployment output)
const deployedAddress = "0xb4b46bdaa835f8e4b4d8e208b6559cd267851051";

// Create a contract instance using the deployed contract address
const deployedContract = new web3.eth.Contract(contractABI, deployedAddress);

async function interactWithContract() {
  try {
    // 1. Call the "get" function (a read-only call)
    let initialValue = await deployedContract.methods.get().call();
    console.log("Initial stored value:", initialValue);

    // 2. Prepare the transaction to call the "set" function (to set value = 42)
    const setValue = 78;
    const setTxData = deployedContract.methods.set(setValue).encodeABI();

    // Get the current nonce for the sender's account
    const nonce = await web3.eth.getTransactionCount(senderAddress, 'latest');

    // For legacy transactions, get the current gas price
    const gasPrice = await web3.eth.getGasPrice();
    // Estimate the gas needed for the transaction
    const gasEstimate = await deployedContract.methods.set(setValue).estimateGas({
      from: senderAddress
    });

    // Create the transaction object
    const tx = {
      from: senderAddress,
      to: deployedAddress,
      data: setTxData,
      gas: gasEstimate,
      gasPrice: gasPrice,
      nonce: nonce
    };

    // Sign the transaction with the private key
    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

    console.log("Sending transaction to set value to", setValue, "...");
    // Send the signed transaction and wait for receipt
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log("Set function transaction receipt:", receipt);

    // 3. Call "get" again to verify the change
    let updatedValue = await deployedContract.methods.get().call();
    console.log("Updated stored value:", updatedValue);

  } catch (error) {
    console.error("Error interacting with contract:", error);
  }
}

interactWithContract();