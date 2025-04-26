// src/blockchainSDK.js
require('dotenv').config();
const Web3 = require('web3');
const fs   = require('fs');
const path = require('path');

class BlockchainSDK {
  /**
   * @param {string} rpcUrl         — HTTP RPC endpoint for your private chain
   * @param {string} privateKey     — Deployer/admin EOA private key
   */
  constructor(rpcUrl, privateKey) {
    this.web3    = new Web3(rpcUrl);
    // console.log(this.web3, rpcUrl);
    this.account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
    this.web3.eth.accounts.wallet.add(this.account);
    this.web3.eth.defaultAccount = this.account.address;
  }

  /** Load an ABI + deployed address from abis/<name>.json */
  loadArtifact(name) {
    const file = path.join(__dirname, '../abis', name);
    if (!fs.existsSync(file)) throw new Error(`Missing ABI file: ${name}`);
    return JSON.parse(fs.readFileSync(file));
  }

  /** Send a state‐changing tx to <name>.<method>(...args) */
  async _send(name, method, args = []) {
    const art = this.loadArtifact(name + '.json');
    const ctr = new this.web3.eth.Contract(art.abi, art.deployedAddress);
    const data = ctr.methods[method](...args).encodeABI();
    const gas  = await this.web3.eth.estimateGas({ to: ctr.options.address, data });
    const tx   = { from: this.account.address, to: ctr.options.address, data, gas };
    const signed = await this.account.signTransaction(tx);
    return this.web3.eth.sendSignedTransaction(signed.rawTransaction);
  }

  /** Call a view method on-chain: <name>.<method>(...args).call() */
  async _call(name, method, args = []) {
    const art = this.loadArtifact(name + '.json');
    const ctr = new this.web3.eth.Contract(art.abi, art.deployedAddress);
    return ctr.methods[method](...args).call();
  }

  // ─── Chainlink OTP Consumer ───────────────────────────────────────────────

  /**
   * Emit OracleRequest for OTP generation.
   * @param {string} aadhaar
   * @returns {string} requestId (bytes32 hex)
   */
  async requestOtpOnChain(aadhaar) {
    const art = this.loadArtifact('AadhaarOTPConsumer.json');
    console.log("mohit11111111111")
    const ctr = new this.web3.eth.Contract(art.abi, art.deployedAddress);
    console.log("mohit2222222222222")
    const receipt = await ctr.methods.requestOtp(aadhaar).send({
      from: this.account.address,
      gas: 300_000
    });
    console.log("mohit3333333333333")

    return receipt.events.LogRequestOTP.returnValues.requestId;
  }

  /**
   * Fulfill an OTP request by passing back the OTP bytes32.
   * @param {string} requestId — bytes32 returned by requestOtpOnChain
   * @param {string} otpBytes32 — bytes32 string from ethers.utils.formatBytes32String
   */
  async fulfillOtpOnChain(requestId, otpBytes32) {
    const art = this.loadArtifact('AadhaarOTPConsumer.json');
    const ctr = new this.web3.eth.Contract(art.abi, art.deployedAddress);
    return ctr.methods.fulfill(requestId, otpBytes32).send({
      from: this.account.address,
      gas: 300_000
    });
  }

  // ─── RBAC Management ───────────────────────────────────────────────────────

  /**
   * Create a new role under given admin role.
   * @param {string} roleName        — e.g. "EDITOR"
   * @param {string} adminRoleName   — e.g. "ADMIN_ROLE"
   */
  async createRole(roleName, adminRoleName) {
    return this._send('RBACManager', 'createRole', [roleName, adminRoleName]);
  }

  /**
   * Grant a role to an account.
   * @param {string} roleName
   * @param {string} accountAddress
   */
  async grantRole(roleName, accountAddress) {
    return this._send('RBACManager', 'grantRoleByName', [roleName, accountAddress]);
  }

  /**
   * Map a function selector to a role.
   * @param {string} roleName
   * @param {string} fnSelector — first 4 bytes hex, e.g. web3.utils.keccak256(sig).slice(0,10)
   */
  async assignFunctionRole(roleName, fnSelector) {
    return this._send('RBACManager', 'assignFunctionRole', [roleName, fnSelector]);
  }

  // ─── User Management ────────────────────────────────────────────────────────

  /**
   * Create a user on-chain (requires RBAC + Aadhaar verification).
   * @param {string} aadhaar
   * @param {string} dataJson   — JSON‐stringified user data
   * @param {string} pinHash    — keccak256 hash of PIN
   * @param {string} docCID     — IPFS CID of user document
   */
  async createUser(aadhaar, dataJson, pinHash, docCID) {
    return this._send('UserManagement', 'createUser', [aadhaar, dataJson, pinHash, docCID]);
  }

  /**
   * Update user data on-chain (requires role permission).
   * @param {string} aadhaar
   * @param {string} newDataJson
   * @param {string} newDocCID
   */
  async updateUser(aadhaar, newDataJson, newDocCID) {
    return this._send('UserManagement', 'updateUser', [aadhaar, newDataJson, newDocCID]);
  }

  /**
   * Get a user’s data from-chain.
   * @param {string} aadhaar
   * @returns {Promise<[dataJson: string, pinHash: string, docCID: string]>}
   */
  async getUser(aadhaar) {
    return this._call('UserManagement', 'getUser', [aadhaar]);
  }

  /**
   * Change a user’s PIN hash (requires role).
   * @param {string} aadhaar
   * @param {string} oldHash
   * @param {string} newHash
   */
  async changePin(aadhaar, oldHash, newHash) {
    return this._send('UserManagement', 'changePin', [aadhaar, oldHash, newHash]);
  }
}

module.exports = BlockchainSDK;