# Native Phrase Bank for Rephrase

## Overview
Provide a small "Phrase Bank" under the rephrased output that suggests native, idiomatic replacements for specific fragments (collocations, prepositions, verbs). Each suggestion can be applied individually to the current note to encourage targeted learning.

## Core Functionality
- After a rephrase, show 3–5 targeted suggestions: `from → to`, plus a 1-line why
- Each suggestion has a "Replace" button that applies just that swap to the user's current text (not a full overwrite)
- Suggestions are optional; the main Accept button still replaces the entire note with the rephrased text
- No database changes

## User Flow
1. User clicks Rephrase
2. Rephrase output appears (right panel) with the Phrase Bank section below
3. User optionally clicks "Replace" on individual suggestions to update the current note text in place
4. User can still Accept the full rephrased text or Cancel as usual

## UI Details
- In `RephraseBox`, add a section "Native Phrase Bank" below the main rephrased paragraph
- Each row shows:
  - Original fragment → Suggested native phrase
  - A short reason (≤ 12 words)
  - A small "Replace" button
- Keep styling consistent with existing cards and buttons

## Technical Notes
- API: Add `getPhraseBank(original: string, rephrased?: string)` that returns up to 5 items:
  - Output shape: `{ from: string; to: string; reason: string }[]`
  - Keep deterministic and conservative; prefer high-confidence swaps
- Applying a suggestion:
  - Operate on `currentNote` in `Index.tsx` via `setCurrentNote()`
  - Do an exact `from` substring replace (first occurrence) with basic safeguards
  - If not found, show a tiny inline hint and skip
- Performance: Single lightweight request; only fetched after a rephrase is available

## Acceptance Criteria
- Phrase Bank renders only when a rephrased output exists
- Up to 5 suggestions; each can be applied independently without closing the panel
- Applying a suggestion updates the editor content immediately and preserves cursor focus
- Accept button behavior remains unchanged
- No schema or backend changes required
