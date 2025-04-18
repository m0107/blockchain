const Web3 = require('web3').default;
// Replace with your node's RPC URL
const web3 = new Web3("http://127.0.0.1:56802"); 

async function createAccount() {
  try {
    // Replace with the password you want to set
    const password = 'YourStrongPassword';
    const newAccount = await web3.eth.personal.newAccount(password);
    console.log("New account address:", newAccount);
  } catch (error) {
    console.error("Error creating new account:", error);
  }
}

createAccount();