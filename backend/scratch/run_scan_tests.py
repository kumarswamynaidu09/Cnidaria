import io
import requests
import numpy as np
import cv2
from PIL import Image, ImageDraw

BASE_URL = "http://127.0.0.1:8000"

def create_blank_image():
    """Generates an image with zero faces."""
    img = Image.new("RGB", (400, 400), color=(200, 200, 200))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()

def create_text_file():
    """Generates invalid non-image content."""
    return b"This is a text file, not an image."

def run_tests():
    print("=== TASK BACKEND 2 VERIFICATION TESTS ===")
    
    # 1. Health Endpoint Test
    print("\n--- TEST 1: GET /api/health ---")
    res = requests.get(f"{BASE_URL}/api/health")
    print(f"Status Code: {res.status_code}")
    print(f"Response: {res.json()}")

    # 2. Blank / No Face Image Test
    print("\n--- TEST 2: Blank Image (No Face) ---")
    blank_bytes = create_blank_image()
    files = {"file": ("blank.jpg", blank_bytes, "image/jpeg")}
    res = requests.post(f"{BASE_URL}/api/scan", files=files)
    print(f"Status Code: {res.status_code}")
    print(f"Response: {res.json()}")

    # 3. Invalid Non-Image File Test
    print("\n--- TEST 3: Invalid Non-Image File ---")
    text_bytes = create_text_file()
    files = {"file": ("document.txt", text_bytes, "text/plain")}
    res = requests.post(f"{BASE_URL}/api/scan", files=files)
    print(f"Status Code: {res.status_code}")
    print(f"Response: {res.json()}")

    # 4. Preset Image Test (Elena)
    print("\n--- TEST 4: Preset Reference Scan (Elena) ---")
    res = requests.post(
        f"{BASE_URL}/api/scan",
        data={"preset": "Elena", "image_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60"}
    )
    print(f"Status Code: {res.status_code}")
    print(f"Response: {res.json()}")

if __name__ == "__main__":
    run_tests()
