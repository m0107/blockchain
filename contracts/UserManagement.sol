// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract UserManagement {
    struct User {
        string data;      // JSON string or any user data
        bytes32 pinHash;  // hashed PIN value
    }

    // mapping by Aadhaar number (as a string)
    mapping(string => User) private users;

    event UserCreated(string indexed aadhaar, string data);
    event UserUpdated(string indexed aadhaar, string data);
    event PinChanged(string indexed aadhaar);

    /// @notice Create a new user.
    function createUser(
        string calldata aadhaar,
        string calldata data,
        bytes32 pinHash
    ) external {
        require(bytes(users[aadhaar].data).length == 0, "User already exists");
        users[aadhaar] = User(data, pinHash);
        emit UserCreated(aadhaar, data);
    }

    /// @notice Update user data.
    function updateUser(
        string calldata aadhaar,
        string calldata newData
    ) external {
        require(bytes(users[aadhaar].data).length != 0, "User does not exist");
        users[aadhaar].data = newData;
        emit UserUpdated(aadhaar, newData);
    }

    /// @notice Retrieve user info.
    function getUser(
        string calldata aadhaar
    ) external view returns (string memory, bytes32) {
        require(bytes(users[aadhaar].data).length != 0, "User does not exist");
        User memory u = users[aadhaar];
        return (u.data, u.pinHash);
    }
    
    /// @notice Change the user PIN.
    function changePin(
        string calldata aadhaar,
        bytes32 oldPinHash,
        bytes32 newPinHash
    ) external {
        require(users[aadhaar].pinHash == oldPinHash, "Incorrect old PIN");
        users[aadhaar].pinHash = newPinHash;
        emit PinChanged(aadhaar);
    }
}