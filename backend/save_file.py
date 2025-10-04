from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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

    # ✅ Validate file type BEFORE saving
    file_type = detect_file_type(file.filename)
    if file_type == "unknown":
        raise HTTPException(status_code=400, detail="Unsupported file type")

    # ✅ Save the uploaded file
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    print(f"✅ File saved to: {filepath}")

    # ✅ Call your analysis script and pass the saved path
    try:
        subprocess.run(["python", "main.py", filepath], check=True)
    except subprocess.CalledProcessError as e:
        print("❌ Error running main.py:", e)
        raise HTTPException(status_code=500, detail="Error analyzing file")

    return {
        "status": "success",
        "filename": file.filename,
        "path": filepath,
        "size": os.path.getsize(filepath),
        "type": file_type,
    }
