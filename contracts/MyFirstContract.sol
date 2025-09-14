
pragma solidity ^0.8.0;

contract MyFirstContract {
    string public message;

    // Constructor runs only once at the time of deployment
    constructor(string memory _message) {
        message = _message;
    }

    
    function setMessage(string memory _newMessage) public {
        message = _newMessage;
    }

  
    function getMessage() public view returns (string memory) {
        return message;
    }
}
