require('dotenv').config();
const Web3 = require('web3');
const fs   = require('fs');
const path = require('path');

class BlockchainSDK {
  constructor(rpcUrl, privateKey) {
    this.web3    = new Web3(rpcUrl);
    this.account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
    this.web3.eth.accounts.wallet.add(this.account);
    this.web3.eth.defaultAccount = this.account.address;
  }

  loadArtifact(name) {
    const p = path.join(__dirname, '../abis', name);
    if (!fs.existsSync(p)) throw new Error(`ABI missing: ${name}`);
    return JSON.parse(fs.readFileSync(p));
  }

  async _send(name, method, args) {
    const art = this.loadArtifact(name + '.json');
    const ctr = new this.web3.eth.Contract(art.abi, art.deployedAddress);
    const data = ctr.methods[method](...args).encodeABI();
    const gas  = await this.web3.eth.estimateGas({ to: ctr.options.address, data });
    const tx   = { from: this.account.address, to: ctr.options.address, data, gas };
    const signed = await this.account.signTransaction(tx);
    return this.web3.eth.sendSignedTransaction(signed.rawTransaction);
  }

  async _call(name, method, args) {
    const art = this.loadArtifact(name + '.json');
    const ctr = new this.web3.eth.Contract(art.abi, art.deployedAddress);
    return ctr.methods[method](...args).call();
  }

  // RBAC
  createRole(roleName, adminRoleName) {
    return this._send('RBACManager', 'createRole', [roleName, adminRoleName]);
  }
  grantRole(roleName, account) {
    return this._send('RBACManager', 'grantRoleByName', [roleName, account]);
  }
  assignFunctionRole(roleName, fnSig) {
    return this._send('RBACManager', 'assignFunctionRole', [roleName, fnSig]);
  }

  // UserManagement
  createUser(aadhaar, userData, pin, docCID) {
    const hash = this.web3.utils.keccak256(pin);
    return this._send('UserManagement', 'createUser', [aadhaar, JSON.stringify(userData), hash, docCID]);
  }
  updateUser(aadhaar, data, docCID) {
    return this._send('UserManagement', 'updateUser', [aadhaar, JSON.stringify(data), docCID]);
  }
  async getUser(aadhaar) {
    const [d,h,c] = await this._call('UserManagement', 'getUser', [aadhaar]);
    return { data: JSON.parse(d), pinHash: h, docCID: c };
  }
  changePin(aadhaar, oldPin, newPin) {
    const oldH = this.web3.utils.keccak256(oldPin);
    const newH = this.web3.utils.keccak256(newPin);
    return this._send('UserManagement', 'changePin', [aadhaar, oldH, newH]);
  }
}

module.exports = BlockchainSDK;