// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract RealEstateToken is ERC721URIStorage, AccessControl {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    struct Property {
        string location;
        uint256 valuation;
        uint256 sqft;
        string documentHash; // IPFS hash of legal docs
        bool isVerified;
        uint256 timestamp;
    }

    mapping(uint256 => Property) public properties;

    event PropertyTokenized(uint256 indexed tokenId, address indexed owner, string location, uint256 valuation);
    event PropertyVerified(uint256 indexed tokenId, address indexed verifier);

    constructor() ERC721("CashDapp Real Estate", "CDRE") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
    }

    function tokenizeProperty(
        address to,
        string memory tokenURI,
        string memory _location,
        uint256 _valuation,
        uint256 _sqft,
        string memory _documentHash
    ) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(to, newItemId);
        _setTokenURI(newItemId, tokenURI);

        properties[newItemId] = Property({
            location: _location,
            valuation: _valuation,
            sqft: _sqft,
            documentHash: _documentHash,
            isVerified: false,
            timestamp: block.timestamp
        });

        emit PropertyTokenized(newItemId, to, _location, _valuation);

        return newItemId;
    }

    function verifyProperty(uint256 tokenId) public onlyRole(VERIFIER_ROLE) {
        require(_exists(tokenId), "Property does not exist");
        properties[tokenId].isVerified = true;
        emit PropertyVerified(tokenId, msg.sender);
    }

    function getPropertyDetails(uint256 tokenId) public view returns (Property memory) {
        require(_exists(tokenId), "Property does not exist");
        return properties[tokenId];
    }

    // Override supportsInterface for AccessControl
    function supportsInterface(bytes4 interfaceId) public view override(ERC721URIStorage, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
