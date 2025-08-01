import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface CriticResponse {
  feedback: string;
  suggestions: string[];
  score: number;
}

interface RephraseResponse {
  rephrased: string;
  alternatives: string[];
  wordCount: number;
}

export async function getCriticFeedback(content: string): Promise<CriticResponse> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4.1',
      messages: [
        {
          role: 'system',
          content: `You are a writing critic focused on helping content creators improve their daily notes. 
          Analyze the content for:
          - Clarity and readability
          - Engagement potential
          - Structure and flow
          - Conciseness (target: under 300 words)
          - Impact and value
          
          Provide constructive feedback and actionable suggestions.`
        },
        {
          role: 'user',
          content: `Please analyze this note and provide feedback:\n\n${content}`
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const feedback = response.choices[0]?.message?.content || '';
    
    return {
      feedback,
      suggestions: extractSuggestions(feedback),
      score: Math.floor(Math.random() * 40) + 60 // Mock score 60-100
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to get critic feedback');
  }
}

export async function getRephraseOptions(content: string): Promise<RephraseResponse> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4.1',
      messages: [
        {
          role: 'system',
          content: `You are a writing assistant that rephrases content to be simple, clear, and conversational.
          Keep the original meaning while making it:
          - Simple: Use everyday language, avoid jargon
          - Clear: Direct and easy to understand
          - Conversational: Natural, like talking to a friend
          - Concise: Stay under 300 words
          
          Write as if you're having a friendly chat. Use "you" and "we" when appropriate. 
          If the original content is Chinese, please translate it to English first.
          Avoid complex sentences. Keep it human and relatable.
          
          IMPORTANT: Return ONLY the rephrased text. Do not include any explanations, introductions, or comments like "Here's a simpler version:" or "I've rephrased this to be:". Just return the rephrased content directly.`
        },
        {
          role: 'user',
          content: `Please rephrase this note to be simple, clear and conversational:\n\n${content}`
        }
      ],
      max_tokens: 600,
      temperature: 0.8
    });

    let rephrased = response.choices[0]?.message?.content || '';
    
    // Clean any prefacing explanations that might still appear
    rephrased = cleanRephraseResponse(rephrased);
    
    return {
      rephrased,
      alternatives: extractAlternatives(rephrased),
      wordCount: rephrased.split(/\s+/).filter(w => w).length
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to get rephrase options');
  }
}

function extractSuggestions(feedback: string): string[] {
  const lines = feedback.split('\n').filter(line => line.trim());
  return lines.slice(0, 3).map(line => line.replace(/^[-•*]\s*/, '').trim());
}

function cleanRephraseResponse(text: string): string {
  // Remove common prefacing phrases that might appear despite instructions
  const prefacingPatterns = [
    /^Here's a [^:]*:\s*/i,
    /^I've rephrased [^:]*:\s*/i,
    /^Here is [^:]*:\s*/i,
    /^This is [^:]*:\s*/i,
    /^A [^:]* version:\s*/i,
    /^Rephrased:\s*/i,
    /^Simplified:\s*/i,
    /^Improved version:\s*/i,
    /^Better version:\s*/i,
    /^Revised:\s*/i
  ];
  
  let cleaned = text.trim();
  
  for (const pattern of prefacingPatterns) {
    cleaned = cleaned.replace(pattern, '');
  }
  
  return cleaned.trim();
}

function extractAlternatives(rephrased: string): string[] {
  const sections = rephrased.split(/Alternative|Option|Version/i);
  return sections.slice(1, 4).map(section => 
    section.replace(/^\s*\d+[:.]\s*/, '').trim().split('\n')[0]
  ).filter(alt => alt.length > 0);
}