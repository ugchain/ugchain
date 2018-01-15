/*
* @Author: Mr.Sofar
* @Date:   2018-01-15 11:05:15
* @Last Modified by:   Mr.Sofar
* @Last Modified time: 2018-01-15 11:28:47
*/
var UGChain = artifacts.require("./UGChain.sol");


// const TOTAL_SUPPLY = 1000000000;
contract('UGChain', (accounts) => {

	it("deposit",() => {
		return UGChain.deployed()
			.then((instance) => {
				return instance.deposit.call();
			})
			.then((data) => {
				assert.equal(data,true,"deposit");
			});
	});
	it("deposit",() => {
		return UGChain.deployed()
			.then((instance) => {
				return instance.addOwner(accounts[0]);
			})
			.then((data) => {
				console.log(data);
			});
	});
})