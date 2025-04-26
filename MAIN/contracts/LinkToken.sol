// contracts/LinkToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import the ERC-677-compatible LINK implementation from Chainlink's npm package
import { LinkToken as ChainlinkLinkToken } from "@chainlink/contracts/src/v0.8/tests/LinkToken.sol";

/// @title Mock LINK token for local Chainlink testing
/// @notice This token implements ERC-677 `transferAndCall`, enabling Chainlink requests
contract LinkToken is ChainlinkLinkToken {
    // The imported ChainlinkLinkToken contract's constructor already mints 1M LINK
    // to the deployer, so no additional code is needed.
}
