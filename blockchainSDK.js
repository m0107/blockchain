// blockchainSDK.js

const Web3 = require('web3');
const fs = require('fs');
const path = require('path');

class BlockchainSDK {
  constructor(providerUrl, account, privateKey) {
    this.web3 = new Web3(providerUrl);
    this.account = account;
    this.privateKey = privateKey;
    this.web3.eth.accounts.wallet.add(privateKey);
    this.web3.eth.defaultAccount = account;
  }

  loadArtifact(artifactName) {
    const artifactPath = path.join(__dirname, 'abis', artifactName);
    if (!fs.existsSync(artifactPath)) {
      throw new Error(`Artifact ${artifactName} not found in abis folder`);
    }
    return JSON.parse(fs.readFileSync(artifactPath));
  }

  async deployContract(artifact, constructorArgs = []) {
    const contract = new this.web3.eth.Contract(artifact.abi);
    const deployTx = contract.deploy({
      data: artifact.bytecode,
      arguments: constructorArgs
    });
    const encodedABI = deployTx.encodeABI();
    const gasEstimate = await this.web3.eth.estimateGas({
      data: encodedABI,
      from: this.account
    });
    const nonce = await this.web3.eth.getTransactionCount(this.account, 'latest');
    const tx = {
      from: this.account,
      data: encodedABI,
      gas: gasEstimate,
      nonce: nonce
    };
    const signedTx = await this.web3.eth.accounts.signTransaction(tx, this.privateKey);
    return await this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  }

  async callContractMethod(contractAddress, abi, methodName, args = [], options = {}) {
    const contract = new this.web3.eth.Contract(abi, contractAddress);
    return await contract.methods[methodName](...args).call(options);
  }

  async sendContractMethod(contractAddress, abi, methodName, args = [], options = {}) {
    const contract = new this.web3.eth.Contract(abi, contractAddress);
    const method = contract.methods[methodName](...args);
    const encodedABI = method.encodeABI();
    const gasEstimate = await method.estimateGas({ from: this.account });
    const nonce = await this.web3.eth.getTransactionCount(this.account, 'latest');
    const tx = {
      from: this.account,
      to: contractAddress,
      data: encodedABI,
      gas: gasEstimate,
      nonce: nonce,
      ...options
    };
    const signedTx = await this.web3.eth.accounts.signTransaction(tx, this.privateKey);
    return await this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  }

  // User Module

  async createUser(aadhaar, userData) {
    const artifact = this.loadArtifact('UserManagement.json');
    if (!artifact.deployedAddress) throw new Error('UserManagement contract not deployed');
    return await this.sendContractMethod(
      artifact.deployedAddress,
      artifact.abi,
      'createUser',
      [aadhaar, JSON.stringify(userData)]
    );
  }

  async updateUser(aadhaar, newUserData) {
    const artifact = this.loadArtifact('UserManagement.json');
    if (!artifact.deployedAddress) throw new Error('UserManagement contract not deployed');
    return await this.sendContractMethod(
      artifact.deployedAddress,
      artifact.abi,
      'updateUser',
      [aadhaar, JSON.stringify(newUserData)]
    );
  }

  async getUser(aadhaar) {
    const artifact = this.loadArtifact('UserManagement.json');
    if (!artifact.deployedAddress) throw new Error('UserManagement contract not deployed');
    const data = await this.callContractMethod(
      artifact.deployedAddress,
      artifact.abi,
      'getUser',
      [aadhaar]
    );
    try {
      return JSON.parse(data);
    } catch (e) {
      return data;
    }
  }

  async changePin(oldPin, newPin) {
    const artifact = this.loadArtifact('UserManagement.json');
    if (!artifact.deployedAddress) throw new Error('UserManagement contract not deployed');
    return await this.sendContractMethod(
      artifact.deployedAddress,
      artifact.abi,
      'changePin',
      [oldPin, newPin]
    );
  }

  // Loan Module

  async createLoan(aadhaar, loanData) {
    const artifact = this.loadArtifact('LoanManagement.json');
    if (!artifact.deployedAddress) throw new Error('LoanManagement contract not deployed');
    return await this.sendContractMethod(
      artifact.deployedAddress,
      artifact.abi,
      'createLoan',
      [aadhaar, JSON.stringify(loanData)]
    );
  }

  async updateLoan(aadhaar, loanDataArray) {
    const artifact = this.loadArtifact('LoanManagement.json');
    if (!artifact.deployedAddress) throw new Error('LoanManagement contract not deployed');
    return await this.sendContractMethod(
      artifact.deployedAddress,
      artifact.abi,
      'updateLoan',
      [aadhaar, JSON.stringify(loanDataArray)]
    );
  }

  async getLoanByUser(aadhaar) {
    const artifact = this.loadArtifact('LoanManagement.json');
    if (!artifact.deployedAddress) throw new Error('LoanManagement contract not deployed');
    const data = await this.callContractMethod(
      artifact.deployedAddress,
      artifact.abi,
      'getLoanByUser',
      [aadhaar]
    );
    try {
      return JSON.parse(data);
    } catch (e) {
      return data;
    }
  }

  // Workflow Module

  async createWorkflow(workflowData) {
    const artifact = this.loadArtifact('WorkflowManagement.json');
    if (!artifact.deployedAddress) throw new Error('WorkflowManagement contract not deployed');
    const workflowID = this.web3.utils.sha3(JSON.stringify(workflowData));
    const receipt = await this.sendContractMethod(
      artifact.deployedAddress,
      artifact.abi,
      'createWorkflow',
      [workflowID, JSON.stringify(workflowData)]
    );
    return { workflowID, receipt };
  }

  async updateWorkflow(workflowID, newWorkflowData) {
    const artifact = this.loadArtifact('WorkflowManagement.json');
    if (!artifact.deployedAddress) throw new Error('WorkflowManagement contract not deployed');
    return await this.sendContractMethod(
      artifact.deployedAddress,
      artifact.abi,
      'updateWorkflow',
      [workflowID, JSON.stringify(newWorkflowData)]
    );
  }

  async getWorkflowByID(workflowID) {
    const artifact = this.loadArtifact('WorkflowManagement.json');
    if (!artifact.deployedAddress) throw new Error('WorkflowManagement contract not deployed');
    const data = await this.callContractMethod(
      artifact.deployedAddress,
      artifact.abi,
      'getWorkflowByID',
      [workflowID]
    );
    try {
      return JSON.parse(data);
    } catch (e) {
      return data;
    }
  }

  // Loan Scheme Module

  async createLoanScheme(loanSchemeData) {
    const artifact = this.loadArtifact('LoanSchemeManagement.json');
    if (!artifact.deployedAddress) throw new Error('LoanSchemeManagement contract not deployed');
    const schemeID = this.web3.utils.sha3(JSON.stringify(loanSchemeData));
    const receipt = await this.sendContractMethod(
      artifact.deployedAddress,
      artifact.abi,
      'createLoanScheme',
      [schemeID, JSON.stringify(loanSchemeData)]
    );
    return { schemeID, receipt };
  }

  async updateLoanScheme(loanSchemeID, newLoanSchemeData) {
    const artifact = this.loadArtifact('LoanSchemeManagement.json');
    if (!artifact.deployedAddress) throw new Error('LoanSchemeManagement contract not deployed');
    return await this.sendContractMethod(
      artifact.deployedAddress,
      artifact.abi,
      'updateLoanScheme',
      [loanSchemeID, JSON.stringify(newLoanSchemeData)]
    );
  }

  async getLoanBySchemeID(loanSchemeID) {
    const artifact = this.loadArtifact('LoanSchemeManagement.json');
    if (!artifact.deployedAddress) throw new Error('LoanSchemeManagement contract not deployed');
    const data = await this.callContractMethod(
      artifact.deployedAddress,
      artifact.abi,
      'getLoanBySchemeID',
      [loanSchemeID]
    );
    try {
      return JSON.parse(data);
    } catch (e) {
      return data;
    }
  }

  // Role Module

  async createRole(roleName) {
    const artifact = this.loadArtifact('RoleManagement.json');
    if (!artifact.deployedAddress) throw new Error('RoleManagement contract not deployed');
    return await this.sendContractMethod(
      artifact.deployedAddress,
      artifact.abi,
      'createRole',
      [roleName]
    );
  }

  async updateRole(roleName, newRoleData) {
    const artifact = this.loadArtifact('RoleManagement.json');
    if (!artifact.deployedAddress) throw new Error('RoleManagement contract not deployed');
    return await this.sendContractMethod(
      artifact.deployedAddress,
      artifact.abi,
      'updateRole',
      [roleName, JSON.stringify(newRoleData)]
    );
  }

  async getAllRoles() {
    const artifact = this.loadArtifact('RoleManagement.json');
    if (!artifact.deployedAddress) throw new Error('RoleManagement contract not deployed');
    const data = await this.callContractMethod(
      artifact.deployedAddress,
      artifact.abi,
      'getAllRoles',
      []
    );
    try {
      return JSON.parse(data);
    } catch (e) {
      return data;
    }
  }

  // RBAC Module

  async createRBAC(roleId, rbacData) {
    const artifact = this.loadArtifact('RBACManagement.json');
    if (!artifact.deployedAddress) throw new Error('RBACManagement contract not deployed');
    return await this.sendContractMethod(
      artifact.deployedAddress,
      artifact.abi,
      'createRBAC',
      [roleId, JSON.stringify(rbacData)]
    );
  }

  async getRBAC(roleId) {
    const artifact = this.loadArtifact('RBACManagement.json');
    if (!artifact.deployedAddress) throw new Error('RBACManagement contract not deployed');
    const data = await this.callContractMethod(
      artifact.deployedAddress,
      artifact.abi,
      'getRBAC',
      [roleId]
    );
    try {
      return JSON.parse(data);
    } catch (e) {
      return data;
    }
  }

  // Generic Data Module

  async createData(collectionName, data) {
    const artifact = this.loadArtifact('GenericDataStorage.json');
    if (!artifact.deployedAddress) throw new Error('GenericDataStorage contract not deployed');
    return await this.sendContractMethod(
      artifact.deployedAddress,
      artifact.abi,
      'createData',
      [collectionName, JSON.stringify(data)]
    );
  }

  async updateData(collectionName, documentID, data) {
    const artifact = this.loadArtifact('GenericDataStorage.json');
    if (!artifact.deployedAddress) throw new Error('GenericDataStorage contract not deployed');
    return await this.sendContractMethod(
      artifact.deployedAddress,
      artifact.abi,
      'updateData',
      [collectionName, documentID, JSON.stringify(data)]
    );
  }

  // File Storage Module

  async uploadFile(aadhaar, fileBuffer, metadata, fileId) {
    const artifact = this.loadArtifact('FileStorage.json');
    if (!artifact.deployedAddress) throw new Error('FileStorage contract not deployed');
    const fileHash = this.web3.utils.sha3(fileBuffer);
    return await this.sendContractMethod(
      artifact.deployedAddress,
      artifact.abi,
      'uploadFile',
      [aadhaar, fileId, JSON.stringify(metadata), fileHash]
    );
  }

  async readFile(fileId) {
    const artifact = this.loadArtifact('FileStorage.json');
    if (!artifact.deployedAddress) throw new Error('FileStorage contract not deployed');
    return await this.callContractMethod(
      artifact.deployedAddress,
      artifact.abi,
      'readFile',
      [fileId]
    );
  }
}

module.exports = BlockchainSDK;