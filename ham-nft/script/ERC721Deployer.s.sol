// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.23;

import {Script, console2} from "forge-std/Script.sol";
import {ERC721Deployer} from "../src/ERC721Deployer.sol";
import {ERC721DeployerProxy} from "../src/ERC721DeployerProxy.sol";

contract DeployHamERC721 is Script {
    function run() public {
        vm.startBroadcast();

        //STEP 1: deploy of deployer contract
        ERC721Deployer erc721Deployer = new ERC721Deployer();

        //STEP 2: Deploy of deployerProxy proxy
        ERC721DeployerProxy erc721DeployerProxy = new ERC721DeployerProxy(
            address(erc721Deployer),
            msg.sender,
            abi.encodeWithSelector(ERC721Deployer.initialize.selector, "")
        );

        //STEP 2.1 Get instance address of deployed proxy
        erc721Deployer = ERC721Deployer(address(erc721DeployerProxy));

        //Step 3 Deploy contract instance
        erc721Deployer.ham721Deploy('test','tst');

        vm.stopBroadcast();

        console2.log("ERC721Deployer deployed at:", address(erc721Deployer));
    }
}
