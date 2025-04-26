// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title Dynamic RBAC Manager
contract RBACManager is AccessControl {
    bytes32 public constant ADMIN_ROLE  = keccak256("ADMIN_ROLE");
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");

    mapping(bytes32 => bytes32) public roleAdmins;
    mapping(bytes4  => bytes32) public functionRoles;

    event RoleCreated(bytes32 indexed role, bytes32 indexed adminRole);
    event FunctionRoleAssigned(bytes4 indexed fnSig, bytes32 indexed role);

    constructor(address initialAdmin) {
        require(initialAdmin != address(0), "Invalid admin");
        _setupRole(DEFAULT_ADMIN_ROLE, initialAdmin);
        _setRoleAdmin(ADMIN_ROLE, DEFAULT_ADMIN_ROLE);
        _setupRole(ADMIN_ROLE, initialAdmin);
        roleAdmins[ADMIN_ROLE] = ADMIN_ROLE;
    }

    /// @notice Define a new role under an existing admin role
    function createRole(string calldata roleName, string calldata adminRoleName)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        bytes32 roleHash      = keccak256(bytes(roleName));
        bytes32 adminRoleHash = keccak256(bytes(adminRoleName));
        require(
            adminRoleHash == DEFAULT_ADMIN_ROLE || roleAdmins[adminRoleHash] != bytes32(0),
            "Admin role undefined"
        );
        roleAdmins[roleHash] = adminRoleHash;
        _setRoleAdmin(roleHash, adminRoleHash);
        emit RoleCreated(roleHash, adminRoleHash);
    }

    /// @notice Grant a role by its name
    function grantRoleByName(string calldata roleName, address account)
        external
    {
        bytes32 roleHash      = keccak256(bytes(roleName));
        bytes32 adminRoleHash = roleAdmins[roleHash];
        require(hasRole(adminRoleHash, msg.sender), "Unauthorized admin");
        _grantRole(roleHash, account);
    }

    /// @notice Map a function selector to a role
    function assignFunctionRole(string calldata roleName, bytes4 fnSig)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        bytes32 roleHash = keccak256(bytes(roleName));
        require(roleAdmins[roleHash] != bytes32(0), "Role undefined");
        functionRoles[fnSig] = roleHash;
        emit FunctionRoleAssigned(fnSig, roleHash);
    }
}