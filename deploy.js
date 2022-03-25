require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const { abi, evm } = require("./compile");

//setup HD-Wallet provider:
const accountMnemonic = process.env.ACCOUNT_MNEMONIC;
const infuraBaseUrl = process.env.INFURA_BASE_URL;
const provider = new HDWalletProvider(accountMnemonic, infuraBaseUrl);

//setup web3 instance:
const web3 = new Web3(provider);

(async () => {
	//get list of accounts from provider
	const account = (await web3.eth.getAccounts())[0];
	console.log(`Using account ${account} for deployment....`);

	//deploy the contract and print address:
	const initialMessage = "Hi";
	const contract = await new web3.eth.Contract(JSON.parse(abi))
		.deploy({
			data: evm.bytecode.object,
			arguments: [initialMessage],
		})
		.send({
			gas: "1000000",
			from: account,
		});

	console.log(`Contract deployed to address : ${contract.options.address}`);

	//stop the provider engine to prevent script from hanging post deployment
	provider.engine.stop();
})();
