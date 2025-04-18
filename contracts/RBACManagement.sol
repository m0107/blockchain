// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract RBACManagement {
    // For simplicity we store the RBAC as a JSON string.
    string private rbacData;

    event RBACUpdated(string newData);

    function setRBAC(string calldata data) external {
        rbacData = data;
        emit RBACUpdated(data);
    }

    function getRBAC() external view returns (string memory) {
        return rbacData;
    }
}