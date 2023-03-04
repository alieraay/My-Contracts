# Create Token Contract

This contract is a simple implementation of an ERC-20 token, which can be used as a basic starting point for creating your own token. The contract creates a token with the name "MyToken" and symbol "MTK", with a total supply of 1,000,000 tokens, with 18 decimal places.

## Contract Functions
__'transfer'__ : Transfer tokens from the sender's address to a specified address. The function will fail if the sender does not have enough balance, the amount to transfer is 0, the receiver is the zero address or either the sender or the receiver is blacklisted.

__'approve'__: Approves the spender to spend an amount of tokens on behalf of the sender.

__'transferFrom'__: Transfer tokens from the specified address to another specified address. This function can only be called by the spender with a sufficient allowance.

__'addBlackList'__: Adds the specified address to the blacklist. Only the contract owner can call this function.

__'removeBlackList'__: Removes the specified address from the blacklist. Only the contract owner can call this function.

## Variables
__'name'__: The name of the token.

__'symbol'__: The symbol of the token.

__'totalSupply'__: The total supply of the token, represented in the smallest possible unit (i.e., with all decimal places).

__'decimals'__: The number of decimal places to represent the token amount.

__'initialSupply'__: The initial supply of the token, represented in the smallest possible unit.

__'owner'__: The address of the contract owner.

__'balanceOf'__: The mapping that keeps track of the token balance of each address.

__'allowance'__: The mapping that keeps track of the allowance of each address.

__'blackList'__: The mapping that keeps track of the blacklisted addresses.

## License
This contract is licensed under the MIT License, which is specified at the beginning of the contract.
