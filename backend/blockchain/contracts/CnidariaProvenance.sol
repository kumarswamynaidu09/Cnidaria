// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title CnidariaProvenance
 * @dev Cryptographic content fingerprint provenance ledger contract.
 * Registers and verifies 32-byte (bytes32) SHA-256 digests on-chain.
 * Biometric data and image payloads are NEVER stored on-chain.
 */
contract CnidariaProvenance {
    struct Record {
        bool registered;
        uint256 timestamp;
        address registrant;
    }

    // Mapping from SHA-256 bytes32 fingerprint to registration record
    mapping(bytes32 => Record) private records;

    // Emitted when a new SHA-256 fingerprint is registered on-chain
    event FingerprintRegistered(
        bytes32 indexed fingerprint,
        address indexed registrant,
        uint256 timestamp
    );

    /**
     * @notice Register a SHA-256 content fingerprint on the blockchain.
     * @param fingerprint The bytes32 SHA-256 digest of the original content bytes.
     */
    function registerFingerprint(bytes32 fingerprint) external {
        require(fingerprint != bytes32(0), "Cnidaria: zero fingerprint not allowed");

        // Prevent accidental duplicate registrations from overwriting original provenance record
        if (!records[fingerprint].registered) {
            records[fingerprint] = Record({
                registered: true,
                timestamp: block.timestamp,
                registrant: msg.sender
            });

            emit FingerprintRegistered(fingerprint, msg.sender, block.timestamp);
        }
    }

    /**
     * @notice Verify whether a SHA-256 content fingerprint exists on the blockchain.
     * @param fingerprint The bytes32 SHA-256 digest to verify.
     * @return registered True if the fingerprint was previously registered.
     * @return timestamp The block timestamp when the fingerprint was first registered.
     * @return registrant The wallet address that registered the fingerprint.
     */
    function verifyFingerprint(bytes32 fingerprint)
        external
        view
        returns (
            bool registered,
            uint256 timestamp,
            address registrant
        )
    {
        Record memory rec = records[fingerprint];
        return (rec.registered, rec.timestamp, rec.registrant);
    }
}
