// Import Web3 as usual (make sure you are not destructuring default)
const Web3 = require('web3').default;

// Connect to your local Geth RPC endpoint
const web3 = new Web3("http://127.0.0.1:56802");

// Specify the block number (or you could use "latest" if you like)
const blockNumberToCheck = 10; // Replace with the block number you want to inspect

async function checkBlockStatus() {
  try {
    const block = await web3.eth.getBlock(blockNumberToCheck);
    if (block) {
      console.log(`Block ${blockNumberToCheck} is in the chain.`);
      console.log("Block details:", block);
    } else {
      console.log(`Block ${blockNumberToCheck} was not found in the chain.`);
    }
  } catch (error) {
    console.error("Error fetching block:", error);
  }
}


async function checkBlockIsAdded(blockNumberToCheck) {
    try {
      const latestBlock = await web3.eth.getBlock('latest');
      console.log("Latest block number:", latestBlock.number);
      
      if (blockNumberToCheck <= latestBlock.number) {
        const block = await web3.eth.getBlock(blockNumberToCheck);
        if (block) {
          console.log(`Block ${blockNumberToCheck} is present in the chain.`);
        } else {
          console.log(`Block ${blockNumberToCheck} is not retrievable.`);
        }
      } else {
        console.log(`The chain’s current height is ${latestBlock.number}. Block ${blockNumberToCheck} has not been produced yet.`);
      }
    } catch (error) {
      console.error("Error checking block status:", error);
    }
  }
  
  // Check for block number 10 (update as needed)
  checkBlockIsAdded(10);

checkBlockStatus();