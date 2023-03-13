// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract CourseMarketplace {
    uint256 private totalOwnedCourses;
    address payable private owner;
    bool public isStoped = false;

    constructor() {
        setContractOwner(msg.sender);
    }

    enum State {
        Purchased,
        Activated,
        Deactivated
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

    modifier contractActive() {
        require(!isStoped, "Contract is stopped");
        _;
    }
    
    modifier contractNotActive() {
        require(isStoped, "Contract is stopped");
        _;
    }

    receive() external payable {}

    function  withdraw(uint _amount) external onlyOwner {
        require(_amount <= address(this).balance, "Insufficient balance");
        (bool success, ) = payable(msg.sender).call{value: _amount}("");
        require(success, "Transfer failed.");            
    }

    function  emergencyWithdraw() external onlyOwner contractNotActive  {        
        (bool success, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(success, "Transfer failed.");            
    }

    function selfDestruct() external onlyOwner contractNotActive {
        selfdestruct(payable(msg.sender));
    }

    function stopContract() external onlyOwner {
        isStoped = true;
    }

    function startContract() external onlyOwner {
        isStoped = false;
    }

    function purchaseCourse(bytes16 _courseId, bytes32 _proof)
        external
        payable
        contractActive
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

    function repurchaseCourse(bytes32 _courseHash) external payable contractActive {
        require(
            ownedCourse[_courseHash].owner != address(0),
            "Course is not created"
        );
        require(hasCourseOwnership(_courseHash), "You do not own this course");
        require(
            ownedCourse[_courseHash].state == State.Deactivated,
            "Course has invalid state"
        );

        ownedCourse[_courseHash].state = State.Purchased;
        ownedCourse[_courseHash].price = msg.value;
    }

    function activateCourse(bytes32 _courseHash) external onlyOwner contractActive {
        require(
            ownedCourse[_courseHash].state == State.Purchased,
            "Course has invalid state"
        );
        require(
            ownedCourse[_courseHash].owner != address(0),
            "Course is not created"
        );
        ownedCourse[_courseHash].state = State.Activated;
        ownedCourse[_courseHash].price = 0;
    }

    function deactivateCourse(bytes32 _courseHash) external onlyOwner contractActive {
        require(
            ownedCourse[_courseHash].state == State.Purchased,
            "Course has invalid state"
        );
        require(
            ownedCourse[_courseHash].owner != address(0),
            "Course is not created"
        );

        address payable courseOwner = payable(ownedCourse[_courseHash].owner);
        uint256 coursePrice = ownedCourse[_courseHash].price;
        courseOwner.transfer(coursePrice);

        ownedCourse[_courseHash].state = State.Deactivated;
        ownedCourse[_courseHash].price -= coursePrice;
    }

    function transferOwnership(address _newOwner) external onlyOwner {
        setContractOwner(_newOwner);
    }

    function getCourseCount() external view returns (uint256) {
        return totalOwnedCourses;
    }

    function getCourseByIdx(uint256 _idx) external view returns (bytes32) {
        return ownedCourseHash[_idx];
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
