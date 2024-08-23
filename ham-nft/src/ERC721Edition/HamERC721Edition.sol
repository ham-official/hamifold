// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Pausable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import {Owned} from "@solmate/auth/Owned.sol";

contract HamERC721Edition is ERC721Pausable, Owned {
    using Strings for uint256;
    bool initialized;

    string _name;
    string _symbol;

    constructor() ERC721("", "") Owned(address(0)) {}

    event Minted(
        address indexed _from,
        uint256 indexed tokenType,
        uint256 indexed tokenId,
        uint256 _value
    );

    function init(
        string calldata __name,
        string calldata __symbol,
        address _owner
    ) public returns (address) {
        require(!initialized, "Already initialized");
        _name = __name;
        _symbol = __symbol;
        owner = _owner;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    struct EditionInfo {
        string name;
        string image;
        string description;
        uint mintStart;
        uint mintEnd;
        uint maxSupply;
        uint totalSupply;
        uint tokenPrice;
        uint maxNumberOfTokensPerWallet;
    }

    mapping(uint => EditionInfo) public typeIDToInfo;

    struct Edition {
        uint typeId;
        uint edition;
    }

    mapping(uint => Edition) public tokenIdToEdition;

    uint public nextTokenId = 1;
    uint public nextTokenTypeId = 1;

    function createEditionInfo(
        string memory tokenName,
        string memory image,
        string memory description,
        uint mintStart,
        uint mintEnd,
        uint maxSupply,
        uint tokenPrice,
        uint maxNumberOfTokensPerWallet
    ) public onlyOwner {
        EditionInfo storage info = typeIDToInfo[nextTokenTypeId];
        info.name = tokenName;
        info.image = image;
        info.description = description;
        info.mintStart = mintStart;
        info.mintEnd = mintEnd;
        info.maxSupply = maxSupply;
        info.totalSupply = 0;
        info.tokenPrice = tokenPrice * 1 gwei;
        info.maxNumberOfTokensPerWallet = maxNumberOfTokensPerWallet;
        nextTokenTypeId++;
    }

    function _getStatString(
        string memory key,
        string memory value
    ) private pure returns (string memory) {
        return
            string.concat('{"trait_type":"', key, '","value":"', value, '"}');
    }

    function tokenURI(
        uint tokenId
    ) public view override returns (string memory) {
        Edition memory tokenEdition = tokenIdToEdition[tokenId];
        EditionInfo storage info = typeIDToInfo[tokenEdition.typeId];

        return
            string.concat(
                "data:application/json;base64,",
                Base64.encode(
                    bytes(
                        string.concat(
                            '{"name":"',
                            info.name,
                            " #",
                            tokenEdition.edition.toString(),
                            " / ",
                            info.totalSupply.toString(),
                            '","image":"',
                            info.image,
                            '","description":"',
                            info.description,
                            '","attributes":[',
                            _getStatString(
                                "typeId",
                                tokenEdition.typeId.toString()
                            ),
                            ",",
                            _getStatString(
                                "edition",
                                tokenEdition.edition.toString()
                            ),
                            ",",
                            _getStatString(
                                "totalSupply",
                                info.totalSupply.toString()
                            ),
                            "]}"
                        )
                    )
                )
            );
    }

    function batchMint(
        uint tokenType,
        uint numberOfTokens
    ) public payable whenNotPaused {
        EditionInfo storage info = typeIDToInfo[tokenType];

        require(tokenType < nextTokenTypeId, "Non existing token type");
        require(numberOfTokens > 0, "Must mint at least one token");
        require(
            msg.value >= info.tokenPrice * numberOfTokens,
            "Insufficient funds"
        );

        if (info.mintStart > 0) {
            require(
                block.timestamp >= info.mintStart,
                "Minting has not started yet"
            );
        }
        if (info.mintEnd > 0) {
            require(block.timestamp <= info.mintEnd, "Minting has ended");
        }
        if (info.maxSupply > 0) {
            require(
                info.totalSupply + numberOfTokens <= info.maxSupply,
                "Max supply reached"
            );
        }

        uint mintCount = balanceOf(msg.sender);
        if (info.maxNumberOfTokensPerWallet > 0) {
            require(
                mintCount + numberOfTokens <= info.maxNumberOfTokensPerWallet,
                "Exceeds max tokens per wallet"
            );
        }

        for (uint i = 0; i < numberOfTokens; i++) {
            uint newTokenId = nextTokenId;
            tokenIdToEdition[newTokenId] = Edition({
                typeId: tokenType,
                edition: info.totalSupply + 1
            });

            _mint(msg.sender, newTokenId);
            info.totalSupply++;
            nextTokenId++;

            emit Minted(
                msg.sender,
                tokenType,
                newTokenId,
                msg.value / numberOfTokens
            );
        }

        if (msg.value > 0) {
            payable(owner).transfer(msg.value);
        }
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function name() public view override returns (string memory) {
        return _name;
    }

    function symbol() public view override returns (string memory) {
        return _symbol;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
