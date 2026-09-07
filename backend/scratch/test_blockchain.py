import sys
import os
import requests

sys.path.insert(0, os.path.abspath("."))
sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://127.0.0.1:8000"

def run_blockchain_e2e_tests():
    print("=== TASK BACKEND 6 BLOCKCHAIN REGISTRATION & VERIFICATION TESTS ===")

    # 1. Health Check
    print("\n--- TEST 1: Health Check ---")
    res = requests.get(f"{BASE_URL}/api/health")
    print(f"Status Code: {res.status_code}")
    print(f"Response: {res.json()}")
    assert res.status_code == 200

    # 2. POST /api/scan
    print("\n--- TEST 2: Scan Target Image ---")
    img_url = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60"
    scan_res = requests.post(f"{BASE_URL}/api/scan", data={"preset": "Elena", "image_url": img_url})
    print(f"Scan Status: {scan_res.status_code}")
    assert scan_res.status_code == 200

    # 3. POST /api/search
    print("\n--- TEST 3: Reverse Search & Candidate Retrieval ---")
    search_res = requests.post(f"{BASE_URL}/api/search", data={"preset": "Elena", "image_url": img_url})
    print(f"Search Status: {search_res.status_code}")
    assert search_res.status_code == 200
    search_data = search_res.json()
    candidates = search_data.get("candidates", [])
    print(f"Total Candidates Returned: {len(candidates)}")
    assert len(candidates) > 0, "No search candidates returned!"

    # 4. Extract Real Candidate SHA-256
    target_cand = candidates[0]
    real_sha256 = target_cand.get("sha256")
    print(f"\n--- Selected Real Candidate ({target_cand.get('source')}) ---")
    print(f"Candidate ID: {target_cand.get('id')}")
    print(f"Title: {target_cand.get('title')}")
    print(f"ArcFace Score: {target_cand.get('similarityScore')}%")
    print(f"Real Content SHA-256: {real_sha256}")
    assert real_sha256 and len(real_sha256) == 64, "Invalid candidate SHA-256 digest!"

    # 5. Register Fingerprint on Hardhat Blockchain
    print("\n--- TEST 5: POST /api/blockchain/register ---")
    reg_res = requests.post(f"{BASE_URL}/api/blockchain/register", json={"sha256": real_sha256})
    print(f"Register Status Code: {reg_res.status_code}")
    assert reg_res.status_code == 200
    reg_data = reg_res.json()
    print(f"Success: {reg_data.get('success')}")
    print(f"Bytes32 Fingerprint: {reg_data.get('fingerprint')}")
    print(f"Transaction Hash: {reg_data.get('transaction_hash')}")
    print(f"Block Number: {reg_data.get('block_number')}")
    print(f"Timestamp: {reg_data.get('timestamp')}")
    print(f"Contract Address: {reg_data.get('contract_address')}")
    assert reg_data.get("success") is True
    assert reg_data.get("transaction_hash").startswith("0x")

    # 6. Verify Fingerprint on Hardhat Blockchain
    print("\n--- TEST 6: POST /api/blockchain/verify (Original Content) ---")
    v_res = requests.post(f"{BASE_URL}/api/blockchain/verify", json={"sha256": real_sha256})
    print(f"Verify Status Code: {v_res.status_code}")
    assert v_res.status_code == 200
    v_data = v_res.json()
    print(f"Registered: {v_data.get('registered')}")
    print(f"Timestamp: {v_data.get('timestamp')}")
    print(f"Registrant: {v_data.get('registrant')}")
    assert v_data.get("registered") is True

    # 7. Duplicate Registration Safety Check
    print("\n--- TEST 7: Duplicate Registration Safety ---")
    dup_res = requests.post(f"{BASE_URL}/api/blockchain/register", json={"sha256": real_sha256})
    print(f"Duplicate Status Code: {dup_res.status_code}")
    assert dup_res.status_code == 200
    print(f"Duplicate Tx Hash: {dup_res.json().get('transaction_hash')}")

    # 8. Tamper Verification Demonstration (1-byte modification)
    print("\n--- TEST 8: Tamper Verification (1-Byte Modified Content) ---")
    mutated_char = "0" if real_sha256[0] != "0" else "1"
    tampered_sha256 = mutated_char + real_sha256[1:]
    print(f"Original SHA-256: {real_sha256}")
    print(f"Tampered SHA-256: {tampered_sha256}")

    t_res = requests.post(f"{BASE_URL}/api/blockchain/verify", json={"sha256": tampered_sha256})
    print(f"Tampered Verify Status Code: {t_res.status_code}")
    assert t_res.status_code == 200
    t_data = t_res.json()
    print(f"Tampered Registered Status: {t_data.get('registered')}")
    assert t_data.get("registered") is False, "Tampered SHA-256 must verify as FALSE!"

    # 9. Invalid SHA-256 Input Rejection
    print("\n--- TEST 9: Invalid SHA-256 Input Rejection ---")
    invalid_res = requests.post(f"{BASE_URL}/api/blockchain/verify", json={"sha256": "invalid_too_short"})
    print(f"Invalid Status Code: {invalid_res.status_code}")
    assert invalid_res.status_code in [400, 422]

    print("\n=== ALL BLOCKCHAIN PROVENANCE TESTS PASSED SUCCESSFULLY! ===")

if __name__ == "__main__":
    run_blockchain_e2e_tests()
