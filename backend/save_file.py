from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from detector import scan_image, scan_video
from attrClassifier import MediaAnalyzer
from explainability import ExplainabilityEngine

import shutil, os, subprocess, mimetypes

app = FastAPI()

# ✅ Allow React (Vite) frontend on port 8080 to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "../media"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def detect_file_type(filename: str):
    mime_type, _ = mimetypes.guess_type(filename)
    if mime_type:
        if mime_type.startswith("image"):
            return "image"
        elif mime_type.startswith("video"):
            return "video"
    return "unknown"

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)

    filetype = detect_file_type(file.filename)
    if filetype == "unknown":
        raise HTTPException(status_code=400, detail="Unsupported file type")

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    print(f"File saved to: {filepath}")

    results = analyze_file(filepath, filetype)

    return {
        "status": "success",
        "filename": file.filename,
        "path": filepath,
        "size": os.path.getsize(filepath),
        "type": filetype,
        ""
    }

@app.post("/analyze")
def analyze_file(file_path: str, file_type):

    explainer = ExplainabilityEngine()
    
    analyzer = MediaAnalyzer()

    if file_type == "image":
        ai_scan_result = scan_image(file_path)
        analysis_result =  analyzer._analyze_image(file_path)
        briefOverview =  explainer.explain_overall_analysis(analysis_result)
    elif file_type == "video":
        ai_scan_result = scan_video(file_path)
        analysis_result =  analyzer._analyze_video(file_path)
        briefOverview = explainer.explain_overall_analysis(analysis_result)

        return ai_scan_result, analysis_result, briefOverview

