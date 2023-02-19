 
// This code is not complete. I will work on it. It may contain many conflicts and errors.

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract  TokenXYZ is ERC20, Ownable {
    uint256 public constant initialSupply = 1000000 * 10 ** 18;
    uint256 public constant tokenPrice = 1 ether;
    uint256 public constant saleDuration = 5 minutes;
    uint256 public constant transferDuration = saleDuration/2;
    uint256 public remainSupply;
    uint256 public startTime;
    uint256 public endTime;

    address payable public fundAddress;

    bool public saleClosed;
    bool public transferClosed;

    mapping(address => uint256) reservationCount;

    constructor() ERC20("XYZ TOKEN","XYZ"){
        _mint(msg.sender, initialSupply);
        fundAddress = payable(0xdD870fA1b7C4700F2BD7f44238821C26f7392148);
        saleClosed = false;
        transferClosed = true;
        remainSupply = totalSupply();
        _transferOwnership(msg.sender);
    }

    function startSale() public onlyOwner {
        require(!saleClosed,"Sale already closed");
        startTime = block.timestamp;
        endTime = startTime + saleDuration;
    }

    function startTransfer() public onlyOwner {
        require(!saleClosed,"Sale already closed");
        require(block.timestamp > endTime - transferDuration,"Transfer closed,");
        transferClosed = false;
    }

    function endSale() public onlyOwner {
        require(!saleClosed,"Sale already closed");
        require(block.timestamp >= endTime,"Sale time doesn't end yet");
        saleClosed = true;
        transferClosed = true;
    }

    function buyTokens() public payable {

        require(!saleClosed,"Sale is over");
        require(msg.value == tokenPrice, "Value must be 1 ether");
        require(remainSupply > 0,"All tokens have been sold");

        reservationCount[msg.sender] += 1;
        fundAddress.transfer(msg.value);
        if(block.timestamp > endTime-transferDuration){
            transferTokens();
        }
        remainSupply -= 1;
    }

    function transferTokens() public  {
        require(!transferClosed,"Transfer closed");
        require(reservationCount[msg.sender] >= 1,"You have not a token");

        _transfer(owner(), msg.sender, reservationCount[msg.sender]);
        reservationCount[msg.sender] = 0;
    }
    
    function burnRemain() public onlyOwner {
        require(saleClosed && transferClosed,"Wait a little bit more!");
        _burn(owner(), balanceOf(owner()));
    }

    function getBalance() public view returns (uint256) {
        return balanceOf(msg.sender);
    }
}
