import OpenAI from 'openai';

// Initialize OpenAI client - will use OPENAI_API_KEY from Vercel environment
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Types
export interface RephraseResponse {
  rephrased: string;
  alternatives: string[];
  wordCount: number;
}

export interface PhraseSuggestion {
  from: string;
  to: string;
  reason: string;
}

// Helper function to clean rephrase responses
function cleanRephraseResponse(text: string): string {
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

// Helper function to extract alternatives
function extractAlternatives(rephrased: string): string[] {
  const sections = rephrased.split(/Alternative|Option|Version/i);
  return sections.slice(1, 4).map(section => 
    section.replace(/^\s*\d+[:.]\s*/, '').trim().split('\n')[0]
  ).filter(alt => alt.length > 0);
}

// Main rephrase function
export async function getRephraseOptions(content: string): Promise<RephraseResponse> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an American English writing coach. Make the text sound like natural, conversational American English.

          Focus on conversational American phrasing:
          - Use everyday expressions
          - Choose simple, direct words over formal alternatives
          - Make it sound like how Americans actually speak

          Editing approach:
          - Prioritize conversational tone over perfect grammar
          - Keep the author's voice but make it more naturally American
          - Preserve formatting, markdown, emojis, hashtags, numbers, names, and links
          - Only rewrite if something sounds unnatural or unclear to American ears
          - Target minimal changes - modify only what needs to sound more conversational

          Common conversational swaps (apply where natural):
          - "obtain" → "get"
          - "purchase" → "buy"
          - "commence" → "start"
          - "utilize" → "use"
          - "regarding" → "about"
          - "assist" → "help"
          - "inquire" → "ask"
          - "provide me with" → "give me"

          Chinese handling:
          - If the input is Chinese, translate to conversational American English.

          Output:
          - Return ONLY the final text. No explanations or headings.`
        },
        {
          role: 'user',
          content: `Please rephrase this note to be simple, clear and conversational:\n\n${content}`
        }
      ],
      temperature: 1
    });

    let rephrased = response.choices[0]?.message?.content || '';
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

// Phrase bank function
export async function getPhraseBank(original: string, rephrased?: string): Promise<PhraseSuggestion[]> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an American English writing coach. Produce native phrase suggestions as precise, local swaps.
          Output ONLY a JSON array (max 5) of objects: { "from": string, "to": string, "reason": string }.
          
          Focus ONLY on simple, conversational American phrasing:
          - Natural everyday expressions native Americans actually use
          - Conversational word choices (e.g., "get" vs "obtain", "talk about" vs "discuss")
          
          IGNORE completely:
          - Grammar mistakes or corrections
          - Capitalization or punctuation issues
          - Formal, academic, or business language
          - British English or other variants
          
          Priorities:
          1) Extract phrase swaps that make text sound more conversational and natural
          2) Focus on how Americans actually speak in everyday conversation
          3) Suggest simple, direct phrasings over formal alternatives
          
          Requirements:
          - Keep swaps local (≤ 6 words)
          - Make it sound conversational and natural
          - reason ≤ 12 words, focus on "more natural/conversational"
          - Skip grammar/capitalization fixes
          - Escape quotes so the JSON parses`
        },
        {
          role: 'user',
          content: `Original:\n${original}\n\nRephrased:\n${rephrased || ''}\n\nReturn JSON array ONLY.`
        }
      ],
      temperature: 1
    });

    const raw = response.choices[0]?.message?.content?.trim() || '[]';
    let parsed: PhraseSuggestion[] = [];
    
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      // Attempt to extract JSON block if wrapped in text
      const match = raw.match(/\[([\s\S]*?)\]/);
      if (match) {
        parsed = JSON.parse(match[0]);
      }
    }

    let suggestions: PhraseSuggestion[] = [];
    if (Array.isArray(parsed)) {
      suggestions = parsed
        .slice(0, 5)
        .map(item => ({
          from: String(item.from || '').slice(0, 120),
          to: String(item.to || '').slice(0, 120),
          reason: String(item.reason || '').slice(0, 120)
        }))
        .filter(s => s.from && s.to);
    }

    // Fallback heuristics if model returns nothing
    if (!suggestions || suggestions.length === 0) {
      const sourceText = rephrased || original;
      const candidates: PhraseSuggestion[] = [];
      const pushIfFound = (from: string, to: string, reason: string) => {
        if (sourceText.toLowerCase().includes(from.toLowerCase())) {
          candidates.push({ from, to, reason });
        }
      };
      pushIfFound('in order to', 'to', 'More concise infinitive');
      pushIfFound('a lot of', 'many', 'Concise, more precise');
      pushIfFound('due to the fact that', 'because', 'Simpler connector');
      pushIfFound('make a decision', 'decide', 'Use a strong verb');
      pushIfFound('utilize', 'use', 'Prefer plain English');
      pushIfFound('regarding', 'about', 'More natural preposition');
      pushIfFound('really ', '', 'Remove intensifier');
      pushIfFound('very ', '', 'Remove intensifier');
      suggestions = candidates.slice(0, 5);
    }

    return suggestions;
  } catch (error) {
    console.error('OpenAI API error (phrase bank):', error);
    return [];
  }
}