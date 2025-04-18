// Import the Web3 library
const Web3 = require('web3').default;

// Connect to your Geth RPC endpoint (update URL and port as needed)
const web3 = new Web3("http://127.0.0.1:57618");

async function getAccounts() {
  try {
    // Retrieve the list of accounts from the node
    const accounts = await web3.eth.getAccounts();
    console.log("Accounts:", accounts);
  } catch (error) {
    console.error("Error fetching accounts:", error);
  }
}

getAccounts();