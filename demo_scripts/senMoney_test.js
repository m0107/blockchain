const { Web3 } = require('web3');

async function main() {
	const web3 = new Web3('http://127.0.0.1:56802/');

	// create a new Web3.js account object with the private key of a Hardhat test account
	const privateKey = '0xbcdf20249abf0ed6d944c0288fad489e33f66b3960d9e6229c1cd214ed3bbe31';
	// the account is created with a wallet, which makes it easier to use
	const sender = web3.eth.accounts.wallet.add(privateKey)[0];

	// generate a new random Web3.js account object to receive the transaction
	const receiver_address = "0xaf5c61263B184AB62Bc76eFBc94eF6b909e85F9e";

	// log initial balances
	console.log(
		'Initial sender balance:',
		// account balance in wei
		await web3.eth.getBalance(sender.address),
	);
	console.log(
		'Initial receiver balance:',
		// account balance in wei
		await web3.eth.getBalance(receiver_address),
	);

	// sign and send the transaction
	const receipt = await web3.eth.sendTransaction({
		from: sender.address,
		to: receiver_address,
		// amount in wei
		value: 100,
	});

	// log transaction receipt
	console.log(receipt);

	// log final balances
	console.log('Final sender balance:', await web3.eth.getBalance(sender.address));
	console.log('Final receiver balance:', await web3.eth.getBalance(receiver_address));
}

main();