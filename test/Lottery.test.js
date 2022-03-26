const assert = require("assert");
const Web3 = require("web3");
const ganache = require("ganache-cli");
const { abi, evm } = require("../compile");

const web3 = new Web3(ganache.provider());

let lottery, accounts;

beforeEach(async () => {
	accounts = await web3.eth.getAccounts();

	lottery = await new web3.eth.Contract(abi)
		.deploy({ data: evm.bytecode.object })
		.send({ gas: "1000000", from: accounts[0] });
});

describe("Lottery Test Suite", () => {
	it("deploys a contract", async() => {
		assert.ok(lottery.options.address);
	});
});
