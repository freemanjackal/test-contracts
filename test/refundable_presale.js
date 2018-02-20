
const BigNumber = web3.BigNumber;
require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
.should();


function advanceToBlock(number) {
  if (web3.eth.blockNumber > number) {
    throw Error(`block number ${number} is in thfe past (current is ${web3.eth.blockNumber})`)
  }

  while (web3.eth.blockNumber < number) {
    web3.eth.sendTransaction({value: 1, from: web3.eth.accounts[8], to: web3.eth.accounts[7]});
  }
}

const assertJump = function(error) {
  assert.isAbove(error.message.search('VM Exception while processing transaction: revert'), -1, 'Invalid opcode error must be returned');
};


const startBlock = 3000;
const endBlock = 4000;
const minContribution = 500000000000000000;
const maxSupply = 2e+18;
const tokenExchangeRate = 1000;


const RefundablePresale = artifacts.require('RefundablePresale.sol')
const MyPlubitToken = artifacts.require('MyPlubitToken.sol')
const WL = artifacts.require('WhiteList.sol')

contract('RefundablePresale', function (accounts) {
    let fundRaise
    let owner = accounts[0]
    //let token = accounts[2]
    beforeEach('setup contract for each test', async function () {
        this.token  = await MyPlubitToken.new();
        fundRaise = await RefundablePresale.new(2e+18,
        this.token.address)
        this.wl = await WL.new();
    })
    
    it('has an owner', async function () {
        
        assert.equal(await fundRaise.owner(), owner)
    })

    it('has goal', async function () {
    	let go = await fundRaise.maxSupply.call()
    	    	
        assert.equal(go, maxSupply);
    })

    it('permits send from whitelisted addr', async function () {
        await this.wl.addInvestorToWhiteList(accounts[4]);
        await fundRaise.setWhiteList(this.wl.address);
        assert.equal(this.wl.address, await fundRaise.investorWhiteList());
        await this.token.loadPreIco(fundRaise.address);
        await fundRaise.sendTransaction({ value: 1e+18, from: accounts[4] })
    })
    it('non whitelisted addr cant participate', async function () {
        try{
            await fundRaise.setWhiteList(this.wl.address);
            await this.token.loadPreIco(fundRaise.address);
            await fundRaise.sendTransaction({ value: 2e+18, from: accounts[4] })
        }
        catch(error){
            console.log('error');

            return assertJump(error);
        }
        assert.fail('should have thrown before');
    })

    it('should not create tokens from any, just pre-ico', async function () {
        
        
        try {
            await this.wl.addInvestorToWhiteList(accounts[4]);
            await fundRaise.setWhiteList(this.wl.address);
            await fundRaise.sendTransaction({ value: 2e+18, from: accounts[4] })
        } catch (error) {
            console.log('error');
            return assertJump(error);
        }
        assert.fail('should have thrown before');
    })
    it('fail amount of ether lower than min minContribution ', async function () {
        try{
            await this.wl.addInvestorToWhiteList(accounts[4]);
            await fundRaise.setWhiteList(this.wl.address);
            assert.equal(this.wl.address, await fundRaise.investorWhiteList());
            await this.token.loadPreIco(fundRaise.address);
            await fundRaise.sendTransaction({ value: 1e+17, from: accounts[4] })
        }
        catch(error){
            console.log('error');
            return assertJump(error);
        }
            assert.fail('should have thrown before');


    })
    it('calculate tokens plus bonuses', async function () {
        await this.wl.addInvestorToWhiteList(accounts[4]);
        await fundRaise.setWhiteList(this.wl.address);
        assert.equal(this.wl.address, await fundRaise.investorWhiteList());
        await this.token.loadPreIco(fundRaise.address);
        await fundRaise.sendTransaction({ value: 1e+18, from: accounts[4] })
        let tokens ;//= New BigNumber();
        tokens = 1e+18*tokenExchangeRate+(1e+18)*1000/4;
        assert.equal(tokens, await this.token.balanceOf.call(accounts[4]));
    })


})