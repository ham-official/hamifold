// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.23;

import {Script, console2} from "forge-std/Script.sol";
import {HamERC721EditionDeployer} from "../src/ERC721Edition/HamERC721EditionDeployer.sol";
import {HamERC721EditionDeployerProxy} from "../src/ERC721Edition/HamERC721EditionDeployerProxy.sol";

contract DeployHamERC721Edition is Script {
    function run() public {
        vm.startBroadcast();

        //STEP 1: deploy of deployer contract
        HamERC721EditionDeployer erc721EditionDeployer = new HamERC721EditionDeployer();

        //STEP 2: Deploy of deployerProxy proxy
        HamERC721EditionDeployerProxy erc721EditionDeployerProxy = new HamERC721EditionDeployerProxy(
            address(erc721EditionDeployer),
            msg.sender,
            abi.encodeWithSelector(HamERC721EditionDeployer.initialize.selector, "")
        );

        //STEP 2.1 Get instance address of deployed proxy
        erc721EditionDeployer = HamERC721EditionDeployer(address(erc721EditionDeployerProxy));

        //Step 3 Deploy contract instance
        erc721EditionDeployer.ham721Deploy('test','tst');

        vm.stopBroadcast();

        console2.log("HamERC721EditionDeployer deployed at:", address(erc721EditionDeployer));
    }
}
