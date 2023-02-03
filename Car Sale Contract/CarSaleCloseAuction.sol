// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


// This contract allows customers to submit offers, and if the offer meets the minimum sales amount, the car sale transaction will be completed.
contract CarSaleCloseAuction {

// The owner of the car is the owner who will deploy the contract
    address payable owner;
// Winner of auction
    address  whoGetsCar;
// The minimum amount required to win the right to buy the car.
    uint256 offer = 5 ether;
// A variable that is kept to know and index the number of offers made.
    uint256 offerCount = 0;

    constructor()  {
        owner = payable(msg.sender);
    }
// The offerSenders mapping is used to keep track of which address is at which index.
    mapping(uint256 => address) offerSenders;
// The offerPrices mapping keeps track of how much each address has offered. 
    mapping(address => uint256) offerPrices;
    
// The getOffer function is used to receive an offer. The offerCount is incremented by 1 each time an offer is received.
    function getOffer(uint256 _getOffer) public {
        require(_getOffer >= offer,"insufficent offer for buying the car");
        offerSenders[offerCount] = msg.sender;
        offerPrices[msg.sender] = _getOffer;
        offerCount++;
        
    }
// The owner, who is managing the sale, evaluates the offers received at any time and grants the right to purchase to the highest offer.
    function acceptOffer() public returns(address, uint256) {
        address winner;
        uint256 winner_price;
        for(uint256 i=0; i < offerCount; i++ ){
            if(offerPrices[offerSenders[i]] > winner_price ){
                winner = offerSenders[i];
                winner_price = offerPrices[winner];
            }
        }
        whoGetsCar=winner;
        return (winner,winner_price);
    }

// The buyer who wins the right to purchase the car sends the money to the owner specifying the amount offered.
    function giveMoneyGetCar() public payable returns(bool){
        require(msg.sender== whoGetsCar,"You are not eligible for buying the car");
        require(offerPrices[whoGetsCar] == msg.value,"That's a different price than you offered ");
        owner.transfer(msg.value);
        return true;

    }
}
