// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@semaphore-protocol/contracts/Semaphore.sol";
import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";

contract Voting {
    ISemaphore public semaphore;
    mapping(bytes32 => bool) public nullifierUsed;

    event VoteReceived(uint256 indexed proposalId, bytes32 nullifierHash, string signal);

    constructor(address _semaphoreAddress) {
        semaphore = ISemaphore(_semaphoreAddress);
    }

    function castVote(
        uint256 groupId,
        ISemaphore.SemaphoreProof calldata proof
    ) external {
        require(!nullifierUsed[bytes32(proof.nullifier)], "Double vote");
        semaphore.validateProof(groupId, proof);
        nullifierUsed[bytes32(proof.nullifier)] = true;
        emit VoteReceived(groupId, bytes32(proof.nullifier), string(abi.encodePacked(proof.message)));
    }
}
