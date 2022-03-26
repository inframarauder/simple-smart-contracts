//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

contract Inbox{
    string message;

    //constructor:
   constructor (string memory initialMessage) {
        message = initialMessage;
    }

    function setMessage(string memory newMessage) public{
        message = newMessage;
    }

    function getMessage() public view returns(string memory){
        return message;
    }
}