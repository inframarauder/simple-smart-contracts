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
	it("deploys a contract", async () => {
		assert.ok(lottery.options.address);
	});

	it("returns address of manager account", async () => {
		const manager = await lottery.methods.getManager().call();
		assert.equal(accounts[0], manager);
	});

	it("does not let manager enter the lottery", async () => {
		try {
			await lottery.methods.enterLottery().send({
				from: accounts[0],
				value: "100",
			});
			assert(false);
		} catch (error) {
			assert.equal(true, error.message.includes("Manager cant enter lottery"));
		}
	});

	it("does not let a player enter the lottery with less than 100 wei", async () => {
		try {
			await lottery.methods.enterLottery().send({
				from: accounts[1],
				value: "10",
			});
			assert(false);
		} catch (error) {
			assert.equal(
				true,
				error.message.includes("Minimum 100 wei needed to enter")
			);
		}
	});

	it("allows a player to enter the lottery", async () => {
		await lottery.methods.enterLottery().send({
			from: accounts[1],
			value: "100",
		});

		const players = await lottery.methods.getPlayers().call();
		assert.equal(1, players.length);
		assert.equal(accounts[1], players[0]);
	});

	it("ensures that only manager can call pickWinner()", async () => {
		try {
			await lottery.methods.pickWinner().send({
				from: accounts[1], //not manager account
			});
			assert(false);
		} catch (error) {
			assert.equal(
				true,
				error.message.includes("Only manager can call this method")
			);
		}
	});
});
