var Migrations = artifacts.require("./Migrations.sol");
var RefundablePresale = artifacts.require("./RefundablePresale.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(RefundablePresale);
};
