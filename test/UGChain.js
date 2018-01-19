var UGChain = artifacts.require("./UGChain.sol");
var txId = "0xe3e391393728ad0957fe0c399067ea0d4ea38f0c93b501abe6d73edc78e7342a";
var txId2 = "0xe3e391493728ad0957fe0c399067ea0d4ea38f0c93b501abe6d73edc78e7342a";
var txId3 = "0xe3e301493728ad0957fe0c399067ea0d4ea38f0c93b501abe6d73edc78e7342a";


/**
 *  解冻(以太网络划转到联盟链)
*/
contract('defreeze', (accounts) => {
	var initOwner = accounts[0];
	var oneAcc = accounts[1];
	var _instance;
	var onAccBalance;
	var total = 0;
	var _value = 20;

	it("defreeze", () => {
		return UGChain.deployed()
			.then((instance) => {
				_instance = instance;
				onAccBalance = fromWei(web3.eth.getBalance(oneAcc));
				// 解冻：管理员垫付对应余额至 oneAcc 账户
				return _instance.defreeze(txId,oneAcc,{from:initOwner,value: toWei(_value)});
			})
			.then((data) => {
				var _logs = data.logs;
				//断言日志最后一次转账记录
				// 获取所有转账金额
				data.logs.forEach((v,i) => {
					if(v.event === 'Defreeze'){
						total += fromWei(v.args.amount);
						assert.equal(fromWei(v.args.amount), _value,"To oneAcc balance");
					}
				})
				return web3.eth.getBalance(oneAcc);
			})
			.then((data) => {
				//oneAcc余额
				assert.equal(fromWei(data), onAccBalance + total, "oneAcc balance");
			})
	})
});
/* 
	冻结(联盟链划转到以太)
*/
contract('freeze', (accounts) => {
	var initOwner = accounts[0];
	var oneAcc = accounts[1];
	var _totalBalance;
	var _instance;
	var _value = 20; //冻结数量
	var _fee = 10;   //手续费
	it("freeze",() => {
		return UGChain.deployed()
			.then((instance) => {
				_instance = instance;
				// 获取合约余额
				return web3.eth.getBalance(UGChain.address)
			})
			.then((data) => {
				assert.equal(fromWei(data), 0, "Contract balance");
				// 发起冻结操作
				return _instance.freeze(toWei(_fee),{from: oneAcc,value: toWei(_value)});
			})
			.then((data) => {
				var _logs = data.logs;
				_logs.forEach((v,i) => {
					if(v.event === "Freeze") {
						assert.equal(fromWei(v.args.value), _value, "freeze value");
						assert.equal(v.args.from, oneAcc, "freeze from address");
					}
				})
				// 获取合约余额
				return web3.eth.getBalance(UGChain.address)
			})
			.then((data) => {
				assert.equal(fromWei(data), _value, "Contract balance");
				// 发起处理冻结操作
				return _instance.handleFreeze(oneAcc,initOwner);
			})
			.then((data) => {
				var _logs = data.logs;
				_logs.forEach((v,i) => {
					if(v.event === "HandleFreeze") {
						assert.equal(fromWei(v.args.value), _value, "freeze value");
						assert.equal(fromWei(v.args.fee), _fee, "freeze fee");
						assert.equal(v.args.ownerAddr, initOwner, "fee to ownerAddr");
					}
				})
				// 断言日志 转账数量手续费
				
			})
	})
});
	
/**
 * defreezeByVote
*/
contract('defreezeByVote', (accounts) => {
	var initOwner = accounts[0];
	var oneAcc = accounts[1];
	var twoAcc = accounts[2];
	it("defreezeByVote",() => {
		var _instance;
		var _oneAccBanlance = 0;
		var _totalBanlance = 0;
		var _deposit = 30; //存款
		var _value = 5;    //转账

		return UGChain.deployed()
			.then((instance) => {
				_instance = instance;
				// 合约存款，保证合约货币数量不为空
				// 获取一号账户余额
				return Promise.all([
						_instance.deposit({value: toWei(_deposit),from: twoAcc}),
						web3.eth.getBalance(oneAcc)
					])
			})
			.then((data) => {
				assert.equal(fromWei(web3.eth.getBalance(UGChain.address)),_deposit,"Must be 30 ETH");
				_oneAccBanlance = fromWei(data[1]);
				// 发起解冻余额投票
				return _instance.defreezeByVote(txId2,oneAcc,toWei(_value),{from: initOwner});

			})
			.then((data) => {
			 	return getOperstion(data);
			})
			.then((data) => {
				// 确认投票当前状态
				return _instance.hasConfirmed.call(data,initOwner)
			})
			.then((data) => {
				assert.equal(data,false,"vote status");
				return	web3.eth.getBalance(oneAcc);
			})
			.then((data) => {
				assert.equal(fromWei(data),_oneAccBanlance + _value,"oneAcc balance");
			})

	})
})

/**
 	returnToOwner
*/
contract('returnToOwner', (accounts) => {
	var initOwner = accounts[0];
	var oneAcc = accounts[1];
	var twoAcc = accounts[2];
	var _instance;
	var _value = 25;  //垫付
	var _value2 = 20; //返回

	it("returnToOwner",() => {
		
		return UGChain.deployed()
			.then((instance) => {
				_instance = instance;
				// 保证合约里有钱
				// 管理员垫付
				return Promise.all([
					_instance.defreeze(txId3,oneAcc,{from:initOwner,value: toWei(_value)}),
					_instance.deposit({value: toWei(30),from: twoAcc}),
				])
			})
			.then((data) => {
				return Promise.all([
					_instance.getOwnersLoan(initOwner),
				])
			})
			.then((data) => {
				assert.equal(fromWei(data[0]),_value,"owner loan");

				// 申请报销
				return _instance.returnToOwner(initOwner,toWei(_value2),{from: initOwner});
			})
			.then((data) => {
				return Promise.all([
					_instance.getOwnersLoan(initOwner),
				])
			})
			.then((data) => {
				assert.equal(fromWei(data[0]),_value - _value2,"owner loan");
			})
	})
});


/**
 * 存款操作 后面会删除 deposit 方法 
*/	
// contract('returnToOwner', (accounts) => {
// 	it("deposit function",() => {
// 		var _instance;
// 		return UGChain.deployed()
// 			.then((instance) => {
// 				_instance = instance;
// 				//存款
// 				return Promise.all([
// 						_instance.deposit({value: toWei(2),from: initOwner})
// 					])
// 			})
// 			.then((data) => {
// 				setConsole("Deposit log",data);
// 				//合约余额
// 				return web3.eth.getBalance(UGChain.address)
// 			})
// 			.then((data) => {
// 				setConsole("Contract balance",fromWei(data));
// 				assert.equal(fromWei(data),2,"balance");
// 				//管理员存款
// 				return _instance.getOwnersDeposit(initOwner);
// 			})
// 			.then((data) => {
// 				setConsole("InitOwner balance",fromWei(data));
// 				assert.equal(fromWei(data),2,"balance");
// 			})
// 	})
// })

	










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
function fromWei(val){
	return web3.fromWei(val,"ether").toNumber();
}

function toWei(val){
	return web3.toWei(val,"ether");
}