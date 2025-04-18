const { default: Web3 } = require('web3');
const web3 = new Web3("http://127.0.0.1:49675");
// ... your code here

// This creates an account locally.
// const newAccount = web3.eth.accounts.create();
// console.log("New account created:", newAccount);



web3.eth
	.getChainId()
	.then(result => {
		console.log('Chain ID: ' + result);
	})
	.catch(error => {
		console.error(error);
	});
  
web3.eth.getBalance("0x49a13AdEF4d0673bd32CA81aBc025b6203fF9d73")
  .then((balance) => {
    console.log("Balance:", web3.utils.fromWei(balance, "ether"), "ETH");
  })
  .catch(console.error);

web3.eth.getBlockNumber()
  .then(blockNumber => {
    console.log("Current block number:", blockNumber);
  })
  .catch(err => {
    console.error("Error fetching block number:", err);
  });