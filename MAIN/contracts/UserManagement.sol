// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IRBAC {
    function hasRole(bytes32 role, address account) external view returns (bool);
}

contract UserManagement {
    IRBAC public immutable rbac;
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    struct User {
        string data;
        bytes32 pinHash;
        string docCID;
    }

    mapping(string => User) private users;

    event UserCreated(string indexed aadhaar, string data, string docCID);
    event UserUpdated(string indexed aadhaar, string data, string docCID);
    event PinChanged(string indexed aadhaar);

    constructor(address rbacManager) {
        require(rbacManager != address(0), "Invalid RBAC address");
        rbac = IRBAC(rbacManager);
    }

    modifier onlyAdmin() {
        require(rbac.hasRole(ADMIN_ROLE, msg.sender), "Restricted to admins");
        _;
    }

    function createUser(
        string calldata aadhaar,
        string calldata data,
        bytes32 pinHash,
        string calldata docCID
    ) external onlyAdmin {
        require(bytes(users[aadhaar].data).length == 0, "User exists");
        users[aadhaar] = User(data, pinHash, docCID);
        emit UserCreated(aadhaar, data, docCID);
    }

    function updateUser(
        string calldata aadhaar,
        string calldata newData,
        string calldata newDocCID
    ) external onlyAdmin {
        require(bytes(users[aadhaar].data).length != 0, "User missing");
        users[aadhaar].data   = newData;
        users[aadhaar].docCID = newDocCID;
        emit UserUpdated(aadhaar, newData, newDocCID);
    }

    function getUser(string calldata aadhaar)
        external
        view
        returns (string memory, bytes32, string memory)
    {
        User memory u = users[aadhaar];
        require(bytes(u.data).length != 0, "User missing");
        return (u.data, u.pinHash, u.docCID);
    }

    function changePin(
        string calldata aadhaar,
        bytes32 oldPinHash,
        bytes32 newPinHash
    ) external onlyAdmin {
        require(users[aadhaar].pinHash == oldPinHash, "Incorrect PIN");
        users[aadhaar].pinHash = newPinHash;
        emit PinChanged(aadhaar);
    }
}