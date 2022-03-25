require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const { interface, bytecode } = require("./compile");

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
	const transaction = await new web3.eth.Contract(JSON.parse(interface))
		.deploy({
			data: bytecode,
			arguments: [initialMessage],
		})
		.send({
			gas: "1000000",
			from: account,
		});

	console.log(`Contract deployed to address : ${transaction.options.address}`);

	//stop the provider engine to prevent script from hanging post deployment
	provider.engine.stop();
})();
