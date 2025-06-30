from fastapi import APIRouter, HTTPException, UploadFile, File, Form, status
from fastapi.responses import FileResponse
from typing import List, Optional
from app.models.schemas import Media, MediaCreate, VideoProcessingRequest, VideoProcessingResponse, Timeline, TimelineClip
import uuid
import os
from datetime import datetime

router = APIRouter()

# Mock database
media_db = {}
processing_tasks = {}

@router.post("/upload", response_model=Media, status_code=status.HTTP_201_CREATED)
async def upload_video(
    file: UploadFile = File(...),
    project_id: int = Form(...)
):
    """Upload a video file"""
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file selected"
        )
    
    # Validate file type
    allowed_extensions = ['.mp4', '.avi', '.mov', '.mkv', '.jpg', '.jpeg', '.png']
    file_extension = os.path.splitext(file.filename)[1].lower()
    
    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type {file_extension} not supported"
        )
    
    # Generate unique filename
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = f"uploads/{unique_filename}"
    
    # In a real implementation, you would:
    # 1. Save the file to disk or cloud storage
    # 2. Extract metadata (duration, resolution, etc.)
    # 3. Generate thumbnails
    
    media_id = len(media_db) + 1
    new_media = Media(
        id=media_id,
        project_id=project_id,
        filename=file.filename,
        file_type=file_extension[1:],  # Remove the dot
        file_size=0,  # Would be actual file size
        file_path=file_path,
        duration=30.0 if file_extension in ['.mp4', '.avi', '.mov', '.mkv'] else None,
        created_at=datetime.utcnow()
    )
    
    media_db[media_id] = new_media
    return new_media

@router.get("/project/{project_id}", response_model=List[Media])
async def get_project_media(project_id: int):
    """Get all media files for a project"""
    project_media = [media for media in media_db.values() if media.project_id == project_id]
    return project_media

@router.get("/{media_id}", response_model=Media)
async def get_media(media_id: int):
    """Get media file details"""
    if media_id not in media_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Media not found"
        )
    return media_db[media_id]

@router.get("/{media_id}/download")
async def download_media(media_id: int):
    """Download a media file"""
    if media_id not in media_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Media not found"
        )
    
    media = media_db[media_id]
    # In a real implementation, return the actual file
    return {"download_url": f"/files/{media.file_path}"}

@router.delete("/{media_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_media(media_id: int):
    """Delete a media file"""
    if media_id not in media_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Media not found"
        )
    
    # In a real implementation, also delete the actual file
    del media_db[media_id]
    return None

@router.post("/process", response_model=VideoProcessingResponse)
async def process_video(request: VideoProcessingRequest):
    """Process video with specified operations"""
    # Validate media IDs exist
    for media_id in request.media_ids:
        if media_id not in media_db:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Media {media_id} not found"
            )
    
    task_id = str(uuid.uuid4())
    processing_task = VideoProcessingResponse(
        task_id=task_id,
        status="processing",
        progress=0.0,
        result_url=None,
        estimated_completion=None
    )
    
    processing_tasks[task_id] = processing_task
    
    # In a real implementation, start background processing task
    return processing_task

@router.get("/process/{task_id}", response_model=VideoProcessingResponse)
async def get_processing_status(task_id: str):
    """Get video processing status"""
    if task_id not in processing_tasks:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Processing task not found"
        )
    
    return processing_tasks[task_id]

@router.post("/timeline", response_model=Timeline)
async def save_timeline(timeline: Timeline):
    """Save project timeline"""
    # Validate that all media IDs in clips exist
    for clip in timeline.clips:
        if clip.media_id not in media_db:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Media {clip.media_id} not found"
            )
    
    # In a real implementation, save to database
    return timeline

@router.get("/timeline/{project_id}", response_model=Timeline)
async def get_timeline(project_id: int):
    """Get project timeline"""
    # Mock timeline data
    mock_clips = []
    project_media = [media for media in media_db.values() if media.project_id == project_id]
    
    for i, media in enumerate(project_media[:3]):  # Limit to first 3 media files
        clip = TimelineClip(
            id=i + 1,
            media_id=media.id,
            start_time=0.0,
            end_time=media.duration or 10.0,
            track=0,
            position=i * 10.0,
            effects=[]
        )
        mock_clips.append(clip)
    
    return Timeline(
        project_id=project_id,
        clips=mock_clips,
        total_duration=sum(clip.end_time - clip.start_time for clip in mock_clips)
    )