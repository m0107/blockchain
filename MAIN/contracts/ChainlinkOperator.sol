// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@chainlink/contracts/src/v0.8/operatorforwarder/Operator.sol";

contract ChainlinkOperator is Operator {
    constructor(address linkToken, address admin)
        Operator(linkToken, admin)
    {}
}
