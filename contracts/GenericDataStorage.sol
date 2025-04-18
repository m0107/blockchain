// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract GenericDataStorage {
    // This is a simple key/value storage for arbitrary data.
    mapping(string => string) private genericData;

    event GenericDataCreated(string collection, string data);
    event GenericDataUpdated(string collection, string newData);

    function createData(string calldata collectionName, string calldata data) external {
        genericData[collectionName] = data;
        emit GenericDataCreated(collectionName, data);
    }

    function updateData(string calldata collectionName, string calldata newData) external {
        genericData[collectionName] = newData;
        emit GenericDataUpdated(collectionName, newData);
    }

    function getData(string calldata collectionName) external view returns (string memory) {
        return genericData[collectionName];
    }
}