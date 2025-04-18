// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract LoanManagement {
    struct Loan {
        string loanData; // For example, a JSON string with loan details
    }
    mapping(string => Loan[]) private userLoans; // Map Aadhaar to an array of loans

    event LoanCreated(string indexed aadhaar, uint256 loanIndex, string loanData);
    event LoanUpdated(string indexed aadhaar, uint256 loanIndex, string newData);

    function createLoan(string calldata aadhaar, string calldata loanData) external {
        userLoans[aadhaar].push(Loan(loanData));
        uint256 index = userLoans[aadhaar].length - 1;
        emit LoanCreated(aadhaar, index, loanData);
    }

    function updateLoan(string calldata aadhaar, uint256 index, string calldata newLoanData) external {
        require(index < userLoans[aadhaar].length, "Invalid loan index");
        userLoans[aadhaar][index].loanData = newLoanData;
        emit LoanUpdated(aadhaar, index, newLoanData);
    }

    function getLoansByUser(string calldata aadhaar) external view returns (Loan[] memory) {
        return userLoans[aadhaar];
    }
}