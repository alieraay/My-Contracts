// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyENS {

    mapping(string => address) names;
    mapping(address => string) addr;
    mapping(address => uint256) nameCount;


    function register(string memory _name) public payable {
        require(nameCount[msg.sender] == 0,"You have already a name");
        require(names[_name] == address(0),"this name is not unique" );
        names[_name] = msg.sender;
        addr[msg.sender] = _name;
        nameCount[msg.sender] = 1;
    }
    function update(string memory _name, string memory _newName) public payable {
        require(names[_name] == msg.sender);
        require(names[_newName] == address(0),"this name is not unique");
        
        delete(names[_name]);
        delete(addr[msg.sender]);
        names[_newName] = msg.sender;
        addr[msg.sender] = _newName;
    }
    function myNameIs() public view returns(string memory){
        return addr[msg.sender];
    }
    
}
