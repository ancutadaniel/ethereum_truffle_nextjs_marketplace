// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract CourseMarketplace {
    uint256 private totalOwnedCourses;
    address payable private owner;

    constructor() {
        setContractOwner(msg.sender);
    }

    enum State {
        Purchased,
        Activated,
        Dezactivated
    }

    struct Course {
        uint256 id; // 32 bytes
        uint256 price; // 32 bytes
        bytes32 proof; // 32 bytes
        address owner; // 20 bytes
        State state; // 1 byte
    }

    // 1. mapping of courses hashed to course details
    mapping(bytes32 => Course) private ownedCourse;

    // 2. mapping of courseId to courseHash
    mapping(uint256 => bytes32) private ownedCourseHash;

    modifier onlyOwner() {
        require(owner == msg.sender, "You are not the owner");
        _;
    }

    function purchaseCourse(bytes16 _courseId, bytes32 _proof)
        external
        payable
    {
        bytes32 courseHash = keccak256(abi.encodePacked(_courseId, msg.sender));
        require(!hasCourseOwnership(courseHash), "You already own this course");
        uint256 id = totalOwnedCourses++;
        ownedCourseHash[id] = courseHash;
        ownedCourse[courseHash] = Course(
            id,
            msg.value,
            _proof,
            msg.sender,
            State.Purchased
        );
    }

    function transferOwnership(address _newOwner) external onlyOwner {
        setContractOwner(_newOwner);
    }

    function getCourseCount() external view returns (uint256) {
        return totalOwnedCourses;
    }

    function getCourseById(uint256 _id) external view returns (bytes32) {
        return ownedCourseHash[_id];
    }

    function getCourseByHash(bytes32 _hash)
        external
        view
        returns (Course memory)
    {
        return ownedCourse[_hash];
    }

    function getContractOwner() public view returns (address) {
        return owner;
    }

    function setContractOwner(address _newOwner) private {
        owner = payable(_newOwner);
    }

    function hasCourseOwnership(bytes32 courseHash)
        private
        view
        returns (bool)
    {
        return ownedCourse[courseHash].owner == msg.sender;
    }
}

// TEST DATA
// CourseId: 0x00000000000000000000000000003130
// Address: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4s
// Proof: 0x0000000000000000000000000000313000000000000000000000000000003130
