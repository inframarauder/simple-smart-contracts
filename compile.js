const path = require("path");
const fs = require("fs");
const solc = require("solc");

//read source code from contract:
function getContractSource(contractName) {
	const contractPath = path.resolve(
		__dirname,
		"contracts",
		`${contractName}.sol`
	);
	const contractSource = fs.readFileSync(contractPath, "utf8");
	return contractSource;
}

//compile and export contract source
const contractSource = getContractSource("Inbox");
const compiledContractSource = solc.compile(contractSource, 1);
console.log(`Generated compiled contracts`);
module.exports = compiledContractSource.contracts[":Inbox"]; //exporting only the inbox contract for now
