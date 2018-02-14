var RefundablePresale = artifacts.require('./RefundablePresale.sol');
contract('RefundablePresale', function(accounts) {
  it("should assert true", function(done) {
    var refundable_presale = RefundablePresale.deployed();
    assert.isTrue(true);
    done();
  });
});
