// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract CourseMarketplace {
    string public name;

    enum State { 
        Purchased,
        Activated,
        Dezactivated
    }

    struct Course {
        uint id; // 32 bytes
        uint price; // 32 bytes
        bytes32 proof; // 32 bytes
        address owner; // 20 bytes
        State state; // 1 byte
    }
    
  
}