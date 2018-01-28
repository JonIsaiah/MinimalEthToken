pragma solidity ^0.4.18;

contract TestCoin {
    using SafeMath for uint;

    uint public totalNumCoins = 65000000;

    //ERC-20 optional parameters to facilitate exchange integration
    string public constant name = "Test Coin";
    string public constant symbol = "TST";
    uint8 public constant decimals = 18; 

    //mapping of balances to addresses
    mapping (address => uint) public balances;
    mapping (address => mapping(address => uint)) public allowed;


    //ERC-20 required events
    event Transfer(address indexed _from, address indexed _to, uint tokens);
    event Approval(address indexed from, address indexed to, uint tokens);
    
    //ERC-20 required function
    function totalSupply() public constant returns (uint) {
        return totalNumCoins;
    }

    //ERC-20 required function
    function balanceOf(address _tokenOwner) constant public returns (uint balance) {
        return balances[_tokenOwner];
    }

    //ERC-20 required function
    function transfer(address _to, uint _tokens) public returns (bool success) {
        balances[msg.sender] = balances[msg.sender].sub(_tokens);//will throw if insuf funds
        balances[_to] = balances[_to].add(_tokens);
        Transfer(msg.sender, _to, _tokens);
        return true;
    }


    //ERC-20 required function
    function approve(address _spender, uint _tokens) public returns (bool success) {
        allowed[msg.sender][_spender] = _tokens;
        Approval(msg.sender, _spender, _tokens);
        return true;
    }

    
    //ERC-20 required function
    function transferFrom(address _from, address _to, uint _tokens) public returns (bool success) {
        balances[_from] = balances[_from].sub(_tokens); //will throw if insufficient funds
        allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_tokens); //will throw if insufficient allowance
        balances[_to] = balances[_to].add(_tokens);
        Transfer(_from, _to, _tokens);
        return true;
    }


    //ERC-20 required function
    function allowance(address _owner, address _spender) public constant returns (uint remaining) {
        return allowed[_owner][_spender];
    }


    //Temporary functions to speed dev and testing
    function setBal(address adr, uint value) public returns (uint) {
        balances[adr] = value;
    }


}









//github.com/OpenZeplin, MIT license
library SafeMath {

  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    if (a == 0) {
      return 0;
    }
    uint256 c = a * b;
    assert(c / a == b);
    return c;
  }


  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    uint256 c = a / b;
    return c;
  }


  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }


  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }
}