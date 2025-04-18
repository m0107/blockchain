// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 public storedData;

    // Set the value of the stored data
    function set(uint256 x) public {
        storedData = x;
    }

    // Get the value of the stored data
    function get() public view returns (uint256) {
        return storedData;
    }
}