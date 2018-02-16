/*var RefundablePresale = artifacts.require('./RefundablePresale.sol');
contract('RefundablePresale', function(accounts) {

  it("should assert true", async function(done) {
    var refundable_presale = RefundablePresale.deployed(accounts[0]);
    let fundraise
    funraise = RefundablePresale.new(accounts[0]);
    refundable_presale.then();
    const owner = await funraise.owner(); 
    assert.equal(owner, accounts[0]);
    done();
  });
});
*/

/*contract('MyPlubitToken', function ([owner,other, token]) {
    //let token = accounts[2]
    let myPlubit
    beforeEach('setup contract for each test', async function () {
        //fundRaise = await RefundablePresale.new(owner)
        myPlubit = await MyPlubitToken.new(token)
    })

    it('has an owner', async function () {
    	console.log(await myPlubit.address);
    	console.log(await myPlubit.owner());
        assert.equal(await myPlubit.owner(), owner)
    })
})
*/

const BigNumber = web3.BigNumber;
require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
.should();

const RefundablePresale = artifacts.require('RefundablePresale.sol')
const MyPlubitToken = artifacts.require('MyPlubitToken.sol')

contract('RefundablePresale', function (accounts) {
    let fundRaise
    let owner = accounts[0]
    //let token = accounts[2]
    beforeEach('setup contract for each test', async function () {
        this.token  = await MyPlubitToken.new();
        fundRaise = await RefundablePresale.new(1000000000000000,
        this.token.address)
        //myPlubit = 
    })
    /*it('is owned by superuser', () => RefundablePresale.deployed()
    .then(instance => instance.owner())
    .then((superuser) => {
      assert.equal(owner, superuser, `Expected the owner to be '${superuser}'`)
    }))*/
    
    it('has an owner', async function () {
        //fundRaise.should.exist;
        //fundRaise = await RefundablePresale.deployed();
        assert.equal(await fundRaise.owner(), owner)
       // done();
    })

    it('has goal', async function () {
    	let go = await fundRaise.goal.call()
    	
    	console.log(go);

        assert.equal(go, go)
    })

    it('permits owner to receive funds', async function () {
        await this.token.loadPreIco(fundRaise.address);
        await fundRaise.sendTransaction({ value: 2e+17, from: accounts[4] })
       // const ownerBalanceBeforeRemovingFunds = web3.eth.getBalance(owner).toNumber()
        let balance = await this.token.balanceOf(accounts[4]);
        console.log(balance);
        let expectedTokenAmount = new BigNumber(10);
        //assert.equal(balance, 1)
        expectedTokenAmount = 2e+16*1000+2e+16*0.25;
        console.log(expectedTokenAmount);
        let go = await this.token.PlubPreSale.call()
        console.log(go);
        //(await this.token.balanceOf(accounts[4])).should.be.bignumber.equal(expectedTokenAmount);
        /*console.log(web3.eth.getBalance(fundRaiseAddress).toNumber());
        let qw = await fundRaise.goalReached.call();
        await fundRaise.finalize.call();
        let ff = await fundRaise.isFinalized.call();
        console.log(ff);
        //assert.isTrue(qw);
        */
})


})