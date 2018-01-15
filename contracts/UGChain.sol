pragma solidity ^0.4.8;

import "./Multiowned.sol";

contract UGChain is Multiowned {

    event Freeze(address from, uint256 value);
    event Defreeze(address ownerAddr, uint256 amount);
    event ReturnToOwner(address ownerAddr, uint256 amount);
    event Deposit(address ownerAddr, uint256 amount);
    event HandleFreeze(address ownerAddr, uint256 value, uint256 fee);

    function UGChain() public Multiowned() {

    }

    function() public {

    }

    function deposit() payable onlyOwner external returns (bool success) {
        ownersDeposit[msg.sender] += msg.value;
        Deposit(msg.sender, msg.value);
        return true;
    }

    function freeze(uint256 _fee) payable external returns (bool success) {
        require(_fee > 0 && _fee < msg.value);
        userFreeze[msg.sender].fee += _fee;
        userFreeze[msg.sender].value += msg.value;
        Freeze(msg.sender, msg.value);
        return true;
    }

    function handleFreeze(address _userAddr, address _ugcOwnerAddr) onlyOwner external {
        require(userFreeze[_userAddr].fee > 0);
        uint256 value = userFreeze[_userAddr].value; //TODO event
        uint256 fee = userFreeze[_userAddr].fee;
        if(_ugcOwnerAddr.send(fee)) {
            userFreeze[_userAddr].fee = 0;
            userFreeze[_userAddr].value = 0;
            //userFreeze[_userAddr].ownerAddr = msg.sender; //TODO need to think more...
        }
        HandleFreeze(msg.sender, value, fee);
    }
    
    function defreeze(bytes32 _txId, address _userAddr) payable onlyOwner external returns (bool success) {
        require(msg.value > 0);
        require(txHistory[_txId] == 0);
        if(_userAddr.send(msg.value)) {
            txHistory[_txId] = msg.sender;
            ownersLoan[msg.sender] += msg.value;
            Defreeze(msg.sender, msg.value);
            return true;
        }
        return false;
    }

    function returnToOwner(address _ownerAddr, uint256 _amount) onlyManyOwners(keccak256(msg.data)) external returns (bool success) {
        require(isOwner(_ownerAddr));
        require(ownersLoan[_ownerAddr] >= _amount);
        if(_ownerAddr.send(_amount)) {
            ownersLoan[_ownerAddr] -= _amount;
            ReturnToOwner(_ownerAddr, _amount);
            return true;
        }
        return false;
    }

    function getOwnersLoan(address _ownerAddr) view public returns (uint256) {
        return ownersLoan[_ownerAddr]; //TODO
    }

    function getOwnersDeposit(address _ownerAddr) view public returns (uint256) {
        return ownersDeposit[_ownerAddr];
    }

    struct FeeAndValue {
        uint256 fee;
        uint256 value;
        //address ownerAddr;
    }

    //string public name = "UG Chain";
    mapping (address => FeeAndValue) userFreeze;
    mapping (address => uint256) ownersLoan;
    mapping (address => uint256) ownersDeposit;   
    mapping (bytes32 => address) txHistory;

    //TODO byte32???? string???? which one should be used ???
}







