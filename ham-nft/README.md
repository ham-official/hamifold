## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

Look into the documentation to know how to install foundry 
**Remeber to install it when you are into the ham-ntf folder**
```cd ham-nft```
https://book.getfoundry.sh/



## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
### How to run the project locally


Once foundry is installed, open a terminal and go to ham-nft folder
```cd ham-nft```
once you're there, run the following comand
```shell
$ anvil
```

When anvil is running correctly, open a new terminal and run the following command into ham-nft folder

```shell
$ npm run setup
```

If the command has ran succesfully, open a new terminal and go to the main folder using following command

```cd ..```

Once you are in the main folder of the project, run this command to launch the project locally

```shell
$ bun nifty
```