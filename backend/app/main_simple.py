from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uuid

app = FastAPI(title="Video Creation API", version="1.0.0")

# Simple CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple data models
class Project(BaseModel):
    id: str
    name: str
    
class AIRequest(BaseModel):
    prompt: str
    type: str  # "image" or "video"

# In-memory storage (simple)
projects = {}
generations = {}

@app.get("/")
def root():
    return {"message": "Video Creation API"}

@app.post("/projects", response_model=Project)
def create_project(name: str):
    project_id = str(uuid.uuid4())
    project = Project(id=project_id, name=name)
    projects[project_id] = project
    return project

@app.get("/projects", response_model=List[Project])
def list_projects():
    return list(projects.values())

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    return {"filename": file.filename, "size": file.size}

@app.post("/generate")
def generate_ai_content(request: AIRequest):
    generation_id = str(uuid.uuid4())
    generations[generation_id] = {
        "id": generation_id,
        "status": "processing",
        "prompt": request.prompt,
        "type": request.type
    }
    return {"id": generation_id, "status": "processing"}

@app.get("/generate/{generation_id}")
def get_generation_status(generation_id: str):
    if generation_id not in generations:
        raise HTTPException(status_code=404, detail="Generation not found")
    return generations[generation_id]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)