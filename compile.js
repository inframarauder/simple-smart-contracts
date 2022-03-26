const path = require("path");
const fs = require("fs");
const solc = require("solc");

const compileContract = (contractName) => {
	const contractPath = path.resolve(
		__dirname,
		"contracts",
		`${contractName}.sol`
	);
	const source = fs.readFileSync(contractPath, "utf8");
	const input = {
		language: "Solidity",
		sources: {
			[`${contractName}.sol`]: {
				content: source,
			},
		},

		settings: {
			outputSelection: {
				"*": {
					"*": ["*"],
				},
			},
		},
	};

	return JSON.parse(solc.compile(JSON.stringify(input))).contracts[
		`${contractName}.sol`
	][`${contractName}`];
};

module.exports = compileContract;
