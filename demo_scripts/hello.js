const { default: Web3 } = require('web3');
const web3 = new Web3("http://127.0.0.1:49675");
    

web3.eth.getAccounts().then(console.log);

web3.eth.getBlockNumber()
.then(console.log);

