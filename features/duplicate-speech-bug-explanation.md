# Why Speech Gets Recorded Twice - Simple Explanation

## What's Happening?
When you speak into the microphone, sometimes your words appear twice in the text editor. Like this:
- You say: "Hello world"
- What appears: "Hello world Hello world"

## Why Does This Happen?

### The Problem is Like Having Two Listeners
Imagine you're telling a story to a friend, but suddenly another friend joins and both start writing down what you say. You might end up with your story written twice!

This is what's happening in the code:

1. **Multiple Microphones Running**: The app sometimes creates multiple "listeners" (speech recognition instances) at the same time
2. **Both Listeners Hear You**: When you speak, both listeners hear the same thing
3. **Both Write It Down**: Each listener adds your words to the text editor

### The Technical Reason

The bug happens because:
- Every time the text editor updates (which happens often), it might create a new speech listener
- The old listener doesn't always stop properly
- Both the old and new listeners send your words to the text editor

### It's Like a Broken Door
Think of it like a door that doesn't close properly:
- You open a new door (start recording)
- The door doesn't fully close when you're done
- Next time, you have two doors open
- Sound comes through both doors

## The Solution
To fix this, we need to:
1. Make sure we only have one listener at a time
2. Properly close the old listener before starting a new one
3. Keep track of which words we've already added to avoid duplicates