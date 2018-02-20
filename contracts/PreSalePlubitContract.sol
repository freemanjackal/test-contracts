pragma solidity ^0.4.2;

import "./Owned.sol";
import "./Pausable.sol";
import "./MathLib.sol";
import "./MyPlubitToken.sol";
import "./WhiteList.sol";


contract PreSalePlubitContract is Owned, Pausable, MathLib {

    MyPlubitToken    pub;

    // crowdsale parameters
    uint256 public startBlock = 3000;
    uint256 public endBlock   = 4000;
    uint256 public constant decimals = 18;                                              // #dp in token contract
    uint256 public maxSupply = 5000000 * 10**decimals; //max amount of tokens to sell
    address public ethFundDepositPreSale   = 0x91194e841c6b3f76b7f60fa3c9b53ebe861d8ee2; //9     // deposit address for ETH for plubit Fund for presale

    bool public isFinalized;                                                            // switched to true in operational state
    
    uint256 public tokenCreationCap;
    uint256 public constant tokenExchangeRate = 1000;                                   // define how many tokens per 1 ETH
    uint256 public constant minContribution = 0.5 ether;
    uint256 public constant MAX_GAS_PRICE = 50000000000 wei;                            // maximum gas price for contribution transactions

    // amount of raised money in wei
    uint256 public weiRaised;

    WhiteList public investorWhiteList; //whitelisted investors

    function PreSalePlubitContract(address token) {
        CreateTokensEvent();
        pub = MyPlubitToken(token);
        tokenCreationCap = 0;
        isFinalized = false;
        
    }

    event MintPlub(address to, uint256 val);
    event LogRefund(address indexed _to, uint256 _value);
    event CreateTokensEvent();



    function CreatePlub(address to, uint256 val) internal returns (bool success) {
        MintPlub(to,val);
        return pub.transferFromPreICO(to, val);
    }

    function () payable inWhiteList {
        CreateTokensEvent();
        createTokens(msg.sender,msg.value);
    }

    modifier inWhiteList() {
      require(investorWhiteList.isAllowed(msg.sender));
      _;
    }

    function setWhiteList(address whiteListAddr) external onlyOwner {
      require(whiteListAddr != 0x0);
      investorWhiteList = WhiteList(whiteListAddr);

    }

    /// @dev Accepts ether and creates new tokens.
    function createTokens(address _beneficiary, uint256 _value) internal whenNotPaused {
      require (weiRaised < maxSupply);                                         // CAP reached no more please
      require (block.number >= 1);//startBlock
      require (block.number <= endBlock);
      require (_value >= minContribution); //minContribution                                             // To avoid spam transactions on the network
      require (!isFinalized);
      //require (tx.gasprice <= MAX_GAS_PRICE);

      uint256 tokens = safeMult(_value, tokenExchangeRate);                             // check that we're not over totals
      uint256 checkedSupply = safeAdd(weiRaised, _value);

      //require (pub.balanceOf(msg.sender) + tokens <= maxTokens);   to define max tokens a user can buy
      uint256 bonuses = calculateBonus(tokens);
      // fairly allocate the last few tokens
      if (checkedSupply > maxSupply) {
        uint256 ethersToAllocate = safeSubtract(maxSupply, weiRaised);
        uint256 etherToRefund   = safeSubtract(_value,ethersToAllocate);
        weiRaised = maxSupply;
        //uint256 etherToRefund = tokensToRefund / tokenExchangeRate;

        tokens = safeMult(ethersToAllocate, tokenExchangeRate);
        bonuses = calculateBonus(tokens);
        tokens = safeAdd(tokens, bonuses);
        tokenCreationCap = safeAdd(tokenCreationCap, tokens);

        require(CreatePlub(_beneficiary,tokens));                              // Create
        sendFunds();
        
        //msg.sender.transfer(etherToRefund); ///analyze this for testrpc and other
        LogRefund(msg.sender,etherToRefund);
        
        return;
      }
      weiRaised = checkedSupply;
      //bonuses = calculateBonus(tokens);
      tokens = safeAdd(bonuses, tokens);
      tokenCreationCap = safeAdd(tokenCreationCap, tokens);

      require(CreatePlub(_beneficiary, tokens));                                         // logs token creation
      sendFunds();
      
    }

    function calculateBonus(uint256 _tokens)  returns(uint256){

      return safeDiv(_tokens, 4);

    }


    function sendFunds() internal {

    }



}