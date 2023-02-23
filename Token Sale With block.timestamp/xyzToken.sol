
// This code is not complete. I will work on it. It may contain many conflicts and errors.

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract  TokenXYZ is ERC20, Ownable {
    uint256 public constant tokenPrice = 1 ether;
    uint256 public constant saleDuration = 5 minutes;
    uint256 public constant transferDuration = saleDuration/2;
    uint256 public remainSupply = 1000000 * 10 ** 18;
    uint256 public startTime;
    uint256 public endTime;
    
    address payable public fundAddress;

    bool public saleOpen;
    bool public transferClosed;
    bool public noMoreSales;

    mapping(address => uint256) reservationCount;

    constructor() Ownable() ERC20("XYZ TOKEN","XYZ") {
        
        fundAddress = payable(0xdD870fA1b7C4700F2BD7f44238821C26f7392148);
        saleOpen = false;
        transferClosed = true;
        noMoreSales = false;
    
    }

    function startSale() public onlyOwner {
        require(!saleOpen,"Sale has already started");
        require(!noMoreSales,"No more sales");
        startTime = block.timestamp;
        endTime = startTime + saleDuration;
        saleOpen = true;
    }

    function startTransfer() public onlyOwner {
        require(saleOpen,"Sale closed");
        require(block.timestamp > endTime - transferDuration,"Transfer closed,");
        transferClosed = false;
    }

    function endSale() public onlyOwner {
        require(saleOpen,"Sale closed");
        require(block.timestamp >= endTime,"Sale time doesn't end yet");
        saleOpen = false;
        transferClosed = true;
        noMoreSales = true;
    }

    function buyTokens() public payable {

        require(saleOpen,"Sale is over");
        require(remainSupply > 0);
        require(msg.value == tokenPrice, "Value must be 1 ether");
        _mint(owner(), 1);
        remainSupply -= 1;
        reservationCount[msg.sender] += 1;
        fundAddress.transfer(msg.value);
        if(block.timestamp > endTime-transferDuration){
            transferTokens();
        }
    }

    function transferTokens() public  {
        require(!transferClosed,"Transfer closed");
        require(reservationCount[msg.sender] >= 1,"You have not a token");

        _transfer(owner(), msg.sender, reservationCount[msg.sender]);
        reservationCount[msg.sender] = 0;
    }
    
    function burnRemain() public onlyOwner {
        require(!saleOpen && transferClosed,"Wait a little bit more!");
        _burn(owner(), balanceOf(owner()));
    }
}
