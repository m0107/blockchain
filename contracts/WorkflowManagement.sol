// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract WorkflowManagement {
    struct Workflow {
        string data;       // Workflow JSON data
        bytes32 workflowId; // Workflow identifier (hash)
    }
    mapping(bytes32 => Workflow) private workflows;

    event WorkflowCreated(bytes32 indexed workflowId, string data);
    event WorkflowUpdated(bytes32 indexed workflowId, string newData);

    function createWorkflow(string calldata data) external returns (bytes32) {
        bytes32 workflowId = keccak256(abi.encodePacked(data, msg.sender, block.timestamp));
        workflows[workflowId] = Workflow(data, workflowId);
        emit WorkflowCreated(workflowId, data);
        return workflowId;
    }

    function updateWorkflow(bytes32 workflowId, string calldata newData) external {
        require(workflows[workflowId].workflowId != 0, "Workflow does not exist");
        workflows[workflowId].data = newData;
        emit WorkflowUpdated(workflowId, newData);
    }

    function getWorkflowById(bytes32 workflowId) external view returns (string memory) {
        require(workflows[workflowId].workflowId != 0, "Workflow does not exist");
        return workflows[workflowId].data;
    }
}