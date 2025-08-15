import { VercelRequest, VercelResponse } from '@vercel/node';
import { transcribeAudio } from './openai-service.js';

const handler = async (
  req: VercelRequest,
  res: VercelResponse
) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse FormData from request
    const contentType = req.headers['content-type'];
    
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return res.status(400).json({ 
        error: 'Invalid request: must be multipart/form-data' 
      });
    }

    // For Vercel, we need to handle the raw body as Buffer
    // The audio file should be in the request body
    const audioBuffer = req.body as Buffer;
    const filename = req.headers['x-filename'] as string || 'audio.wav';
    
    if (!audioBuffer || audioBuffer.length === 0) {
      return res.status(400).json({ 
        error: 'No audio data provided' 
      });
    }

    // Call OpenAI service
    const text = await transcribeAudio(audioBuffer, filename);
    
    // Return successful response
    res.status(200).json({ text });
  } catch (error) {
    console.error('Transcribe endpoint error:', error);
    
    // Return appropriate error message
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ 
      error: errorMessage,
      message: 'Failed to process transcription request'
    });
  }
};

export default handler;