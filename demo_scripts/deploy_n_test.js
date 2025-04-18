// // Import the required packages
// const Web3 = require('web3').default; // Import as a CommonJS module
// // For deploying contracts using web3, the built-in Contract abstraction is used.
  
// // Connect to your Geth RPC endpoint
// const web3 = new Web3("http://127.0.0.1:57618");

// // If you already have a pre-funded account (which is unlocked in your private network),
// // use that address directly instead of creating a new random account.
// // For demonstration, here we create a new account, but note that such an account will not have funds.
// // const sender = web3.eth.accounts.create();
// // const senderAddress = "0x8943545177806ED17B9F23F0a21ee5948eCaa776"; // Use your pre-funded account

// const senderAddress = "0x8943545177806ED17B9F23F0a21ee5948eCaa776";

// // --- Contract ABI and Bytecode ---
// // Replace these with the actual ABI and bytecode from your compiled contract.
// const contractABI = [
//   {
//     "inputs": [],
//     "name": "get",
//     "outputs": [
//       {
//         "internalType": "uint256",
//         "name": "",
//         "type": "uint256"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "uint256",
//         "name": "x",
//         "type": "uint256"
//       }
//     ],
//     "name": "set",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "stateMutability": "nonpayable",
//     "type": "constructor"
//   },
//   {
//     "inputs": [],
//     "name": "storedData",
//     "outputs": [
//       {
//         "internalType": "uint256",
//         "name": "",
//         "type": "uint256"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   }
// ];

// const contractBytecode = "6080604052348015600e575f80fd5b506101718061001c5f395ff3fe608060405234801561000f575f80fd5b506004361061003f575f3560e01c80632a1afcd91461004357806360fe47b1146100615780636d4ce63c1461007d575b5f80fd5b61004b61009b565b60405161005891906100c9565b60405180910390f35b61007b60048036038101906100769190610110565b6100a0565b005b6100856100a9565b60405161009291906100c9565b60405180910390f35b5f5481565b805f8190555050565b5f8054905090565b5f819050919050565b6100c3816100b1565b82525050565b5f6020820190506100dc5f8301846100ba565b92915050565b5f80fd5b6100ef816100b1565b81146100f9575f80fd5b50565b5f8135905061010a816100e6565b92915050565b5f60208284031215610125576101246100e2565b5b5f610132848285016100fc565b9150509291505056fea26469706673582212200fc561f37587d661378e32a1867e6af8b1e3e7d4ba71540be8e169201158562c64736f6c634300081a0033";

// // Function to deploy the contract and then test its functions
// async function deployAndTest() {
//   try {
//     // Create a contract instance
//     const contract = new web3.eth.Contract(contractABI);

//     // Prepare the deployment transaction using the bytecode
//     const deployTx = contract.deploy({
//       data: contractBytecode,
//       arguments: [] // Add constructor arguments here if necessary
//     });

//     // Estimate gas for deployment
//     const gasEstimate = await deployTx.estimateGas({ from: senderAddress });
//     console.log("Estimated gas for deployment:", gasEstimate);

//     // Send the deployment transaction from your unlocked/funded sender account.
//     // Make sure the "from" field uses the sender's address (as a string)
//     const deployedContract = await deployTx.send({
//       from: senderAddress,
//       gas: gasEstimate
//     });

//     console.log("Contract deployed at address:", deployedContract.options.address);

//     // Test the deployed contract:
//     // Call the "get" method to retrieve the initial value (should be 0)
//     let storedValue = await deployedContract.methods.get().call();
//     console.log("Initial stored value:", storedValue);

//     // Call the "set" method to change the value (e.g., set it to 42)
//     const txReceipt = await deployedContract.methods.set(42).send({ from: senderAddress });
//     console.log("Set function transaction receipt:", txReceipt);

//     // Call the "get" method again to verify that the value changed
//     storedValue = await deployedContract.methods.get().call();
//     console.log("Updated stored value:", storedValue);
//   } catch (error) {
//     console.error("Error deploying or testing contract:", error);
//   }
// }

// deployAndTest();



const Web3 = require('web3').default;

// Connect to your Geth RPC endpoint
const web3 = new Web3("http://127.0.0.1:57618");

// Set the sender address and its private key (this private key must correspond to the prefunded account)
const senderAddress = "0x8943545177806ED17B9F23F0a21ee5948eCaa776";
const privateKey = "0xbcdf20249abf0ed6d944c0288fad489e33f66b3960d9e6229c1cd214ed3bbe31";  // Replace with the actual private key

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
    
const contractBytecode = "6080604052348015600e575f80fd5b506101718061001c5f395ff3fe608060405234801561000f575f80fd5b506004361061003f575f3560e01c80632a1afcd91461004357806360fe47b1146100615780636d4ce63c1461007d575b5f80fd5b61004b61009b565b60405161005891906100c9565b60405180910390f35b61007b60048036038101906100769190610110565b6100a0565b005b6100856100a9565b60405161009291906100c9565b60405180910390f35b5f5481565b805f8190555050565b5f8054905090565b5f819050919050565b6100c3816100b1565b82525050565b5f6020820190506100dc5f8301846100ba565b92915050565b5f80fd5b6100ef816100b1565b81146100f9575f80fd5b50565b5f8135905061010a816100e6565b92915050565b5f60208284031215610125576101246100e2565b5b5f610132848285016100fc565b9150509291505056fea26469706673582212200fc561f37587d661378e32a1867e6af8b1e3e7d4ba71540be8e169201158562c64736f6c634300081a0033";  // Your compiled contract bytecode

async function deployAndTest() {
  try {
    // Create a contract instance
    const contract = new web3.eth.Contract(contractABI);

    // Prepare the deployment transaction data
    const deployTx = contract.deploy({ data: contractBytecode, arguments: [] });
    const encodedABI = deployTx.encodeABI();

    // Estimate gas for deployment
    const gasEstimate = await web3.eth.estimateGas({
      from: senderAddress,
      data: encodedABI
    });
    console.log("Estimated gas for deployment:", gasEstimate);

    // Get the current nonce
    const nonce = await web3.eth.getTransactionCount(senderAddress, 'latest');

    // Create the transaction object
    const tx = {
      from: senderAddress,
      data: encodedABI,
      gas: gasEstimate,
      nonce: nonce
    };

    // Sign the transaction with the private key
    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
    
    // Send the signed transaction
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log("Contract deployed at address:", receipt.contractAddress);

    // Additional tests can be run here, e.g., calling contract methods
  } catch (error) {
    console.error("Error deploying or testing contract:", error);
  }
}

deployAndTest();