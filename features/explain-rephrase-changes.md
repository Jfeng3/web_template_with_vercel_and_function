# Explain Changes for Rephrase

## Overview
Add an optional "Explain changes" view to the rephrase experience so users learn native phrasing and stronger sentence structure. When enabled, the app highlights edits in the rephrased text and shows short reasons (e.g., idiomatic phrasing, simplified clause, active voice, better preposition).

## Core Functionality
- Toggle in `RephraseBox` to show/hide explanations
- When enabled, the app requests concise rationales for notable edits using the original and the rephrased text
- Rephrased text displays subtle inline highlights with tooltips or small chips indicating the reason
- Fallback gracefully if explanations cannot be generated (keep the clean rephrased text)
- No database changes

## User Flow
1. User clicks Rephrase in the editor toolbar
2. Rephrase suggestions appear (right panel)
3. User toggles "Explain changes"
4. Highlights appear over the rephrased text; hovering or looking at chips reveals 1-line rationales
5. User clicks Accept to apply or Cancel to keep original

## UI Details
- Add a small switch labeled "Explain changes" to `RephraseBox` header/footer area
- Inline highlights use subtle background color and rounded chips (e.g., idiomatic, active voice, concise)
- Keep the current Accept/Cancel buttons and word count

## Technical Notes
- API: Add `getRephraseExplanations(original: string, rephrased: string)` that returns a small set of span-level annotations:
  - Input: original, rephrased
  - Output: `[{ start: number, end: number, label: 'idiomatic' | 'active-voice' | 'concise' | 'clarity' | 'preposition', reason: string }]`
  - Keep to ≤ 6 annotations; each reason ≤ 12 words
- `RephraseBox`:
  - Add local state for `showExplain`
  - When toggled on, call the explanation API once; memoize by `originalText + rephrased`
  - Render highlighted spans using the returned offsets (indices refer to the rephrased string)
  - On failure, show a tiny inline message and continue without highlights

## Acceptance Criteria
- With toggle OFF, behavior is unchanged (clean rephrased text only)
- With toggle ON, up to 6 highlights render with short rationales
- Toggling OFF removes highlights without re-calling the API
- Accept applies the rephrased text exactly, without labels or artifacts
- No changes to note schema or backend tables
