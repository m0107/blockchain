// public/app.js
import SDK from '../src/blockchainSDK.js';
import { ethers } from 'ethers';

const sdk = new SDK(window.RPC_URL, window.PRIVATE_KEY);

document.getElementById('createUserBtn').onclick = async () => {
  const aadhaar = prompt('Aadhaar?');
  const name    = prompt('Name?');
  const docCID  = prompt('docCID?');
  const pin     = prompt('PIN?');

  try {
    // 1️⃣ Request OTP on-chain
    const reqId = await sdk.requestOtpOnChain(aadhaar);
    console.log('OTP requestId:', reqId);

    // 2️⃣ Show modal
    const modal = document.getElementById('otpModal');
    modal.style.display = 'flex';

    document.getElementById('submitOtpBtn').onclick = async () => {
      const otp = document.getElementById('otpInput').value;
      if (otp.length !== 6) return alert('Enter 6-digit OTP');

      // 3️⃣ Fulfill OTP
      const otpBytes = ethers.utils.formatBytes32String(otp);
      await sdk.fulfillOtpOnChain(reqId, otpBytes);
      console.log('OTP fulfilled on-chain');

      // 4️⃣ Create user
      const pinHash = sdk.web3.utils.keccak256(pin);
      const receipt = await sdk.createUser(aadhaar, JSON.stringify({ name }), pinHash, docCID);
      console.log('✅ User created tx:', receipt.transactionHash);

      modal.style.display = 'none';
    };
  } catch (e) {
    console.error(e);
    alert('Error: ' + e.message);
  }
};