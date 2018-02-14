pragma solidity ^0.4.2;

import "./Owned.sol";
import "./Pausable.sol";
import "./MathLib.sol";
import "./MyPlubitToken.sol";


contract PreSalePlubitContract is Owned, Pausable, MathLib {

    MyPlubitToken    pub;

    // crowdsale parameters
    uint256 public startBlock = 3000;
    uint256 public endBlock   = 400000;
    uint256 public maxSupply = 5000000 * 10**decimals; //max amount of tokens to sell
    address public ethFundDepositPreSale   = 0xb0774c6aeadfb739466dfbd3ca91faa13eb98564; //0     // deposit address for ETH for plubit Fund for presale
    address public PlubPresaleDeposit = 0xcc9e49b6caf08aef7ae5d6cbd012381ded693808;//1      // deposit address for plubit


    address public plubAddress = 0x25ca53c2c7e94a27d57434f919a5f8b034d30c17; //2      //addres of token contract

    bool public isFinalized;                                                            // switched to true in operational state
    uint256 public constant decimals = 18;                                              // #dp in token contract
    uint256 public tokenCreationCap;
    uint256 public constant tokenExchangeRate = 1000;                                   // define how many tokens per 1 ETH
    uint256 public constant minContribution = 0.5 ether;
    uint256 public softCapitalization;
    uint256 public constant MAX_GAS_PRICE = 50000000000 wei;                            // maximum gas price for contribution transactions

    // amount of raised money in wei
	uint256 public weiRaised;

    function PreSalePlubitContract() {
        CreateTokensEvent();
        pub = MyPlubitToken(plubAddress);
        tokenCreationCap = 0;
        isFinalized = false;
        
    }

    event MintPlub(address from, address to, uint256 val);
    event LogRefund(address indexed _to, uint256 _value);
    event CreateTokensEvent();


    function CreatePlub(address to, uint256 val) internal returns (bool success) {
        MintPlub(PlubPresaleDeposit,to,val);
        return pub.transferFromPreICO(PlubPresaleDeposit, to, val);
    }

    function () payable {
        CreateTokensEvent();
        createTokens(msg.sender,msg.value);
    }

    /// @dev Accepts ether and creates new IND tokens.
    function createTokens(address _beneficiary, uint256 _value) internal whenNotPaused {
      require (tokenCreationCap < maxSupply);                                         // CAP reached no more please
      require (block.number >= startBlock);
      require (block.number <= endBlock);
      require (_value >= minContribution);                                              // To avoid spam transactions on the network
      require (!isFinalized);
      require (tx.gasprice <= MAX_GAS_PRICE);

      uint256 tokens = safeMult(_value, tokenExchangeRate);                             // check that we're not over totals
      uint256 checkedSupply = safeAdd(tokenCreationCap, tokens);

      //require (pub.balanceOf(msg.sender) + tokens <= maxTokens);   to define max tokens a user can buy

      // fairly allocate the last few tokens
      if (tokenCreationCap > maxSupply) {
        uint256 tokensToAllocate = safeSubtract(maxSupply, tokenCreationCap);
        uint256 tokensToRefund   = safeSubtract(tokens,tokensToAllocate);
        tokenCreationCap = maxSupply;
        uint256 etherToRefund = tokensToRefund / tokenExchangeRate;

        uint256 bonuses = calculateBonus(tokensToAllocate);
        tokensToAllocate = safeAdd(tokensToAllocate, bonuses);

        require(CreatePlub(_beneficiary,tokensToAllocate));                              // Create
        msg.sender.transfer(etherToRefund);
        LogRefund(msg.sender,etherToRefund);
        sendFunds();
        weiRaised = safeAdd(weiRaised, safeSubtract(_value, etherToRefund));
        return;
      }
      weiRaised = safeAdd(weiRaised, _value);
      sendFunds();
      tokenCreationCap = checkedSupply;
      require(CreatePlub(_beneficiary, tokens));                                         // logs token creation
      
    }

    function calculateBonus(uint256 _tokens) internal returns(uint256){

    	return safeMult(_tokens, safeDiv(25,100));

    }

    /// @dev Ends the funding period and sends the ETH home
    function finalize() external onlyOwner {
      //require (!isFinalized);
      // move to operational
      //isFinalized = true;
      //ethFundDepositPreSale.transfer(this.balance);                                            // send the eth to multi-sig
    }

    function sendFunds() internal {

    }



}
