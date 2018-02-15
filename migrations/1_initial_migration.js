var Migrations = artifacts.require("./Migrations.sol");
var RefundablePresale = artifacts.require("./RefundablePresale.sol");
var PreSalePlubitContract= artifacts.require("./PreSalePlubitContract.sol");
var MyPlubitToken = artifacts.require("./MyPlubitToken.sol");
var MyMath = artifacts.require("./MathLib.sol");
var Pausa =  artifacts.require("./Pausable.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(MyPlubitToken);
  deployer.deploy(RefundablePresale, 50000000000000000000,
  	MyPlubitToken.address);
  /*deployer.deploy(MyPlubitToken).then(function(){
    deployer.deploy(RefundablePresale,50000000000000000000,
    	MyPlubitToken.address)});*/
  //deployer.deploy(RefundablePresale);
  //deployer.deploy(PreSalePlubitContract);
  //deployer.deploy(RefundablePresale, 5000);
 // deployer.deploy(MyPlubitToken);
  /*deployer.deploy(MyPlubitToken).then(function(){
    deployer.deploy(PreSalePlubitContract, MyPlubitToken.address)});*/	
};
