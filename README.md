Below is a complete README.md file that consolidates all the information, instructions, and steps discussed in our conversation. You can customize or update it as needed.

⸻



# Blockchain SDK & Smart Contract Platform

This project implements a comprehensive Blockchain Software Development Kit (SDK) along with several Solidity smart contracts. The SDK provides functions for user management, loan management, workflow management, role and RBAC (Role-Based Access Control) management, and generic data storage operations. It also demonstrates deployment, interaction, and finality queries for a hybrid blockchain setup using an Execution Layer (e.g., Geth) and a Consensus Layer (CL, e.g., Teku).

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Smart Contract Development](#smart-contract-development)
  - [Contracts and ABIs](#contracts-and-abis)
  - [Compilation with Hardhat](#compilation-with-hardhat)
- [Deployment & Interaction](#deployment--interaction)
  - [Deploying Contracts](#deploying-contracts)
  - [Interacting with the Contracts](#interacting-with-the-contracts)
  - [Querying Finality via CL API](#querying-finality-via-cl-api)
- [Blockchain SDK Functions](#blockchain-sdk-functions)
- [Additional Tools and Services](#additional-tools-and-services)
- [Usage Examples](#usage-examples)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Overview

The project consists of two main components:

1. **Smart Contracts** written in Solidity that provide the following functionalities:
   - **User Management:** Create, update, query, and change PIN.
   - **Loan Management:** Create, update, and query user loans.
   - **Workflow Management:** Create, update, and query workflow documents (also stored in IPFS).
   - **Loan Scheme Management:** Manage and query loan schemes.
   - **Role and RBAC Management:** Create, update, and list roles; manage RBAC with predefined permissions.
   - **Generic Data Storage:** Write and update generic data (to be stored externally, e.g., in MongoDB).
   - **File Management:** Upload and read files associated with a user.

2. **Blockchain SDK (`blockchainSDK.js`):** A JavaScript (Node.js) library wrapping blockchain operations. It provides functions to interact with the network (deployment, transaction signing, finality query), manage user operations, and encapsulate the smart contract interactions.

The project also sets up a hybrid blockchain network using:
- **Execution Layer (EL):** Geth (Go Ethereum) or similar for executing transactions and smart contracts.
- **Consensus Layer (CL):** Clients like Teku, Lighthouse, or Prysm used for finality and consensus.

## Project Structure

project-root/
├── contracts/
│   ├── GenericDataStorage.sol
│   ├── LoanManagement.sol
│   ├── LoanSchemeManagement.sol
│   ├── Lock.sol
│   ├── RBACManagement.sol
│   ├── RoleManagement.sol
│   ├── UserManagement.sol
│   └── WorkflowManagement.sol
├── abis/                  # Contains generated ABI files post-compilation
├── scripts/
│   ├── deploy_n_test.js   # Script for deploying and testing contracts
│   ├── interactWithContract.js  # Script for interacting with a deployed contract
│   ├── queryFinality.js   # Script for querying finality using CL client API
│   └── …                # Other scripts (deployment, finality queries, etc.)
├── blockchainSDK.js       # The main SDK file that wraps blockchain functions
├── hardhat.config.js      # Hardhat configuration file
├── package.json
└── README.md

## Prerequisites

- [Node.js](https://nodejs.org/) (v14.x or higher recommended)
- [npm](https://www.npmjs.com/)
- [Hardhat](https://hardhat.org/)
- Docker (optional, for running EL/CL clients like Geth and Teku)
- Geth (Execution Layer client)
- Teku (Consensus Layer client) or similar

## Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone <your-repo-url>
   cd <your-repo-folder>

	2.	Install Dependencies:

npm install


	3.	Configure Hardhat:
Make sure your hardhat.config.js includes the compiler versions matching the Solidity version pragmas in your contracts (for instance, ^0.8.17 and ^0.8.28). For example:

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.17",
      },
      {
        version: "0.8.28",
      },
    ],
  },
};


	4.	Run Hardhat Compilation:

npx hardhat compile

This command compiles the Solidity contracts and generates the ABI files inside the abis/ folder.

Smart Contract Development

Contracts and ABIs

Each smart contract is placed in the contracts/ folder. You have separate Solidity files for each module:
	•	GenericDataStorage.sol
	•	LoanManagement.sol
	•	LoanSchemeManagement.sol
	•	Lock.sol
	•	RBACManagement.sol
	•	RoleManagement.sol
	•	UserManagement.sol
	•	WorkflowManagement.sol

Compilation with Hardhat

Run the following command to compile the contracts:

npx hardhat compile

After compilation, the ABI files will be generated and can be found in your build artifact directories (or copied to the abis/ folder manually via a script if needed).

Deployment & Interaction

Deploying Contracts

Use a deployment script (e.g., deploy_n_test.js) that:
	1.	Creates a contract instance using Web3.
	2.	Estimates the required gas for deployment.
	3.	Signs the transaction with a private key.
	4.	Sends the signed transaction.
	5.	Outputs the deployed contract address.

Interacting with the Contracts

Use a script (e.g., interactWithContract.js) to:
	1.	Connect to the network using Web3.
	2.	Create a new contract instance with the contract address and ABI.
	3.	Call contract methods (e.g., read a value, send a transaction to update state).

Querying Finality via CL API

Since finality is achieved by the Consensus Layer client, use a script (e.g., queryFinality.js) to query the CL client’s API endpoint. For example, using Teku’s HTTP API endpoint on port 5052/5054, query the /eth/v1/beacon/finality_checkpoints endpoint.

If you encounter a 404 error, ensure your CL client supports that endpoint and is configured correctly. Some clients have different endpoint routes or versions.

Sample Code Snippet for Querying Finality:

const axios = require('axios');

async function queryFinality() {
  try {
    const response = await axios.get("http://127.0.0.1:5052/eth/v1/beacon/finality_checkpoints");
    console.log("Finality Checkpoints:", response.data);
  } catch (error) {
    console.error("Error querying finality checkpoints:", error.response ? error.response.data : error.message);
  }
}

queryFinality();

Adjust the endpoint URL and port as per your CL client configuration.

Blockchain SDK

The blockchainSDK.js is a library that wraps common blockchain functions such as user management, loan management, workflows, role management, file upload, and generic data management. It abstracts deployment, transaction signing, and contract interaction so that applications can interact with the blockchain without dealing with lower-level details.

SDK Modules and Functions

Some of the functions provided by the SDK include:
	•	Authentication and Login:
	•	SDK_login(aadhaar)
	•	User Management:
	•	createUser(aadhaar, data)
	•	updateUser(aadhaar, data)
	•	getUser(aadhaar)
	•	changePin(oldPin, newPin)
	•	Loan Management:
	•	createLoan(aadhaar, loanData)
	•	updateLoan(aadhaar, loanDataArray)
	•	getLoanbyUser(aadhaar)
	•	Workflow Management:
	•	createWorkflow(data)
	•	updateWorkflow(workflowID, data)
	•	getWorkflowbyID(workflowID)
	•	Loan Schemes:
	•	createLoanScheme(loanSchemeData)
	•	updateLoanScheme(loanSchemeID, loanSchemeData)
	•	getLoanbySchemeID(loanSchemeID)
	•	Role & RBAC:
	•	createRole(roleName)
	•	updateRole(roleName)
	•	getAllRoles()
	•	createRBAC(roleId, data)
	•	getRBAC(roleId)
	•	Generic Data Storage (MongoDB Operations):
	•	createData(collectionName, data)
	•	updateData(collectionName, documentID, data)
	•	File Storage:
	•	uploadFile(aadhaar, file, metadata, fileId)
	•	readFile(fileId)

Usage Example

Below is a sample usage of the SDK in a Node.js application:

// Import the Blockchain SDK
const BlockchainSDK = require('./blockchainSDK');

// Initialize the SDK (e.g., by providing configuration parameters or endpoints)
BlockchainSDK.init({
  executionEndpoint: "http://127.0.0.1:57618",
  consensusEndpoint: "http://127.0.0.1:5052", // adjust as per your CL client config
  privateKey: "0xYOUR_PRIVATE_KEY",
  senderAddress: "0xYOUR_SENDER_ADDRESS"
});

// Example: Create a new user
async function testUserOperations() {
  const aadhaar = "123456789012";
  const userData = { name: "John Doe", age: 30, address: "0x..." };

  // Create User
  let createResult = await BlockchainSDK.createUser(aadhaar, userData);
  console.log("User created:", createResult);

  // Get User
  let user = await BlockchainSDK.getUser(aadhaar);
  console.log("User data:", user);

  // Update User
  const updatedData = { name: "John D", age: 31 };
  let updateResult = await BlockchainSDK.updateUser(aadhaar, updatedData);
  console.log("User updated:", updateResult);
}

testUserOperations();

Additional Tools and Services
	•	Krutosis: (If applicable) Use our Krutosis integration for advanced data transformation and secure key management.
	•	Geth: Run your Execution Layer client for executing transactions and smart contract calls.
	•	Teku (or other CL clients): Run your Consensus Layer client to manage finality, sync, and validator duties.
	•	Docker: Use Docker to containerize and run Geth, Teku, and other clients if needed.

Running the System
	1.	Deploy and interact with smart contracts using the provided deployment and interaction scripts in the scripts/ folder.
	2.	Test the SDK functions by running the sample usage script (as shown above).
	3.	Query finality and other consensus metrics via the Consensus Layer client API using sample query scripts.

Troubleshooting
	•	Compilation Issues:
If you see errors regarding Solidity version mismatches (e.g., HH606), adjust your hardhat.config.js to include the necessary compiler versions.
	•	Deployment/Transaction Errors:
Ensure that your sender account is pre-funded and unlocked (or use signing with the corresponding private key as shown in the SDK).
	•	CL API Endpoints Not Found:
Verify your Consensus Layer client documentation (e.g., Teku) to ensure you’re using the correct endpoint URLs and ports.
	•	Missing ABI Files:
Verify that your contract compilation created the ABI files and that they are in the correct folder (e.g., abis/).

License

This project is licensed under the MIT License. See the LICENSE file for details.

⸻
# blockchain
