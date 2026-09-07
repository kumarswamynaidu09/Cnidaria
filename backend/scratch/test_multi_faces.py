import requests
import io
import urllib.request
from PIL import Image

BASE_URL = "http://127.0.0.1:8000"

def run_multiface_test():
    print("--- TEST: Multi-Face Image (Side-by-side face stitch) ---")
    face_url = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60"
    
    req = urllib.request.Request(face_url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req) as resp:
        img_single = Image.open(io.BytesIO(resp.read())).convert("RGB")
    
    w, h = img_single.size
    combined = Image.new("RGB", (w * 2, h))
    combined.paste(img_single, (0, 0))
    combined.paste(img_single, (w, 0))
    
    buf = io.BytesIO()
    combined.save(buf, format="JPEG")
    buf.seek(0)
    
    files = {"file": ("double_face.jpg", buf.getvalue(), "image/jpeg")}
    res = requests.post(f"{BASE_URL}/api/scan", files=files)
    print(f"Status Code: {res.status_code}")
    print(f"Response: {res.json()}")

if __name__ == "__main__":
    run_multiface_test()
