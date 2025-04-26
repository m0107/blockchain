// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./RBACManager.sol";

interface IRBAC {
    function hasRole(bytes32 role, address account) external view returns (bool);
    function functionRoles(bytes4 fnSig) external view returns (bytes32);
}

interface IOTPConsumer {
    function aadhaarVerified(string calldata aadhaar) external view returns (bool);
}

contract UserManagement {
    IRBAC         public immutable rbac;
    IOTPConsumer  public immutable otpConsumer;

    struct User {
        string data;
        bytes32 pinHash;
        string docCID;
    }

    mapping(string => User) private users;

    event UserCreated(string indexed aadhaar, string data, string docCID);
    event UserUpdated(string indexed aadhaar, string data, string docCID);
    event PinChanged(string indexed aadhaar);

    constructor(address rbacManager, address _otpConsumer) {
        require(rbacManager   != address(0), "Invalid RBAC address");
        require(_otpConsumer   != address(0), "Invalid OTP address");
        rbac        = IRBAC(rbacManager);
        otpConsumer = IOTPConsumer(_otpConsumer);
    }

    modifier onlyAuthorized() {
        bytes32 required = rbac.functionRoles(msg.sig);
        require(required != bytes32(0),            "No role assigned");
        require(rbac.hasRole(required, msg.sender), "Access denied");
        _;
    }

    modifier onlyVerified(string calldata aadhaar) {
        require(otpConsumer.aadhaarVerified(aadhaar), "Aadhaar not verified");
        _;
    }

    function createUser(
        string calldata aadhaar,
        string calldata data,
        bytes32 pinHash,
        string calldata docCID
    )
        external
        onlyAuthorized
        onlyVerified(aadhaar)
    {
        require(bytes(users[aadhaar].data).length == 0, "User exists");
        users[aadhaar] = User(data, pinHash, docCID);
        emit UserCreated(aadhaar, data, docCID);
    }

    function updateUser(
        string calldata aadhaar,
        string calldata newData,
        string calldata newDocCID
    )
        external
        onlyAuthorized
    {
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
    )
        external
        onlyAuthorized
    {
        require(users[aadhaar].pinHash == oldPinHash, "Incorrect PIN");
        users[aadhaar].pinHash = newPinHash;
        emit PinChanged(aadhaar);
    }
}