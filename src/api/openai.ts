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

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  try {
    // First attempt: send original blob as-is (preferred)
    const t = (audioBlob as any)?.type || 'audio/webm';
    const ext = t.includes('mp4') ? 'mp4' : t.includes('mpeg') ? 'mp3' : t.includes('webm') ? 'webm' : 'dat';
    const originalFile = new File([audioBlob], `audio.${ext}` , { type: t });
    try {
      const res1 = await openai.audio.transcriptions.create({ file: originalFile, model: 'gpt-4o-transcribe', response_format: 'json' as any });
      const text1 = (res1 as any)?.text || (res1 as any)?.data?.text || '';
      if (String(text1 || '').trim()) return String(text1).trim();
    } catch (e) {
      // fall through to WAV conversion
    }

    // Fallback: convert to WAV and retry
    const wavBlob = await convertToWav(audioBlob);
    const wavFile = new File([wavBlob], 'audio.wav', { type: 'audio/wav' });
    const res2 = await openai.audio.transcriptions.create({ file: wavFile, model: 'gpt-4o-transcribe', response_format: 'json' as any });
    const text2 = (res2 as any)?.text || (res2 as any)?.data?.text || '';
    return String(text2 || '').trim();
  } catch (error) {
    console.error('OpenAI transcription error:', error);
    throw new Error('Failed to transcribe audio');
  }
}

async function convertToWav(blob: Blob): Promise<Blob> {
  const arrayBuffer = await blob.arrayBuffer();
  // @ts-ignore - webkitAudioContext for Safari
  const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
  const audioContext = new AudioCtx();
  const audioBuffer: AudioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const length = audioBuffer.length * numChannels * 2 + 44;
  const buffer = new ArrayBuffer(length);
  const view = new DataView(buffer);

  // WAV header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + audioBuffer.length * numChannels * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // PCM
  view.setUint16(20, 1, true); // Linear quantization
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true);
  view.setUint16(32, numChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, audioBuffer.length * numChannels * 2, true);

  // Interleave channels and write PCM samples
  let offset = 44;
  const channels: Float32Array[] = [];
  for (let i = 0; i < numChannels; i++) {
    channels.push(audioBuffer.getChannelData(i));
  }

  for (let i = 0; i < audioBuffer.length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      let sample = channels[ch][i];
      // clamp
      sample = Math.max(-1, Math.min(1, sample));
      // convert to 16-bit PCM
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }

  return new Blob([view], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
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
      model: 'gpt-4.1',
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
      model: 'gpt-4.1',
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