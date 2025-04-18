/*******************************************************
 * queryFinality.js
 *
 * This script queries the Teku Consensus Layer (CL) client's
 * HTTP API for finality checkpoints via a state-specific endpoint.
 *
 * We're using the "/eth/v1/beacon/states/head/finality_checkpoints"
 * endpoint so that we get the checkpoints for the head state.
 *
 * Adjust CL_API_BASE if you need to query a different CL client.
 *******************************************************/

const axios = require('axios');

// Set the CL client endpoint based on your Docker setup.
// In your case, for the cl-1 client, you have this mapped to port 57630.
const CL_API_BASE = 'http://127.0.0.1:49867';

async function getFinalityCheckpoints() {
  try {
    // Use the "head" state to get the finality checkpoints
    const endpoint = `${CL_API_BASE}/eth/v1/beacon/states/head/finality_checkpoints`;
    const response = await axios.get(endpoint);
    
    console.log('Finality Checkpoints Raw Response:\n', JSON.stringify(response.data, null, 2));

    if (response.data && response.data.data) {
      const { previous_justified, current_justified, finalized } = response.data.data;

      console.log('\nFinality Data:');
      console.log('Previous Justified:', previous_justified);
      console.log('Current Justified:', current_justified);
      console.log('Finalized:', finalized);
    } else {
      console.log('No data found in the response.');
    }
  } catch (error) {
    console.error('Error querying finality checkpoints:', error.message);
    if (error.response && error.response.data) {
      console.error('Error details:', error.response.data);
    }
  }
}

(async () => {
  console.log('--- Querying Teku CL client for finality checkpoints ---');
  await getFinalityCheckpoints();
  console.log('--- Done ---');
})();