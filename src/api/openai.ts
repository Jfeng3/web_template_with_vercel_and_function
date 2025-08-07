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

export interface PhraseSuggestion {
  from: string;
  to: string;
  reason: string;
}

export async function getCriticFeedback(content: string): Promise<CriticResponse> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-5',
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
      temperature: 1
    });
    console.log('[OpenAI][CriticFeedback] Raw response:', response);

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
      model: 'gpt-5',
      messages: [
        {
          role: 'system',
          content: `You are an expert English writing coach. Make the text sound native with the smallest necessary edits.
          
          Editing policy:
          - Make minimal, local changes; keep sentence count and order.
          - Prefer idiomatic collocations and natural prepositions; replace awkward phrases.
          - Keep the author's voice and tone; do not add new ideas.
          - Preserve formatting, markdown, emojis, hashtags, numbers, names, and links.
          - Only rewrite a whole sentence if it is clearly ungrammatical or unnatural.
          - If a sentence is already natural, leave it unchanged.
          - Target change budget: modify ≤ 15% of tokens. Keep length similar.
          
          Idiomatic preferences (apply only if present; do not force):
          - "in order to" → "to"
          - "a lot of" → "many" / "much" (as appropriate)
          - "due to the fact that" → "because"
          - "make a decision" → "decide"
          - "utilize" → "use"
          - "regarding" → "about"
          - "at this point in time" → "now"
          - "provide me with" → "give me"
          
          Chinese handling:
          - If the input is Chinese, translate to concise, natural English first.
          
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
    console.log('[OpenAI][RephraseOptions] Raw response:', response);

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

export async function getPhraseBank(original: string, rephrased?: string): Promise<PhraseSuggestion[]> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-5',
      messages: [
        {
          role: 'system',
          content: `You are an English writing coach. Produce native phrase suggestions as precise, local swaps.
          Output ONLY a JSON array (max 5) of objects: { "from": string, "to": string, "reason": string }.
          Priorities:
          1) First extract phrase-level substitutions that EXIST between Original and Rephrased (map original fragment -> rephrased fragment).
          2) If fewer than 5, add additional high-confidence improvements directly applicable to the Rephrased text.
          Requirements:
          - Keep swaps local (collocations, prepositions, verb choice). No full-sentence rewrites.
          - Ensure each "from" is a short substring (≤ 6 words).
          - reason ≤ 12 words.
          - High precision; skip uncertain changes.
          - Escape quotes so the JSON parses.`
        },
        {
          role: 'user',
          content: `Original:\n${original}\n\nRephrased:\n${rephrased || ''}\n\nReturn JSON array ONLY.`
        }
      ],
      temperature: 1
    });

    const raw = response.choices[0]?.message?.content?.trim() || '[]';
    console.log('[OpenAI][PhraseBank] Raw response:', raw);
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