const { default: Web3 } = require('web3');
const web3 = new Web3("http://127.0.0.1:57618");

// Define your two account addresses
const account1 = "0x8943545177806ED17B9F23F0a21ee5948eCaa776";
const account2 = "0xaf5c61263B184AB62Bc76eFBc94eF6b909e85F9e";

// Asynchronous function to get and display balances and block number
async function getNetworkInfo() {
  try {
    // Get balances (returns balance in Wei)
    const balance1Wei = await web3.eth.getBalance(account1);
    const balance2Wei = await web3.eth.getBalance(account2);

    // Convert balances from Wei to Ether
    const balance1Eth = web3.utils.fromWei(balance1Wei, "ether");
    const balance2Eth = web3.utils.fromWei(balance2Wei, "ether");

    // Get the current block number
    const currentBlock = await web3.eth.getBlockNumber();

    console.log(`Account ${account1} Balance: ${balance1Eth} ETH`);
    console.log(`Account ${account2} Balance: ${balance2Eth} ETH`);
    console.log(`Current Block Number: ${currentBlock}`);
  } catch (error) {
    console.error("Error fetching network info:", error);
  }
}

getNetworkInfo();
