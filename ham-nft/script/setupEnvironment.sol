// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.23;

import {Script, console2} from "forge-std/Script.sol";
import {ERC721Deployer} from "../src/ERC721Deployer.sol";
import {ERC721DeployerProxy} from "../src/ERC721DeployerProxy.sol";
import {HamERC721EditionDeployer} from "../src/ERC721Edition/HamERC721EditionDeployer.sol";
import {HamERC721EditionDeployerProxy} from "../src/ERC721Edition/HamERC721EditionDeployerProxy.sol";

contract setupEnvironment is Script {
    function run() public {
        vm.startBroadcast();

        /********************************************************************************************
         * HAM ERC721 SETUP
         ********************************************************************************************/
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

        /********************************************************************************************
         * HAM ERC721 EDITION SETUP
         ********************************************************************************************/
        //STEP 1: deploy of deployer contract
        HamERC721EditionDeployer erc721EditionDeployer = new HamERC721EditionDeployer();

        //STEP 2: Deploy of deployerProxy proxy
        HamERC721EditionDeployerProxy erc721EditionDeployerProxy = new HamERC721EditionDeployerProxy(
                address(erc721EditionDeployer),msg.sender,abi.encodeWithSelector(HamERC721EditionDeployer.initialize.selector,""));

        //STEP 2.1 Get instance address of deployed proxy
        erc721EditionDeployer = HamERC721EditionDeployer(
            address(erc721EditionDeployerProxy)
        );

        vm.stopBroadcast();

        console2.log("ERC721Deployer deployed at:", address(erc721Deployer));
        console2.log("ERC721EditionDeployer deployed at:", address(erc721EditionDeployer));
    }
}
