write down step-by-step flow for the following 
then create a md file in /flows 

e.g. 
Step-by-Step Flow with onTranscriptRef Solution

  1. Initial Load (First time component renders)

  TextEditor renders
    ↓
  Creates onTranscript function (first time)
    ↓
  Calls useRealtimeTranscription with onTranscript
    ↓
  Inside hook:
    - Creates onTranscriptRef = useRef(onTranscript)
    - Stores the function in the ref
    - Creates ONE speech recognition listener
    - Listener is set up to call onTranscriptRef.current()

  2. When You Start Speaking

  You speak: "Hello world"
    ↓
  Speech recognition hears it
    ↓
  Calls: onTranscriptRef.current("Hello world", true)
    ↓
  This runs the function stored in the ref
    ↓
  Text gets added to editor

  3. Component Re-renders (e.g., after text is added)

  TextEditor re-renders
    ↓
  Creates NEW onTranscript function
    ↓
  Calls useRealtimeTranscription with NEW onTranscript
    ↓
  Inside hook:
    - Updates onTranscriptRef.current = NEW onTranscript
    - Speech recognition listener STAYS THE SAME
    - No duplicate listeners created!

  4. Next Time You Speak

  You speak: "How are you"
    ↓
  SAME speech recognition (not recreated) hears it
    ↓
  Calls: onTranscriptRef.current("How are you", true)
    ↓
  This now runs the UPDATED function from the ref
    ↓
  Text gets added correctly

  The Magic:

  - Without ref: New render → New listener → Duplicates
  - With ref: New render → Same listener → No duplicates

  Visual Flow:

  [Speech Recognition]
      ↓ (always calls)
  [onTranscriptRef] ← (box that holds the function)
      ↓ (contains)
  [Current onTranscript function] ← (gets swapped out on re-render)

  The speech recognition always talks to the same "box" (ref), but we can change what's inside the box without creating a
  new listener!