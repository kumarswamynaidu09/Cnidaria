import os
import json
import logging
from typing import Dict, Any, Tuple, Optional
from web3 import Web3

logger = logging.getLogger(__name__)

# Default Hardhat local EVM development configuration
DEFAULT_RPC_URL = os.getenv("BLOCKCHAIN_RPC_URL", "http://127.0.0.1:8545")
# Hardhat Account #0 default development private key (for local dev chain only)
DEFAULT_PRIVATE_KEY = os.getenv("BLOCKCHAIN_PRIVATE_KEY", "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80")

CONTRACT_ABI = [
    {
        "inputs": [{"name": "fingerprint", "type": "bytes32"}],
        "name": "registerFingerprint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"name": "fingerprint", "type": "bytes32"}],
        "name": "verifyFingerprint",
        "outputs": [
            {"name": "registered", "type": "bool"},
            {"name": "timestamp", "type": "uint256"},
            {"name": "registrant", "type": "address"}
        ],
        "stateMutability": "view",
        "type": "function"
    }
]


def load_deployment_address() -> str:
    """Reads deployed contract address from deployment-info.json or env variable."""
    env_addr = os.getenv("BLOCKCHAIN_CONTRACT_ADDRESS")
    if env_addr:
        return env_addr
    
    # Try reading from blockchain directory deployment metadata
    deployment_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../blockchain/deployment-info.json"))
    if os.path.exists(deployment_path):
        try:
            with open(deployment_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                return data.get("address", "0x5FbDB2315678afecb367f032d93F642f64180aa3")
        except Exception as e:
            logger.warning(f"Could not read deployment-info.json: {e}")
            
    return "0x5FbDB2315678afecb367f032d93F642f64180aa3"


def validate_and_convert_sha256(sha256_hex: str) -> bytes:
    """
    Validates a 64-character SHA-256 hex string and converts it to exact 32 bytes (bytes32).
    """
    if not sha256_hex:
        raise ValueError("SHA-256 string cannot be empty.")
    
    clean_hex = sha256_hex.strip().lower()
    if clean_hex.startswith("0x"):
        clean_hex = clean_hex[2:]

    if len(clean_hex) != 64:
        raise ValueError(f"Invalid SHA-256 length ({len(clean_hex)} chars). Must be exactly 64 hexadecimal characters.")

    try:
        return bytes.fromhex(clean_hex)
    except Exception as err:
        raise ValueError(f"Invalid hexadecimal string: {err}")


class BlockchainService:
    def __init__(self):
        self.rpc_url = DEFAULT_RPC_URL
        self.private_key = DEFAULT_PRIVATE_KEY
        self.contract_address = load_deployment_address()
        self.w3 = Web3(Web3.HTTPProvider(self.rpc_url))
        
        if self.w3.is_connected():
            self.account = self.w3.eth.account.from_key(self.private_key)
            self.contract = self.w3.eth.contract(
                address=Web3.to_checksum_address(self.contract_address),
                abi=CONTRACT_ABI
            )
            logger.info(f"Connected to Hardhat EVM at {self.rpc_url}. Contract: {self.contract_address}")
        else:
            logger.warning(f"Could not connect to Hardhat node at {self.rpc_url}.")
            self.contract = None

    def is_connected(self) -> bool:
        return self.w3.is_connected() and self.contract is not None

    def register_fingerprint(self, sha256_hex: str) -> Dict[str, Any]:
        """
        Registers a 64-character SHA-256 content digest on the local Hardhat blockchain.
        Returns mined transaction details.
        """
        if not self.is_connected():
            raise RuntimeError("Blockchain RPC node is offline or disconnected.")

        fp_bytes32 = validate_and_convert_sha256(sha256_hex)
        tx_func = self.contract.functions.registerFingerprint(fp_bytes32)

        # Build transaction
        nonce = self.w3.eth.get_transaction_count(self.account.address)
        tx_params = tx_func.build_transaction({
            "from": self.account.address,
            "nonce": nonce,
            "gas": 200000,
            "gasPrice": self.w3.eth.gas_price
        })

        # Sign and send transaction
        signed_tx = self.w3.eth.account.sign_transaction(tx_params, private_key=self.private_key)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.raw_transaction)
        
        # Wait for transaction mining receipt
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        block = self.w3.eth.get_block(receipt.blockNumber)

        tx_hash_hex = receipt.transactionHash.hex()
        if not tx_hash_hex.startswith("0x"):
            tx_hash_hex = "0x" + tx_hash_hex

        return {
            "success": True,
            "sha256": sha256_hex.lower(),
            "fingerprint": "0x" + sha256_hex.lower(),
            "transaction_hash": tx_hash_hex,
            "contract_address": self.contract_address,
            "network": "hardhat-localhost",
            "block_number": receipt.blockNumber,
            "timestamp": block.timestamp,
            "registrant": self.account.address
        }

    def verify_fingerprint(self, sha256_hex: str) -> Dict[str, Any]:
        """
        Queries the blockchain contract to verify whether a SHA-256 fingerprint is registered.
        """
        if not self.is_connected():
            raise RuntimeError("Blockchain RPC node is offline or disconnected.")

        fp_bytes32 = validate_and_convert_sha256(sha256_hex)
        registered, timestamp, registrant = self.contract.functions.verifyFingerprint(fp_bytes32).call()

        if registered:
            return {
                "success": True,
                "sha256": sha256_hex.lower(),
                "fingerprint": "0x" + sha256_hex.lower(),
                "registered": True,
                "timestamp": timestamp,
                "registrant": registrant,
                "contract_address": self.contract_address,
                "network": "hardhat-localhost"
            }

        return {
            "success": True,
            "sha256": sha256_hex.lower(),
            "fingerprint": "0x" + sha256_hex.lower(),
            "registered": False
        }


# Singleton blockchain service instance
blockchain_service = BlockchainService()
