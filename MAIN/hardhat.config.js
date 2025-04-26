require('dotenv').config();
require('@nomiclabs/hardhat-ethers');

module.exports = {
  defaultNetwork: 'local',
  networks: {
    local: {
      url: process.env.RPC_URL || 'http://127.0.0.1:49479',
      chainId: process.env.CHAIN_ID ? parseInt(process.env.CHAIN_ID) : 585858,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: { enabled: true, runs: 200 }
        }
      },
      {
        version: "0.8.19",     // ← add this
        settings: {
          optimizer: { enabled: true, runs: 200 }
        }
      }
    ]
  },
  paths: {
    sources: './contracts',
    tests:   './test',
    cache:   './cache',
    artifacts: './artifacts',
  },
  mocha: {
    timeout: 20000,
  },
};
