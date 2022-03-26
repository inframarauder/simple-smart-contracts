const assert = require("assert");
const Web3 = require("web3");
const ganache = require("ganache-cli");
const uuid = require("uuid").v4;
const compileContract = require("../compile");

const web3 = new Web3(ganache.provider({ gasLimit: "50000000" }));
const { abi, evm } = compileContract("Lottery");

let lottery, accounts;
const defaultLotteryId = uuid();

beforeEach(async () => {
	accounts = await web3.eth.getAccounts();

	lottery = await new web3.eth.Contract(abi)
		.deploy({ data: evm.bytecode.object, arguments: [defaultLotteryId] })
		.send({ gas: "5000000", from: accounts[0] });
});

describe("Lottery Test Suite", () => {
	it("deploys a contract", async () => {
		assert.ok(lottery.options.address);
	});

	it("returns address of manager account", async () => {
		const manager = await lottery.methods.getManager().call();
		assert.equal(accounts[0], manager);
	});

	it("returns the lotteryId", async () => {
		const lotteryId = await lottery.methods.getLotteryId().call();
		assert.equal(defaultLotteryId, lotteryId);
	});

	it("does not let manager enter the lottery", async () => {
		try {
			await lottery.methods.enterLottery().send({
				from: accounts[0],
				value: web3.utils.toWei("0.1", "ether"),
			});
			assert(false);
		} catch (error) {
			assert.equal(true, error.message.includes("Manager cant enter lottery"));
		}
	});

	it("does not let a player enter the lottery with less than 0.1 ether", async () => {
		try {
			await lottery.methods.enterLottery().send({
				from: accounts[1],
				value: web3.utils.toWei("0.05", "ether"),
			});
			assert(false);
		} catch (error) {
			assert.equal(
				true,
				error.message.includes("Minimum 0.1 eth needed to enter")
			);
		}
	});

	it("allows a player to enter the lottery", async () => {
		await lottery.methods.enterLottery().send({
			from: accounts[1],
			value: web3.utils.toWei("0.1", "ether"),
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

	it("sends prize pool amount to winner and resets the players array", async () => {
		//enter two players into the lottery:
		const initialBalance1 = await web3.eth.getBalance(accounts[1]);
		await lottery.methods.enterLottery().send({
			from: accounts[1],
			value: web3.utils.toWei("0.1", "ether"),
		});

		const initialBalance2 = await web3.eth.getBalance(accounts[2]);
		await lottery.methods.enterLottery().send({
			from: accounts[2],
			value: web3.utils.toWei("0.1", "ether"),
		});

		//pick a winner:
		await lottery.methods.pickWinner().send({
			from: accounts[0], //using manager account
		});

		//determine winner :
		const winner = await lottery.methods
			.getWinnerByLotteryId(defaultLotteryId)
			.call();
		const winnerBalance = await web3.eth.getBalance(winner);
		const condition =
			winner === accounts[1]
				? winnerBalance > initialBalance1
				: winnerBalance > initialBalance2;

		assert(condition);

		//ensure players is reset:
		const players = await lottery.methods.getPlayers().call();
		assert.equal(0, players.length);
	});
});
