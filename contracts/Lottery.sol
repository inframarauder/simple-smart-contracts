// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Lottery{
    address manager; 
    address[] players;
    string lotteryId;
    mapping(string => address) lotteryWinners;

    constructor(string memory _lotteryId){
        manager = msg.sender;
        lotteryId = _lotteryId;
    }

    modifier restricted(){
        require(msg.sender == manager ,"Only manager can call this method");
        _;
    }


    function getManager() public view returns(address){
        return manager;
    }

    function getLotteryId() public view returns(string memory){
        return lotteryId;
    }

    function getPlayers() public view returns(address[] memory){
        return players;
    }

    function getPrizePool() public view returns(uint){
        return address(this).balance;
    }

    function getWinnerByLotteryId(string memory _lotteryId) public view returns(address){
        return lotteryWinners[_lotteryId];
    }

    function getRandom() private view returns(uint){
       return uint(sha256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }

    function enterLottery() public payable {
        require(msg.sender != manager,"Manager cant enter lottery"); 
        require(msg.value >= 0.1 ether,"Minimum 0.1 eth needed to enter"); 
        
        players.push(msg.sender); 
    }

    function pickWinner() public restricted {
        uint prizePool = getPrizePool();
        uint index = getRandom() %  players.length;
        address payable winner = payable(players[index]);
        winner.transfer(prizePool);
        lotteryWinners[lotteryId] = winner;
        players = new address[](0);
    }
}