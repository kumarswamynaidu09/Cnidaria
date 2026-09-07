import sys
import requests
import io

sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://127.0.0.1:8000"

def run_all_search_tests():
    print("=== TASK BACKEND 3 VERIFICATION TESTS ===")

    # TEST 7: GET /api/health
    print("\n--- TEST 7: GET /api/health ---")
    res = requests.get(f"{BASE_URL}/api/health")
    print(f"Status Code: {res.status_code}")
    print(f"Response: {res.json()}")

    # TEST 2: Invalid non-image upload
    print("\n--- TEST 2: Invalid Non-Image Upload ---")
    files = {"file": ("document.txt", b"Not an image file content", "text/plain")}
    res = requests.post(f"{BASE_URL}/api/search", files=files)
    print(f"Status Code: {res.status_code}")
    print(f"Response: {res.json()}")

    # TEST 3: Oversized image (>10MB)
    print("\n--- TEST 3: Oversized Image (>10MB) ---")
    large_bytes = b"\xFF\xD8\xFF\xE0" + (b"\x00" * (11 * 1024 * 1024))
    print(f"Generated Payload Size: {round(len(large_bytes)/(1024*1024), 2)} MB")
    files = {"file": ("large.jpg", large_bytes, "image/jpeg")}
    res = requests.post(f"{BASE_URL}/api/search", files=files)
    print(f"Status Code: {res.status_code}")
    print(f"Response: {res.json()}")

    # TEST 1: Real Image Reverse Search
    print("\n--- TEST 1: Real Face Image Reverse Search ---")
    face_url = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60"
    img_resp = requests.get(face_url)
    files = {"file": ("elena.jpg", img_resp.content, "image/jpeg")}
    res = requests.post(f"{BASE_URL}/api/search", files=files)
    print(f"Status Code: {res.status_code}")
    data = res.json()
    print(f"Success: {data.get('success')}")
    print(f"Provider: {data.get('provider')}")
    print(f"Candidate Count: {data.get('candidate_count')}")
    if data.get('candidates'):
        print("First 3 Candidates:")
        for cand in data['candidates'][:3]:
            print(f" - [{cand.get('source_type')}] {cand.get('source')}: {cand.get('title')} -> {cand.get('url')}")

if __name__ == "__main__":
    run_all_search_tests()
