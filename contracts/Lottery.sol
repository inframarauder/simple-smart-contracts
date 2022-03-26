// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Lottery{
    address manager;
    address[] players;

    constructor(){
        manager = msg.sender;
    }

    modifier restricted(){
        require(msg.sender == manager ,"Only manager can call this method");
        _;
    }

    function getManager() public view returns(address){
        return manager;
    }

    function getPlayers() public view returns(address[] memory){
        return players;
    }

    function enterLottery() public payable {
        require(msg.sender != manager,"Manager cant enter lottery"); 
        require(msg.value >= 100 wei,"Minimum 100 wei needed to enter"); 
        
        players.push(msg.sender); 
    }

     function getPrizePool() public view returns(uint){
        return address(this).balance;
    }

    function random() private view returns(uint){
       return uint(sha256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }

    function pickWinner() public restricted {
        uint prizePool = getPrizePool();
        uint index = random() %  players.length;
        address payable winner = payable(players[index]);
        winner.transfer(prizePool);
        players = new address[](0);
    }
}