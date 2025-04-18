// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract RoleManagement {
    struct Role {
        string roleName;
    }
    mapping(uint256 => Role) private roles;
    uint256 private nextRoleId = 1;

    event RoleCreated(uint256 roleId, string roleName);
    event RoleUpdated(uint256 roleId, string newRoleName);

    function createRole(string calldata roleName) external returns (uint256) {
        uint256 id = nextRoleId;
        roles[id] = Role(roleName);
        nextRoleId++;
        emit RoleCreated(id, roleName);
        return id;
    }

    function updateRole(uint256 roleId, string calldata newRoleName) external {
        require(roleId > 0 && roleId < nextRoleId, "Role does not exist");
        roles[roleId].roleName = newRoleName;
        emit RoleUpdated(roleId, newRoleName);
    }

    function getAllRoles() external view returns (Role[] memory) {
        Role[] memory roleArray = new Role[](nextRoleId - 1);
        for (uint256 i = 1; i < nextRoleId; i++) {
            roleArray[i - 1] = roles[i];
        }
        return roleArray;
    }
}