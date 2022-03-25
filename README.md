# simple-smart-contract

A simple inbox smart contract that can be used to store and update a message.

**Scripts**

`compile.js` : compile the contract to bytecode and ABI using solc compiler
`deploy.js` : deploy the contract to the ethereum (rinkeby) network and prints the address of the deployed contract

**Steps**

- Install depenedencies : `npm install`
- To test the contract, run the following commands:
  `npm run test`

- To compile the contract, run the following command:
  `npm run compile`

- To deploy the contract, create a `.env` file and set the following variables:

  - `INFURA_BASE_URL`: your infura base url
  - `ACCOUNT_MNEMONIC`: your private key phrase for metamask wallet

    After that, run the following command:
    run the following command:
    `npm run deploy`
