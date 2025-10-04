from dotenv import load_dotenv
import os, requests, json, mimetypes

load_dotenv()

API_KEY = os.getenv("AIORNOT_API_KEY")  
IMAGE_ENDPOINT = "https://api.aiornot.com/v2/image/sync"
VIDEO_ENDPOINT = "https://api.aiornot.com/v2/video/sync"

def detect_file_type(path):
    mime_type, _ = mimetypes.guess_type(path)
    if mime_type:
        if mime_type.startswith("image"):
            return "image"
        elif mime_type.startswith("video"):
            return "video"
    return "unknown"

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

        human_detected = report["ai_generated"]["human"]["is_detected"]
        human_confidence = report["ai_generated"]["human"]["confidence"]

        return {
            "verdict": verdict,
            "ai_detected": ai_detected,
            "ai_confidence": ai_confidence,
            "human_detected": human_detected,
            "human_confidence": human_confidence
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
        return report

def scan_file(path):
    file_type = detect_file_type(path)
    if file_type == "unknown":
        raise ValueError("Unsupported file type")
    
    print(f"Detected file type: {file_type}")

    result = None

    try:
        if file_type == "image":
            result = scan_image(path)
        elif file_type == "video":
            result = scan_video(path)    
    except Exception as e:
        print(f"Error scanning file: {e}")
        return e
    
    return result

print("Result:", scan_file("../media/lion_ai_video.mp4"))
