from typing import Optional
from pydantic import BaseModel, Field, field_validator


class RegisterRequest(BaseModel):
    sha256: str = Field(..., description="64-character lowercase hexadecimal SHA-256 digest")

    @field_validator("sha256")
    def validate_hex(cls, v: str) -> str:
        clean = v.strip().lower()
        if clean.startswith("0x"):
            clean = clean[2:]
        if len(clean) != 64:
            raise ValueError("SHA-256 digest must be exactly 64 hexadecimal characters.")
        try:
            bytes.fromhex(clean)
        except Exception:
            raise ValueError("Invalid hexadecimal string format.")
        return clean


class RegisterResponse(BaseModel):
    success: bool
    sha256: str
    fingerprint: str
    transaction_hash: str
    contract_address: str
    network: str = "hardhat-localhost"
    block_number: int
    timestamp: int
    registrant: str
    error: Optional[str] = None


class VerifyRequest(BaseModel):
    sha256: str = Field(..., description="64-character lowercase hexadecimal SHA-256 digest")

    @field_validator("sha256")
    def validate_hex(cls, v: str) -> str:
        clean = v.strip().lower()
        if clean.startswith("0x"):
            clean = clean[2:]
        if len(clean) != 64:
            raise ValueError("SHA-256 digest must be exactly 64 hexadecimal characters.")
        try:
            bytes.fromhex(clean)
        except Exception:
            raise ValueError("Invalid hexadecimal string format.")
        return clean


class VerifyResponse(BaseModel):
    success: bool
    sha256: str
    fingerprint: str
    registered: bool
    timestamp: Optional[int] = None
    registrant: Optional[str] = None
    contract_address: Optional[str] = None
    network: Optional[str] = None
    error: Optional[str] = None
