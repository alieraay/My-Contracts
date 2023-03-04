// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CreateToken {

    string public name;
    string public symbol;
    uint256 public totalSupply;
    uint256 public decimals;
    uint256 public initialSupply;
    address public owner;

    modifier onlyOwner(){
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    mapping(address => bool) public blackList;

    event Transfer(address indexed _from, address _to, uint256 _amount);

    constructor() {
        name = "MyToken";
        symbol = "MTK";
        totalSupply = 1000000 * 10 ** 18;
        decimals= 18;
        initialSupply = 1000000 * 10 ** 18;
        owner = msg.sender;
        balanceOf[owner] = initialSupply;

        emit Transfer(address(0), owner, initialSupply);
    }

    function transfer(address _to, uint256 _amount) public returns(bool) {
        require(balanceOf[msg.sender] >= _amount,"Insufficient balance");
        require(_amount > 0,"Amount has to be more than 0");
        require(_to != address(0),"Invalid receiver");
        require(!blackList[msg.sender],"Black listed sender");
        require(!blackList[_to],"Black listed receiver");

        balanceOf[msg.sender] -= _amount;
        balanceOf[_to] += _amount;

        emit Transfer(msg.sender, _to, _amount);
        return true;
    }

    function approve(address _spender, uint256 _amount) public returns(bool) {
        require(_spender != address(0),"Invalid address");
        allowance[msg.sender][_spender] = _amount;
        return true;
    }
    function transferFrom(address _from, address _to, uint256 _amount) public returns(bool) {
        require(balanceOf[_from] >= _amount);
        require(_amount > 0,"Amount has to be more than 0");
        require(_to != address(0),"Invalid receiver");
        require(!blackList[_from],"Black listed sender");
        require(!blackList[_to],"Black listed receiver");
        require(allowance[_from][msg.sender] >= _amount,"Insufficient allowance");

        balanceOf[_from] -= _amount;
        balanceOf[_to] += _amount;
        allowance[_from][msg.sender] -= _amount;
        
        emit Transfer(_from, _to, _amount);
        return true;
    }

    function addBlackList(address _blckAddr) public onlyOwner {
        blackList[_blckAddr] = true;
    }
    function removeBlackList(address _removeBlckAddr) public onlyOwner {
        blackList[_removeBlckAddr] = false;
    }
}
