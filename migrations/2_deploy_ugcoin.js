const UGChain = artifacts.require(`./UGChain.sol`);

module.exports = (deployer) => {
	deployer.deploy(UGChain);
}