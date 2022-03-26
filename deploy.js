require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const uuid = require("uuid").v4;
const compileContract = require("./compile");

//setup HD-Wallet provider:
const accountMnemonic = process.env.ACCOUNT_MNEMONIC;
const infuraBaseUrl = process.env.INFURA_BASE_URL;
const provider = new HDWalletProvider(accountMnemonic, infuraBaseUrl);

//setup web3 instance:
const web3 = new Web3(provider);

//list of contracts to deploy:
const contracts = [
	{
		name: "Inbox",
		arguments: ["Hi"],
	},
	{
		name: "Lottery",
		arguments: [uuid()],
	},
];
contracts.forEach(async (contract, index) => {
	//compile contract:
	const { abi, evm } = compileContract(contract.name);

	//get list of accounts from provider
	const account = (await web3.eth.getAccounts())[index];
	console.log(`Using account ${account} for deployment....`);

	//deploy the contract and print address:
	const deployedContract = await new web3.eth.Contract(abi)
		.deploy({ data: evm.bytecode.object, arguments: [...contract.arguments] })
		.send({ gas: "100000", from: account });

	console.log(
		`Contract ${contract.name} deployed to address : ${deployedContract.options.address}`
	);

	//stop the provider engine to prevent script from hanging post deployment
	provider.engine.stop();
});
