from fastapi import FastAPI, File, UploadFile
import shutil, os, subprocess
import os

app = FastAPI()
UPLOAD_FOLDER = "media"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"message": "File uploaded successfully", "path": filepath}

subprocess.run(["python", "main.py"])
