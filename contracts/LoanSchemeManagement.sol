// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract LoanSchemeManagement {
    struct LoanScheme {
        string schemeData; // Loan scheme data (e.g. a JSON string)
    }
    mapping(uint256 => LoanScheme) private loanSchemes;
    uint256 private nextLoanSchemeId = 1;

    event LoanSchemeCreated(uint256 schemeId, string schemeData);
    event LoanSchemeUpdated(uint256 schemeId, string newData);

    function createLoanScheme(string calldata schemeData) external returns (uint256) {
        uint256 id = nextLoanSchemeId;
        loanSchemes[id] = LoanScheme(schemeData);
        nextLoanSchemeId++;
        emit LoanSchemeCreated(id, schemeData);
        return id;
    }

    function updateLoanScheme(uint256 schemeId, string calldata newSchemeData) external {
        require(schemeId > 0 && schemeId < nextLoanSchemeId, "Loan Scheme not exist");
        loanSchemes[schemeId].schemeData = newSchemeData;
        emit LoanSchemeUpdated(schemeId, newSchemeData);
    }

    function getLoanScheme(uint256 schemeId) external view returns (string memory) {
        require(schemeId > 0 && schemeId < nextLoanSchemeId, "Loan Scheme not exist");
        return loanSchemes[schemeId].schemeData;
    }
}