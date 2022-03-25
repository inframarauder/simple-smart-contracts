const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const { interface, bytecode } = require("../compile"); //interface == ABI

//creating an instance of web3
const web3 = new Web3(ganache.provider());

let accounts, inbox;
const INITIAL_STRING = "Hi There!";

beforeEach(async () => {
	// get a list of all accounts
	accounts = await web3.eth.getAccounts();

	//use one of those accounts to deploy the contract:
	inbox = await new web3.eth.Contract(JSON.parse(interface)) //passing the ABI to the contract
		.deploy({ data: bytecode, arguments: [INITIAL_STRING] })
		.send({ from: accounts[0], gas: "1000000" });
});

describe("Inbox contract test block", () => {
	it("deploys a contract", () => {
		assert.ok(inbox.options.address);
	});

	//test for getMessage
	it("reads default message", async () => {
		const message = await inbox.methods.getMessage().call();
		assert.equal(message, INITIAL_STRING);
	});

	//test for setMessage
	it("updates the message", async () => {
		//update contract data:
		const newMessage = "Bubbyeee!";
		await inbox.methods.setMessage(newMessage).send({ from: accounts[0] });

		//read contract data to verify the update:
		const message = await inbox.methods.getMessage().call();
		assert.equal(message, newMessage);
	});
});
