from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import shutil, os, mimetypes, sys
from detector import scan_image, scan_video
from attrClassifier import MediaAnalyzer

def detect_file_type(filename: str):
    mime_type, _ = mimetypes.guess_type(filename)
    if mime_type:
        if mime_type.startswith("image"):
            return "image"
        elif mime_type.startswith("video"):
            return "video"
    return "unknown"

def get_results(file_path):
    file_type = detect_file_type(file_path)

    if file_type == "unknown":
        return ValueError("Unsupported file type")
    
    ai_scan_result = None
    analyzer = MediaAnalyzer()
    if file_type == "image":
        ai_scan_result = scan_image(file_path)
        analysis_result = analyzer._analyze_image(file_path)
    elif file_type == "video":
        ai_scan_result = scan_video(file_path)
        analysis_result = analyzer._analyze_video(file_path)

    return ai_scan_result, analysis_result

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "../media"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.mount("/media", StaticFiles(directory=UPLOAD_FOLDER), name="media")

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)

    # ✅ Validate file type BEFORE saving
    file_type = detect_file_type(file.filename)
    if file_type == "unknown":
        raise HTTPException(status_code=400, detail="Unsupported file type")

    # ✅ Save the uploaded file
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    print(f"✅ File saved to: {filepath}")

    # ✅ You can also run your own script here if needed:
    ai_scan_result, analysis_result = get_results(filepath)

    print(ai_scan_result)
    ai_detected = ai_scan_result["ai_detected"]
    ai_confidence = ai_scan_result["ai_confidence"]
    is_deepfake = ai_scan_result["deepfake_detected"]
    deepfake_confidence = ai_scan_result["deepfake_confidence"]

    if isinstance(ai_scan_result, ValueError):
        raise HTTPException(status_code=400, detail=str(ai_scan_result))

    return {
        "status": "success",
        "filename": file.filename,
        "path": f"/media/{file.filename}",
        "size": os.path.getsize(filepath),
        "type": file_type,
        "ai_detected": ai_detected,
        "ai_confidence": ai_confidence,
        "is_deepfake": is_deepfake,
        "deepfake_confidence": deepfake_confidence,
    }
