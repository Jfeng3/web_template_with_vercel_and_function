# AI Assistant Critic and Rephrase Feature

## Overview
Add AI-powered critic and rephrase functionality to the writing section, allowing users to get instant feedback and alternative phrasings for their notes with single-click buttons.

## Feature Description

### Critic Button
- **Purpose**: Provides constructive feedback on the current note content
- **Functionality**: 
  - Analyzes writing quality, clarity, and engagement
  - Suggests improvements for structure and flow
  - Identifies areas that could be more concise or impactful
  - Considers the 300-word limit constraint

### Rephrase Button
- **Purpose**: Offers alternative ways to express the same content
- **Functionality**:
  - Generates multiple rephrase options
  - Maintains original meaning while improving clarity
  - Optimizes for engagement and readability
  - Respects word count limitations

## Implementation Details

### UI Components
- Two prominent buttons in the writing panel
- Position: Near the text editor for easy access
- Icons: Critic (feedback/review icon), Rephrase (refresh/rewrite icon)
- Loading states during AI processing

### User Experience
1. User writes content in the note editor
2. Clicks "Critic" button to get feedback
3. OR clicks "Rephrase" button to get alternative phrasings
4. AI response appears in a panel/modal
5. User can apply suggestions or dismiss

### Technical Considerations
- Integrate with AI service (OpenAI, Anthropic, etc.)
- Handle API rate limits and errors gracefully
- Maintain original content while showing suggestions
- Consider offline/fallback states

## Success Metrics
- User engagement with AI features
- Improvement in note quality
- Reduction in editing time
- User satisfaction with suggestions