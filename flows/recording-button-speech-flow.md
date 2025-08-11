# Recording Button + Speech Flow: What Happens After You Click Record and Start Speaking

## Step-by-Step Flow

### 1. User Clicks Record Button

User clicks microphone button
  ↓
Button handler checks: `if (isRecording) stop() else start()`
  ↓
Since not recording, calls `start()` function
  ↓
Console: `[useRealtimeTranscription] Start called`
  ↓
Checks if recognition instance exists and is supported
  ↓
Console: `[useRealtimeTranscription] Starting recognition`
  ↓
Calls `recognitionRef.current.start()`
  ↓
Speech recognition starts listening
  ↓
`recognition.onstart` fires → `setIsRecording(true)`
  ↓
Button UI changes to red square (stop icon)

### 2. User Starts Speaking

User speaks: "Hello world"
  ↓
Browser's speech recognition detects audio
  ↓
`recognition.onresult` event fires
  ↓
Console: `[Audio detected] Processing speech...`
  ↓
Processes speech results from `event.resultIndex` to end
  ↓
First gets interim results: `interimText = "Hello wo"`
  ↓
Since not final: calls `onTranscriptRef.current("Hello wo", false)`
  ↓
TextEditor's onTranscript receives interim text
  ↓
Stores current content in `baseContentRef` (if not stored)
  ↓
Updates editor with temp content: `baseContent + " " + "Hello wo"`
  ↓
User sees live preview text appearing

### 3. Speech Segment Completes

Browser finalizes the speech segment
  ↓
`recognition.onresult` fires again with final result
  ↓
Console: `[Audio detected] Processing speech...`
  ↓
Processes final result: `finalText = "Hello world"`
  ↓
Since final: calls `onTranscriptRef.current("Hello world", true)`
  ↓
TextEditor's onTranscript receives final text
  ↓
Gets current editor content
  ↓
Adds separator if needed (space)
  ↓
Creates new content: `currentContent + " " + "Hello world"`
  ↓
Updates editor: `editor.commands.setContent(newContent)`
  ↓
Calls `onChange(newContent)` to notify parent component
  ↓
Updates `baseContentRef.current = newContent`
  ↓
Clears interim transcript: `setInterimTranscript('')`

### 4. Continuous Speech Recognition

Speech recognition continues listening (because `continuous: true`)
  ↓
User speaks again: "How are you"
  ↓
Same process repeats from step 2
  ↓
Console: `[Audio detected] Processing speech...`
  ↓
Interim results → Live preview → Final results → Added to editor
  ↓
New text appends to existing content with proper spacing

### 5. User Stops Recording

User clicks stop button (red square)
  ↓
Button handler calls `stop()` function
  ↓
Console: `[useRealtimeTranscription] Stop called`
  ↓
Console: `[useRealtimeTranscription] Aborting recognition`
  ↓
Calls `recognitionRef.current.abort()` (immediate termination)
  ↓
Sets `isRecording = false` and `interimTranscript = ''`
  ↓
Button UI changes back to microphone icon
  ↓
Speech recognition stops listening

## Key Points with useTranscriptRef Solution

- **Single Recognition Instance**: Only one `SpeechRecognition` instance exists per component mount
- **Ref-Based Callbacks**: `onTranscriptRef.current` always points to latest callback function
- **No Duplicates**: Component re-renders don't create new recognition instances
- **Live Preview**: Interim results show real-time transcription
- **Proper Spacing**: Automatic space handling between speech segments
- **Immediate Stop**: `abort()` provides instant termination vs `stop()`

## Visual Flow

```
[Record Button Click] → [start()] → [Speech Recognition Active]
          ↓
[User Speaks] → [Audio Detected] → [Interim Results] → [Live Preview]
          ↓
[Speech Complete] → [Final Results] → [Text Added to Editor]
          ↓
[Continues Listening...] → [More Speech] → [More Text Added]
          ↓
[Stop Button Click] → [abort()] → [Recognition Stopped]
```