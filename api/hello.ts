import { VercelRequest, VercelResponse } from '@vercel/node';

const handler = async (
  req: VercelRequest,
  res: VercelResponse
) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    
    // Simple echo response with timestamp
    const response = {
      echo: message || 'Hello World!',
      timestamp: new Date().toISOString(),
      success: true
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Hello API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      success: false
    });
  }
};

export default handler;