import sys
import os
import requests

sys.path.insert(0, os.path.abspath("."))
sys.stdout.reconfigure(encoding='utf-8')

from app.core.fingerprint import calculate_sha256

BASE_URL = "http://127.0.0.1:8000"

def run_fingerprint_tests():
    print("=== TASK BACKEND 5 SHA-256 FINGERPRINTING TESTS ===")

    # 1. Determinism Unit Tests
    print("\n--- TEST 1: Hash of b'hello' ---")
    h_hello = calculate_sha256(b"hello")
    expected_hello = "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
    print(f"Result:   {h_hello}")
    print(f"Expected: {expected_hello}")
    assert h_hello == expected_hello, "b'hello' hash mismatch!"

    print("\n--- TEST 2: Identical Bytes Determinism ---")
    data_sample = b"Visual content byte payload 12345"
    h1 = calculate_sha256(data_sample)
    h2 = calculate_sha256(data_sample)
    print(f"Hash 1: {h1}")
    print(f"Hash 2: {h2}")
    assert h1 == h2, "Identical bytes hash mismatch!"

    print("\n--- TEST 3: One-Byte Mutation Tamper Detection ---")
    mutated_sample = bytearray(data_sample)
    mutated_sample[0] ^= 0xFF  # Flip first byte
    h_mutated = calculate_sha256(bytes(mutated_sample))
    print(f"Original Hash: {h1}")
    print(f"Mutated Hash:  {h_mutated}")
    assert h1 != h_mutated, "One-byte mutation should produce a different hash!"

    print("\n--- TEST 4: Empty Bytes Hash ---")
    h_empty = calculate_sha256(b"")
    expected_empty = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    print(f"Result:   {h_empty}")
    print(f"Expected: {expected_empty}")
    assert h_empty == expected_empty, "Empty bytes hash mismatch!"

    # 2. Real Candidate Image One-Byte Tamper Test
    print("\n--- TEST 5: Real Candidate Image 1-Byte Tamper Test ---")
    img_url = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60"
    resp = requests.get(img_url)
    orig_bytes = resp.content
    orig_hash = calculate_sha256(orig_bytes)

    tampered_bytes = bytearray(orig_bytes)
    tampered_bytes[100] ^= 0x01  # Mutate 1 byte at index 100
    tampered_hash = calculate_sha256(bytes(tampered_bytes))

    print(f"Original Image Size: {len(orig_bytes)} bytes")
    print(f"Original SHA-256: {orig_hash}")
    print(f"Tampered SHA-256: {tampered_hash}")
    assert orig_hash != tampered_hash, "Tampered candidate hash match error!"

    # 3. End-to-End Search Pipeline Test with SHA-256
    print("\n--- TEST 6: End-to-End Pipeline SHA-256 Fingerprint Verification ---")
    scan_res = requests.post(f"{BASE_URL}/api/scan", data={"preset": "Elena", "image_url": img_url})
    print(f"Scan Status: {scan_res.status_code}")

    search_res = requests.post(f"{BASE_URL}/api/search", data={"preset": "Elena", "image_url": img_url})
    print(f"Search Status: {search_res.status_code}")

    search_data = search_res.json()
    print(f"Provider: {search_data.get('provider')}")
    print(f"Total Candidates: {search_data.get('candidate_count')}")
    print(f"Matched Candidates: {search_data.get('matched_count')}")

    candidates = search_data.get("candidates", [])
    if candidates:
        print("\nCandidate Fingerprints Breakdown:")
        for idx, cand in enumerate(candidates[:5]):
            print(f" #{idx+1} | SHA-256: {cand.get('sha256')} | Score: {cand.get('similarityScore')}% | Source: {cand.get('source')}")
            if cand.get("sha256"):
                assert len(cand.get("sha256")) == 64, f"Invalid SHA-256 hash length for candidate {cand['id']}"

if __name__ == "__main__":
    run_fingerprint_tests()
