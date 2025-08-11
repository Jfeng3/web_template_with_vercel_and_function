# Recording Flow: From Click to Transcribed Text

## Step-by-Step Flow

### 1. Initial Component Setup

TextEditor component renders
  ↓
Creates `onTranscript` callback function
  ↓
Calls `useRealtimeTranscription` hook with onTranscript
  ↓
Inside hook:
  - Creates `onTranscriptRef = useRef(onTranscript)`
  - Initializes `recognitionRef = useRef<SpeechRecognition | null>(null)`
  - Sets up speech recognition configuration
  - Returns: `{ start, stop, isRecording, isSupported }`

### 2. User Clicks Record Button

User clicks microphone button
  ↓
Button click handler executes
  ↓
Checks `isSupported` flag
  ↓
If not supported:
  - Shows toast error: "Your browser does not support speech recognition"
  - Flow ends
  ↓
If supported and NOT recording:
  - Calls `start()` function
  ↓
If supported and IS recording:
  - Calls `stop()` function

### 3. Starting Recording (start() function)

`start()` is called
  ↓
Creates new SpeechRecognition instance
  ↓
Configures recognition:
  ```
  - continuous: true
  - interimResults: true
  - language: 'en-US'
  ```
  ↓
Sets up event handlers:
  - `onresult`: Processes speech results
  - `onerror`: Handles errors
  - `onend`: Handles recording end
  ↓
Stores recognition in `recognitionRef.current`
  ↓
Calls `recognition.start()`
  ↓
Sets `isRecording = true`
  ↓
Button changes to red square icon

### 4. User Starts Speaking

User speaks: "Hello world"
  ↓
Browser's speech recognition processes audio
  ↓
Fires `onresult` event with interim results
  ↓
`onresult` handler processes ALL results from `resultIndex` to end:
  ```javascript
  for (let i = event.resultIndex; i < event.results.length; i++) {
    const result = event.results[i];
    if (result.isFinal) {
      // Final transcript
    } else {
      // Interim transcript
    }
  }
  ```

### 5. Processing Interim Results (Live Preview)

Interim result detected (not final)
  ↓
Calls: `onTranscriptRef.current(interimTranscript, false)`
  ↓
TextEditor's `onTranscript` receives: ("Hello wo", false)
  ↓
Stores current content in `baseContentRef` (if not already stored)
  ↓
Adds separator if needed (space or nothing)
  ↓
Creates temp content: `baseContent + separator + "Hello wo"`
  ↓
Updates editor: `editor.commands.setContent(tempContent)`
  ↓
User sees live preview of speech

### 6. Processing Final Results

Speech segment completes
  ↓
Browser marks result as final
  ↓
Calls: `onTranscriptRef.current(finalTranscript, true)`
  ↓
TextEditor's `onTranscript` receives: ("Hello world", true)
  ↓
Gets current editor content
  ↓
Adds separator if needed
  ↓
Creates new content: `currentContent + separator + "Hello world"`
  ↓
Updates editor: `editor.commands.setContent(newContent)`
  ↓
Calls `onChange(newContent)` to notify parent
  ↓
Updates `baseContentRef.current = newContent`

### 7. Continuing Speech

User continues speaking: "How are you"
  ↓
Process repeats from step 4
  ↓
Interim results show: "How ar..." → "How are y..." → "How are you"
  ↓
Final result adds: " How are you" to existing content

### 8. Stopping Recording

User clicks stop button (red square)
  ↓
`stop()` function called
  ↓
Calls `recognition.abort()` (immediate stop, not `stop()`)
  ↓
Sets `isRecording = false`
  ↓
Button changes back to microphone icon
  ↓
Any pending interim results are discarded

## Key Implementation Details

### The Ref Pattern
- `onTranscriptRef` ensures the speech recognition always calls the latest version of `onTranscript`
- Prevents stale closures when component re-renders
- Avoids creating duplicate listeners

### Content Management
- `baseContentRef` tracks content before speech input starts
- Allows proper handling of interim results without duplicating text
- Resets when final transcript is processed

### Visual Flow

```
[User Clicks Record] 
      ↓
[Speech Recognition Started]
      ↓
[User Speaks] → [Browser Processes] → [Interim Results]
      ↓                                      ↓
      ↓                               [Live Preview]
      ↓
[Speech Segment Complete] → [Final Result]
                                 ↓
                          [Content Updated]
                                 ↓
                          [Parent Notified]
```

## Potential Issues & Solutions

### Duplicate Speech Bug
- **Cause**: Multiple recognition instances or improper result processing
- **Solution**: The current implementation uses `abort()` instead of `stop()` for immediate termination
- **Prevention**: Single recognition instance managed by ref

### Browser Compatibility
- **Issue**: Not all browsers support Web Speech API
- **Solution**: `isSupported` flag checks for API availability
- **Fallback**: Toast notification informs user of incompatibility