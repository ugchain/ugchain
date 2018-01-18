var UGChain = artifacts.require("./UGChain.sol");

const TOTAL_SUPPLY = 1000000000;
// const TOTAL_SUPPLY = 1000000000;
contract('UGChain', (accounts) => {
	var initOwner = accounts[0];
	var oneOwner = accounts[1];
	var twoOwner = accounts[2];
	var thrOwner = accounts[3];
	var txId = "0xe3e391393728ad0957fe0c399067ea0d4ea38f0c93b501abe6d73edc78e7342a";
	var txId2 = "0xe3e391493728ad0957fe0c399067ea0d4ea38f0c93b501abe6d73edc78e7342a";
	var txId3 = "0xe3e301493728ad0957fe0c399067ea0d4ea38f0c93b501abe6d73edc78e7342a";


/**
 * 存款操作 后面会删除 deposit 方法 
*/
	// it("deposit function",() => {
	// 	var _instance;
	// 	return UGChain.deployed()
	// 		.then((instance) => {
	// 			_instance = instance;
	// 			//存款
	// 			return Promise.all([
	// 					_instance.deposit({value: toWei(2),from: initOwner})
	// 				])
	// 		})
	// 		.then((data) => {
	// 			setConsole("Deposit log",data);
	// 			//合约余额
	// 			return web3.eth.getBalance(UGChain.address)
	// 		})
	// 		.then((data) => {
	// 			setConsole("Contract balance",fromWei(data));
	// 			assert.equal(fromWei(data),2,"balance");
	// 			//管理员存款
	// 			return _instance.getOwnersDeposit(initOwner);
	// 		})
	// 		.then((data) => {
	// 			setConsole("InitOwner balance",fromWei(data));
	// 			assert.equal(fromWei(data),2,"balance");
	// 		})
	// })
/**
 *  解冻
*/
	// it("defreeze", () => {
	// 	var _instance;
	// 	var twoBalance;
	// 	var total = 0;
	// 	return UGChain.deployed()
	// 		.then((instance) => {
	// 			_instance = instance;
	// 			twoBalance = fromWei(web3.eth.getBalance(twoOwner));
	// 			console.log(twoBalance);
	// 			// 解冻：扣除管理员对应余额至 twoOwner 账户
	// 			return _instance.defreeze(txId,twoOwner,{from:initOwner,value: toWei(5)});
	// 		})
	// 		.then((data) => {
	// 			setConsole("defreeze twoOwner",data);
	// 			var _logs = data.logs;
	// 			//断言日志最后一次转账记录
	// 			assert.equal(fromWei(_logs[_logs.length-1].args.amount),5,"To twoOwner balance");
	// 			data.logs.forEach((v,i) => {
	// 				console.log(v);
	// 				total += fromWei(v.args.amount);
	// 			})
	// 			console.log(total);
	// 			return web3.eth.getBalance(twoOwner);
	// 		})
	// 		.then((data) => {
	// 			//twoOwner余额
	// 			assert.equal(fromWei(data), total + twoBalance, "TwoOwner balance");
	// 		})
	// })
/* 
	冻结
*/
	// it("freeze",() => {
	// 		var _totalBalance;
	// 		var _instance;
	// 		var _value = 20;
	// 		var _fee = 10;
	// 	return UGChain.deployed()
	// 		.then((instance) => {
	// 			_instance = instance;
	// 			// 获取合约余额
	// 			return web3.eth.getBalance(UGChain.address)
	// 		})
	// 		.then((data) => {
	// 			assert.equal(fromWei(data), 0, "Contract balance");
	// 			// 发起冻结操作
	// 			return _instance.freeze(toWei(_fee),{from: twoOwner,value: toWei(_value)});
	// 		})
	// 		.then((data) => {
	// 			setConsole("freeze twoOwner",data);
	// 			// 获取合约余额
	// 			return web3.eth.getBalance(UGChain.address)
	// 		})
	// 		.then((data) => {

	// 			assert.equal(fromWei(data), 20, "Contract balance");
	// 			// 发起处理冻结操作
	// 			return _instance.handleFreeze(twoOwner,initOwner);
	// 		})
	// 		.then((data) => {
	// 			var _logs = data.logs;
	// 			// 断言日志 转账数量手续费
	// 			assert.equal(fromWei(_logs[_logs.length-1].args.value), _value, "freeze value");
	// 			assert.equal(fromWei(_logs[_logs.length-1].args.fee), _fee, "freeze fee");
	// 		})
	// })
/**
 * defreezeByVote
*/
	it("defreezeByVote",() => {
		var _instance;
		return UGChain.deployed()
			.then((instance) => {
				_instance = instance;
				setConsole("_instance",fromWei(web3.eth.getBalance(UGChain.address)));
				return	_instance.deposit({value: toWei(30),from: thrOwner});
			})
			.then((data) => {
				return web3.eth.getBalance(UGChain.address);
			})
			.then((data) => {
				console.log(fromWei(data));
				return _instance.defreezeByVote(txId2,twoOwner,toWei(5),{from: initOwner});
			})
			.then((data) => {
				console.log(data);
			 	return getOperstion(data);
			})
			.then((data) => {
				return _instance.hasConfirmed.call(data,initOwner)
			})
			.then((data) => {
				console.log(data);
			})
	})
/**
 	returnToOwner
*/
	// it("returnToOwner",() => {
	// 	var _instance;
	// 	return UGChain.deployed()
	// 		.then((instance) => {
	// 			_instance = instance;
	// 			return _instance.defreeze(txId3,twoOwner,{from:initOwner,value: toWei(25)});

	// 		})
	// 		.then((data) => {
	// 			return Promise.all([
	// 					web3.eth.getBalance(initOwner),
	// 					_instance.getOwnersLoan(initOwner),
	// 					_instance.getOwnersDeposit(initOwner)
	// 				])
	// 		})
	// 		.then((data) => {
	// 			data.forEach((v,i) => {
	// 				console.log(fromWei(v));
	// 			})
	// 			return _instance.returnToOwner(initOwner,toWei(20),{from: initOwner});
	// 		})
	// 		.then((data) => {
	// 			setConsole("returnToOwner",data);
	// 			return Promise.all([
	// 				web3.eth.getBalance(initOwner),
	// 				_instance.getOwnersLoan(initOwner),
	// 				_instance.getOwnersDeposit(initOwner)
	// 			])
	// 		})
	// 		.then((data) => {
	// 			data.forEach((v,i) => {
	// 				console.log(fromWei(v));
	// 			})
	// 		})
	// })
})












function getOperstion(res){
	var operation;
	for (var i = 0; i < res.logs.length; i++) {
		var log = res.logs[i];
		if(log.event === "Operation"){
			operation = log.args.operation;
		}
	};
	return Promise.resolve(operation);
}

function setConsole(title,result) {
	console.log("==== " + title + " ====");
	console.log(result);
	console.log("==================== \r\n")

}
function fromWei(val){
	return web3.fromWei(val,"ether").toNumber();
}

function toWei(val){
	return web3.toWei(val,"ether");
}