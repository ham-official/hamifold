// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.23;

import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";

import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import {Owned} from "@solmate/auth/Owned.sol";
import {HamERC721Edition} from "./HamERC721Edition.sol";
import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";

contract HamERC721EditionDeployer is Owned, Initializable {
    address public erc721Implementation;
    mapping(address => address[]) creatorToContracts;

    constructor() Owned(address(0)) {
        _disableInitializers();
    }

    struct InitParams {
        address floatiesReg;
    }

    function initialize() public initializer {
        owner = msg.sender;
        erc721Implementation = address(new HamERC721Edition());
        emit OwnershipTransferred(address(0), msg.sender);
    }

    event ContractCreated(address indexed creator, address contractAddr);

    function ham721Deploy(string memory name, string memory token) public {
        address cloneAddress = Clones.clone(erc721Implementation);
        HamERC721Edition(cloneAddress).init(name, token, msg.sender);
        creatorToContracts[msg.sender].push(cloneAddress);
        emit ContractCreated(msg.sender, cloneAddress);
    }

    function getNumberOfContractsForCreator(
        address creator
    ) public view returns (uint256) {
        return creatorToContracts[creator].length;
    }

    function getCreatorContractAtIndex(
        address creator,
        uint256 index
    ) public view returns (address) {
        return creatorToContracts[creator][index];
    }
}
