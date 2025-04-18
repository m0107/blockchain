// send_money.js
const Web3 = require('web3').default; // CommonJS style import
const { FeeMarketEIP1559Transaction } = require('@ethereumjs/tx');
const  { Chain, Common, Hardfork } = require('@ethereumjs/common')

// Connect to your Geth RPC endpoint
const web3 = new Web3("http://127.0.0.1:57618");

// Pre-funded sender and recipient addresses
const sender = "0x8943545177806ED17B9F23F0a21ee5948eCaa776";
const receiver = "0xaf5c61263B184AB62Bc76eFBc94eF6b909e85F9e";

// Sender's private key (ensure the key is correct)
// The key can have a "0x" prefix; we remove it.
const senderPrivateKey = "0xbcdf20249abf0ed6d944c0288fad489e33f66b3960d9e6229c1cd214ed3bbe31";

async function sendFundsSigned() {
    try {
      // Get the current nonce of the sender.
      const txCount = await web3.eth.getTransactionCount(sender);
  
      // Convert numbers to hex using numberToHex to avoid comma formatting.
      const nonceHex = web3.utils.numberToHex(txCount);
      const valueHex = web3.utils.numberToHex(web3.utils.toWei("1", "ether"));
      const gasLimitHex = web3.utils.numberToHex(21000);
      const gasPriceHex = web3.utils.numberToHex(web3.utils.toWei("10", "gwei"));
  
      // Build the transaction parameters (legacy transaction).
      const txParams = {
        nonce: nonceHex,
        to: receiver,
        value: valueHex,
        gasLimit: gasLimitHex,
        gasPrice: gasPriceHex
      };
  
      // Create a Common instance for your custom chain.
      // For your private network, both chainId and networkId are 585858.
      // We base our settings on "mainnet" then override:
      const customCommon = Common.custom({
        chain: {
            name: 'custom',
            chainId: 585858,
            networkId: 585858
          },
          hardfork: 'london'
        });
  
      // Create the legacy transaction object using the custom common parameters.
      const tx = FeeMarketEIP1559Transaction.fromTxData(txParams, { common: customCommon });
  
      // Convert the sender's private key (strip the '0x' prefix, if any) to a Buffer.
      const privateKeyBuffer = Buffer.from(senderPrivateKey.replace(/^0x/, ''), 'hex');
  
      // Sign the transaction.
      const signedTx = tx.sign(privateKeyBuffer);
  
      // Serialize the signed transaction and add the "0x" prefix.
      const serializedTx = signedTx.serialize();
      const rawTx = '0x' + serializedTx.toString('hex');
  
      // Send the signed transaction.
      const receipt = await web3.eth.sendSignedTransaction(rawTx);
      console.log("Transaction successful. Receipt:", receipt);
    } catch (error) {
      console.error("Error sending signed transaction:", error);
    }
  }
  
  sendFundsSigned();