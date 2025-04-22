// hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.17", // For contracts using ^0.8.17 (GenericDataStorage, LoanManagement, etc.)
        settings: {
          optimizer: { enabled: true, runs: 200 }
        }
      },
      {
        version: "0.8.28", // For the Lock.sol contract that uses ^0.8.28
        settings: {
          optimizer: { enabled: true, runs: 200 }
        }
      }
    ]
  },
  paths: {
    sources: "./contracts",      // Solidity source files
    tests: "./test",             // Your test scripts
    cache: "./cache",
    artifacts: "./artifacts",    // Compiled contract artifacts
  },
    networks: {
      localhost: {
        url: "http://127.0.0.1:49636",
        chainId: 585858,
        accounts: ["0xbcdf20249abf0ed6d944c0288fad489e33f66b3960d9e6229c1cd214ed3bbe31"]
        // accounts: [ privateKey, ... ]   // Provide your private keys if needed
      },
    },
    // Add more networks if needed.
};