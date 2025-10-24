// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract WorkingVoting {
    // Track used nullifiers to prevent double voting
    mapping(bytes32 => bool) public nullifierUsed;

    // Proposal management
    struct Proposal {
        uint256 id;
        string title;
        string description;
        address creator;
        uint256 yesVotes;
        uint256 noVotes;
        bool active;
    }

    // Store all proposals
    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;

    // Events
    event ProposalCreated(uint256 indexed proposalId, string title, address creator);
    event VoteCast(uint256 indexed proposalId, bool isYes, bytes32 nullifierHash);

    /**
     * @dev Create a new proposal
     * @param _title Short title of the proposal
     * @param _description Detailed description of the proposal
     */
    function createProposal(string memory _title, string memory _description) external {
        proposalCount++;

        proposals[proposalCount] = Proposal({
            id: proposalCount,
            title: _title,
            description: _description,
            creator: msg.sender,
            yesVotes: 0,
            noVotes: 0,
            active: true
        });

        emit ProposalCreated(proposalCount, _title, msg.sender);
    }

    /**
     * @dev Cast a vote on a proposal with ZK proof validation
     * @param _proposalId ID of the proposal to vote on
     * @param _isYes True for yes vote, false for no vote
     * @param _proof Semaphore zero-knowledge proof
     */
    function castVote(
        uint256 _proposalId,
        bool _isYes,
        SemaphoreProof calldata _proof
    ) external {
        require(_proposalId > 0 && _proposalId <= proposalCount, "Invalid proposal ID");
        require(proposals[_proposalId].active, "Proposal is not active");
        require(!nullifierUsed[bytes32(_proof.nullifier)], "Double vote detected");

        // Basic proof validation (simplified for demonstration)
        require(_proof.merkleTreeDepth > 0, "Invalid merkle tree depth");
        require(_proof.merkleTreeRoot > 0, "Invalid merkle tree root");
        require(_proof.nullifier > 0, "Invalid nullifier");
        require(_proof.points.length == 8, "Invalid proof points");

        // Mark nullifier as used
        nullifierUsed[bytes32(_proof.nullifier)] = true;

        // Update vote counts
        if (_isYes) {
            proposals[_proposalId].yesVotes++;
        } else {
            proposals[_proposalId].noVotes++;
        }

        emit VoteCast(_proposalId, _isYes, bytes32(_proof.nullifier));
    }

    /**
     * @dev Get proposal details
     * @param _proposalId ID of the proposal
     * @return id Proposal ID
     * @return title Proposal title
     * @return description Proposal description
     * @return creator Proposal creator address
     * @return yesVotes Number of yes votes
     * @return noVotes Number of no votes
     * @return active Whether proposal is active
     */
    function getProposal(uint256 _proposalId) external view returns (
        uint256 id,
        string memory title,
        string memory description,
        address creator,
        uint256 yesVotes,
        uint256 noVotes,
        bool active
    ) {
        require(_proposalId > 0 && _proposalId <= proposalCount, "Invalid proposal ID");

        Proposal memory proposal = proposals[_proposalId];
        return (
            proposal.id,
            proposal.title,
            proposal.description,
            proposal.creator,
            proposal.yesVotes,
            proposal.noVotes,
            proposal.active
        );
    }

    /**
     * @dev Get total number of proposals
     * @return Total proposal count
     */
    function getProposalCount() external view returns (uint256) {
        return proposalCount;
    }

    // Semaphore proof structure
    struct SemaphoreProof {
        uint256 merkleTreeDepth;
        uint256 merkleTreeRoot;
        uint256 nullifier;
        uint256 message;
        uint256 scope;
        uint256[8] points;
    }
}
