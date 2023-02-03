# Car-Sale-Contract


This contract is called CarSaleCloseAuction, it allows customers to submit offers to buy a car and if the offer meets the minimum sales amount set by the owner, the car sale transaction will be completed. The owner of the contract is the person who deploys the contract, and they have the ability to evaluate offers and grant the right to purchase to the highest offer.

The contract has a few key features:

* The owner of the car is the person who deploys the contract, and they are the only one who can accept offers and decide the winner of the auction.
* The minimum amount required to win the right to buy the car is set at 5 ether, but it can be changed by the owner as they see fit.
* There's a variable called offerCount which keeps track of how many offers have been made so far.
* The contract uses two mappings, offerSenders and offerPrices, to keep track of which address made an offer, and at what price.
* The getOffer function allows customers to submit an offer, it increments the offerCount by 1 each time an offer is received, and it also stores the offer's sender address and the offer price in the appropriate mappings.
* The acceptOffer function is used by the owner to evaluate all the offers received, it returns the address and the price of the winner.
* The giveMoneyGetCar function allows the winner to transfer the money to the owner and in exchange, get the car. This function checks whether the msg.sender is the winner, and also checks if the amount sent is equal to the offer price.

Overall, this contract provides a simple and secure way for customers to submit offers to buy a car, and for the owner to evaluate offers and decide the winner of the auction.
