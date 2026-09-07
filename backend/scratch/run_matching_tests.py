import sys
import time
import requests

sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://127.0.0.1:8000"

def run_matching_test_suite():
    print("=== TASK BACKEND 4 END-TO-END MATCHING & RANKING TESTS ===")

    # 1. Health Check
    print("\n--- TEST 1: Health Check ---")
    res = requests.get(f"{BASE_URL}/api/health")
    print(f"Status Code: {res.status_code}")
    print(f"Response: {res.json()}")

    # 2. POST /api/scan (Scan Target Face Image)
    print("\n--- TEST 2: POST /api/scan (Target Face Scanning) ---")
    face_url = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60"
    img_resp = requests.get(face_url)
    files = {"file": ("target_elena.jpg", img_resp.content, "image/jpeg")}
    
    t0 = time.time()
    scan_res = requests.post(f"{BASE_URL}/api/scan", files=files, data={"preset": "Elena"})
    scan_time = round(time.time() - t0, 2)
    print(f"Status Code: {scan_res.status_code} ({scan_time}s)")
    scan_data = scan_res.json()
    print(f"Face Detected: {scan_data.get('faceDetected')}")
    print(f"Face Count: {scan_data.get('face_count')}")
    print(f"Embedding Dimensions: {scan_data.get('face', {}).get('embedding', {}).get('dimensions')}")

    # 3. POST /api/search (Reverse Search + Candidate Download + ArcFace Matching + Ranking)
    print("\n--- TEST 3: POST /api/search (Candidate Matching & ArcFace Ranking) ---")
    files = {"file": ("target_elena.jpg", img_resp.content, "image/jpeg")}
    
    t0 = time.time()
    search_res = requests.post(f"{BASE_URL}/api/search", files=files, data={"preset": "Elena"})
    search_time = round(time.time() - t0, 2)
    
    print(f"Status Code: {search_res.status_code} ({search_time}s)")
    search_data = search_res.json()
    
    print(f"Success: {search_data.get('success')}")
    print(f"Provider Used: {search_data.get('provider')}")
    print(f"Total Candidates: {search_data.get('candidate_count')}")
    print(f"Matched Candidates: {search_data.get('matched_count')}")
    
    candidates = search_data.get("candidates", [])
    if candidates:
        print("\n--- Candidate Evaluation & Ranking Breakdown ---")
        for idx, cand in enumerate(candidates):
            status = cand.get("face_status")
            score = cand.get("similarityScore")
            cls = cand.get("match_classification")
            source = cand.get("source")
            title = cand.get("title")
            print(f" #{idx+1} | Status: [{status}] | Score: {score}% ({cls}) | Source: {source} | Title: {title}")

if __name__ == "__main__":
    run_matching_test_suite()
