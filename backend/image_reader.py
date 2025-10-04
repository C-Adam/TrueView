from dotenv import load_dotenv
import os, requests, json

load_dotenv()

API_KEY = os.getenv("AIORNOT_API_KEY")  
IMAGE_ENDPOINT = "https://api.aiornot.com/v2/image/sync"

with open("../images/test_real.jpg", "rb") as image_file:
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

    # Extract just the parts you want
    verdict = report["ai_generated"]["verdict"]

    ai_detected = report["ai_generated"]["ai"]["is_detected"]
    ai_confidence = report["ai_generated"]["ai"]["confidence"]

    human_detected = report["ai_generated"]["human"]["is_detected"]
    human_confidence = report["ai_generated"]["human"]["confidence"]

    # Print them cleanly
    print("Verdict:", verdict.upper())
    print(f"AI Generated: {ai_detected} (confidence {ai_confidence})")
    print(f"Human: {human_detected} (confidence {human_confidence})")
