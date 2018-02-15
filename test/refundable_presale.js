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
/*const MyPlubitToken = artifacts.require('./MyPlubitToken.sol')
contract('MyPlubitToken', function ([owner,other, token]) {
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

const RefundablePresale = artifacts.require('./RefundablePresale.sol')

contract('RefundablePresale', function (accounts) {
    let fundRaise
    let owner = accounts[0]
    //let token = accounts[2]
    beforeEach('setup contract for each test', async function () {
      //  fundRaise = await RefundablePresale.new(owner)
        //myPlubit = 
    })
    
    it('has an owner', async function () {
        fundRaise = await RefundablePresale.deployed();
        assert.equal(await fundRaise.owner(), owner)
       // done();
    })

    it('has goal', async function () {
    	let go = await fundRaise.goal.call()
    	
    	console.log(go);

        assert.equal(go, go)
    })

    it('permits owner to receive funds', async function () {
        await fundRaise.sendTransaction({ value: 1e+18, from: accounts[5] })
        const ownerBalanceBeforeRemovingFunds = web3.eth.getBalance(owner).toNumber()

        const fundRaiseAddress = await fundRaise.address
        assert.equal(web3.eth.getBalance(fundRaiseAddress).toNumber(), 1e+18)

        
})


})