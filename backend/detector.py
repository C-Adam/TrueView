from dotenv import load_dotenv
import os, requests

load_dotenv()

API_KEY = os.getenv("AIORNOT_API_KEY")  
IMAGE_ENDPOINT = "https://api.aiornot.com/v2/image/sync"
VIDEO_ENDPOINT = "https://api.aiornot.com/v2/video/sync"

def scan_image(img_path):
    with open(img_path, "rb") as image_file:
        files = {"image": image_file}
        resp = requests.post(
            IMAGE_ENDPOINT,
            headers={"Authorization": f"Bearer {API_KEY}"}, 
            files=files
        )

        if resp.status_code != 200:
            raise Exception(f"Failed to analyze image: {resp.status_code} {resp.text}")

        data = resp.json()
        report = data["report"]

        verdict = report["ai_generated"]["verdict"]

        ai_detected = report["ai_generated"]["ai"]["is_detected"]
        ai_confidence = report["ai_generated"]["ai"]["confidence"]

        return {
            "verdict": verdict,
            "ai_detected": ai_detected,
            "ai_confidence": ai_confidence,
        }

def scan_video(video_path):
    with open(video_path, "rb") as video_file:
        files = {"video": video_file}
        resp = requests.post(
            VIDEO_ENDPOINT,
            headers={"Authorization": f"Bearer {API_KEY}"},
            files=files,
            timeout=120
        )

        if resp.status_code != 200:
            raise Exception(f"Failed to analyze video: {resp.status_code} {resp.text}")
        
        data = resp.json()
        report = data["report"]
        verdict = report["ai_generated"]["verdict"]
        ai_detected = report["ai_generated"]["ai"]["is_detected"]
        ai_confidence = report["ai_generated"]["ai"]["confidence"]

        return {
            "verdict": verdict,
            "ai_detected": ai_detected,
            "ai_confidence": ai_confidence,
        }