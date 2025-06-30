from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from app.models.schemas import Project, ProjectCreate, ProjectUpdate, ProjectStatus
import uuid
from datetime import datetime

router = APIRouter()

# Mock database - replace with actual database integration
projects_db = {}

@router.post("/", response_model=Project, status_code=status.HTTP_201_CREATED)
async def create_project(project: ProjectCreate):
    """Create a new video project"""
    project_id = len(projects_db) + 1
    new_project = Project(
        id=project_id,
        title=project.title,
        description=project.description,
        resolution=project.resolution,
        fps=project.fps,
        status=ProjectStatus.DRAFT,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    projects_db[project_id] = new_project
    return new_project

@router.get("/", response_model=List[Project])
async def list_projects():
    """Get all projects"""
    return list(projects_db.values())

@router.get("/{project_id}", response_model=Project)
async def get_project(project_id: int):
    """Get a specific project by ID"""
    if project_id not in projects_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    return projects_db[project_id]

@router.put("/{project_id}", response_model=Project)
async def update_project(project_id: int, project_update: ProjectUpdate):
    """Update a project"""
    if project_id not in projects_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    existing_project = projects_db[project_id]
    update_data = project_update.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(existing_project, field, value)
    
    existing_project.updated_at = datetime.utcnow()
    projects_db[project_id] = existing_project
    
    return existing_project

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(project_id: int):
    """Delete a project"""
    if project_id not in projects_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    del projects_db[project_id]
    return None

@router.post("/{project_id}/duplicate", response_model=Project)
async def duplicate_project(project_id: int):
    """Duplicate an existing project"""
    if project_id not in projects_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    original_project = projects_db[project_id]
    new_project_id = len(projects_db) + 1
    
    duplicated_project = Project(
        id=new_project_id,
        title=f"{original_project.title} (Copy)",
        description=original_project.description,
        resolution=original_project.resolution,
        fps=original_project.fps,
        status=ProjectStatus.DRAFT,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    projects_db[new_project_id] = duplicated_project
    return duplicated_project