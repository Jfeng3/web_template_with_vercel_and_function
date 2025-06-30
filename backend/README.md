# AI Video Creation Studio - Backend API

FastAPI backend for the AI Video Creation Studio, providing REST APIs for video processing, AI content generation, and project management.

## Features

- **Project Management**: Create, update, and manage video projects
- **Media Upload & Processing**: Handle video/image uploads and processing
- **AI Integration**: Integrate with multiple AI providers (Midjourney, Veo3, OpenAI, etc.)
- **Timeline Management**: Manage video timelines and clips
- **Background Processing**: Async processing for AI generation and video rendering

## Quick Start

### Prerequisites

- Python 3.8+
- pip or pipenv for package management

### Installation

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

5. **Run the server**:
   ```bash
   python -m app.main
   # or
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

The API will be available at `http://localhost:8000`

### API Documentation

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`
- **OpenAPI JSON**: `http://localhost:8000/api/v1/openapi.json`

## Environment Configuration

Create a `.env` file in the backend directory:

```env
# AI Service API Keys
OPENAI_API_KEY=your_openai_key_here
MIDJOURNEY_API_KEY=your_midjourney_key_here
RUNWAY_API_KEY=your_runway_key_here
ELEVENLABS_API_KEY=your_elevenlabs_key_here

# Database
DATABASE_URL=sqlite:///./video_studio.db

# File Storage
UPLOAD_DIR=uploads
MAX_FILE_SIZE=104857600  # 100MB

# CORS Settings (adjust for your frontend URL)
ALLOWED_HOSTS=["http://localhost:3000","http://localhost:5173","http://localhost:8080"]
```

## API Endpoints

### Health Check
- `GET /health` - Basic health check
- `GET /api/v1/health/detailed` - Detailed health check with service status

### Projects
- `POST /api/v1/projects` - Create new project
- `GET /api/v1/projects` - List all projects
- `GET /api/v1/projects/{id}` - Get project details
- `PUT /api/v1/projects/{id}` - Update project
- `DELETE /api/v1/projects/{id}` - Delete project
- `POST /api/v1/projects/{id}/duplicate` - Duplicate project

### Media & Videos
- `POST /api/v1/videos/upload` - Upload video/image files
- `GET /api/v1/videos/project/{project_id}` - Get project media
- `GET /api/v1/videos/{media_id}` - Get media details
- `DELETE /api/v1/videos/{media_id}` - Delete media
- `POST /api/v1/videos/process` - Process video with operations
- `GET /api/v1/videos/process/{task_id}` - Get processing status
- `POST /api/v1/videos/timeline` - Save project timeline
- `GET /api/v1/videos/timeline/{project_id}` - Get project timeline

### AI Generation
- `POST /api/v1/ai/generate` - Create AI generation request
- `GET /api/v1/ai/generate/{generation_id}` - Get generation status
- `GET /api/v1/ai/generate` - List generations with filters
- `DELETE /api/v1/ai/generate/{generation_id}` - Cancel generation
- `POST /api/v1/ai/batch-generate` - Create multiple generations
- `GET /api/v1/ai/providers` - List available AI providers
- `POST /api/v1/ai/providers/{provider}/test` - Test provider connection
- `GET /api/v1/ai/templates/{provider}` - Get prompt templates

## AI Providers Integration

### Supported Providers

1. **Midjourney** - Image generation
2. **Veo3** - Video generation
3. **OpenAI DALL-E** - Image generation
4. **Runway ML** - Video generation and effects
5. **ElevenLabs** - Voice synthesis

### Adding New Providers

1. Update `AIProvider` enum in `app/models/schemas.py`
2. Add provider configuration in `app/services/ai_service.py`
3. Implement provider-specific logic in the AI service
4. Add provider templates and settings

## Development

### Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/    # API route handlers
│   │       └── router.py     # API router setup
│   ├── core/
│   │   └── config.py         # Configuration settings
│   ├── models/
│   │   └── schemas.py        # Pydantic models
│   ├── services/
│   │   └── ai_service.py     # AI integration service
│   └── main.py               # FastAPI application
├── requirements.txt          # Python dependencies
└── README.md                # This file
```

### Adding New Endpoints

1. Create endpoint file in `app/api/v1/endpoints/`
2. Add router to `app/api/v1/router.py`
3. Define request/response schemas in `app/models/schemas.py`
4. Implement business logic in appropriate service

### Running Tests

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

### Code Style

The project uses:
- **Black** for code formatting
- **isort** for import sorting
- **flake8** for linting

```bash
# Format code
black app/
isort app/

# Lint code
flake8 app/
```

## Deployment

### Docker Deployment

```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY app/ ./app/
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Production Considerations

1. **Database**: Switch from SQLite to PostgreSQL for production
2. **File Storage**: Use cloud storage (AWS S3, Google Cloud Storage)
3. **Caching**: Add Redis for caching and background tasks
4. **Monitoring**: Add logging, metrics, and health checks
5. **Security**: Implement authentication, rate limiting, and input validation
6. **Scaling**: Use load balancers and multiple server instances

## Troubleshooting

### Common Issues

1. **Import Errors**: Ensure you're running from the backend directory
2. **Missing Dependencies**: Run `pip install -r requirements.txt`
3. **Environment Variables**: Check `.env` file exists and has correct values
4. **Port Conflicts**: Change port in main.py if 8000 is in use
5. **CORS Issues**: Add your frontend URL to `ALLOWED_HOSTS` in config

### Debugging

Enable debug logging by setting log level:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Support

For issues and questions:
1. Check the API documentation at `/docs`
2. Review logs for error details
3. Ensure all environment variables are set correctly