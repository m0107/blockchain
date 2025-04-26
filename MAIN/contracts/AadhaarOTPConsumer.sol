// contracts/AadhaarOTPConsumer.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

/// @notice Chainlink‐backed on‐chain Aadhaar OTP consumer
contract AadhaarOTPConsumer is ChainlinkClient {
    using Chainlink for Chainlink.Request;

    address public immutable oracle;
    bytes32 public immutable jobId;
    uint256 public immutable fee;

    mapping(bytes32 => string) public pendingAadhaar;
    mapping(string => bool)   public aadhaarVerified;

    event LogRequestOTP(bytes32 indexed requestId, string aadhaar);
    event LogReceiveOTP(bytes32 indexed requestId, string aadhaar, bytes32 otp);

    constructor(
        address linkToken,
        address _oracle,
        bytes32 _jobId,
        uint256 _fee
    ) {
        // v1.0.0 client setters
        _setChainlinkToken(linkToken);
        _setChainlinkOracle(_oracle);
        oracle = _oracle;
        jobId  = _jobId;
        fee    = _fee;
    }

    /// @notice Kick off the OTP request via your RunLog job
    function requestOtp(string calldata aadhaar) external returns (bytes32) {
        Chainlink.Request memory req = _buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfill.selector
        );
        // this helper definitely exists in v1.0.0
        req._add("aadhaar", aadhaar);
        bytes32 requestId = _sendChainlinkRequestTo(oracle, req, fee);
        pendingAadhaar[requestId] = aadhaar;
        emit LogRequestOTP(requestId, aadhaar);
        return requestId;
    }

    /// @notice Called by Chainlink node with the OTP
    function fulfill(bytes32 requestId, bytes32 otp)
        public
        recordChainlinkFulfillment(requestId)
    {
        string memory a = pendingAadhaar[requestId];
        aadhaarVerified[a] = true;
        emit LogReceiveOTP(requestId, a, otp);
    }
}