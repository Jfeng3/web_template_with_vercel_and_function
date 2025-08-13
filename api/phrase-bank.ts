import { VercelRequest, VercelResponse } from '@vercel/node';
import { getPhraseBank } from './openai-service';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate request body
    const { original, rephrased } = req.body;
    
    if (!original || typeof original !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid request: original content is required and must be a string' 
      });
    }

    if (original.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Original content cannot be empty' 
      });
    }

    // Validate rephrased if provided
    if (rephrased !== undefined && typeof rephrased !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid request: rephrased must be a string if provided' 
      });
    }

    // Call OpenAI service
    const suggestions = await getPhraseBank(original, rephrased);
    
    // Return successful response
    res.status(200).json({ suggestions });
  } catch (error) {
    console.error('Phrase bank endpoint error:', error);
    
    // Return appropriate error message
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ 
      error: errorMessage,
      message: 'Failed to process phrase bank request'
    });
  }
}