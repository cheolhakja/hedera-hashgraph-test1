// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ImageRegistry {
    struct Image {
        string fileHash;     // hash of image (IPFS CID, SHA256 etc...)
        uint256 fileSize;    // image size (bytes)
        address uploader;    // uploader wallet address
        uint256 reward;      // amount of reward
    }

    mapping(uint256 => Image) public images;
    uint256 public imageCount;

    event ImageRegistered(
        uint256 indexed imageId,
        address indexed uploader,
        uint256 fileSize,
        uint256 reward
    );

    function registerImage(
        string memory fileHash,
        uint256 fileSize,
        uint256 reward
    ) public {
        imageCount++;

        images[imageCount] = Image(
            fileHash,
            fileSize,
            msg.sender,
            reward
        );

        emit ImageRegistered(
            imageCount,
            msg.sender,
            fileSize,
            reward
        );
    }

    function getImage(uint256 id)
        public
        view
        returns (
            string memory,
            uint256,
            address,
            uint256
        )
    {
        Image memory img = images[id];
        return (
            img.fileHash,
            img.fileSize,
            img.uploader,
            img.reward
        );
    }
}