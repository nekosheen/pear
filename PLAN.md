# Pear Chat App Improvement Plan

## Current Issues Identified

1. **UI Aesthetics**: The current UI is basic and doesn't fully leverage the Mistral color scheme defined in the CSS
2. **Form Functionality**: No event listeners are attached to the send button or message input
3. **API Integration**: The MistralService exists but isn't connected to the UI
4. **Message Display**: No logic to display messages in the chat container

## Improvement Plan

### 1. UI Improvements

#### Color Scheme Enhancement
- Apply Mistral purple color scheme consistently throughout the UI
- Update button colors to use Mistral purple (`var(--mistral-purple)`)
- Improve chat bubble styling to match Mistral branding

#### Layout Improvements
- Add proper padding and spacing
- Improve the chat container layout
- Add a header with Mistral branding
- Style the input area to be more prominent

#### Typography
- Use consistent font sizes and weights
- Improve readability of chat messages
- Add proper line heights

### 2. Form Functionality Implementation

#### Event Listeners
- Add click event listener to send button
- Add keypress event listener for Enter key in input field
- Add input validation

#### Message Handling
- Implement function to add messages to chat display
- Create function to clear input after sending
- Add loading state during API calls

#### API Integration
- Initialize MistralService with provided API key: `uYB7hPISF2VXqyissHWWVOfitmCGCAEv`
- Implement error handling for API calls
- Display API errors to user

### 3. Message Display System

#### Chat Bubble Implementation
- Create user message bubbles (right-aligned, blue)
- Create assistant message bubbles (left-aligned, purple)
- Add timestamps to messages

#### Scroll Behavior
- Auto-scroll to bottom when new messages arrive
- Maintain scroll position during loading

## Implementation Steps

### Step 1: Enhance UI Styles
- Update `src/styles/main.css` with improved Mistral branding
- Modify `public/index.html` to use new CSS classes
- Add proper structure for message display

### Step 2: Implement Form Logic
- Update `src/renderer/renderer.ts` with event listeners
- Add message handling functions
- Implement API integration

### Step 3: Connect to Mistral API
- Initialize MistralService in renderer
- Handle API responses and errors
- Display responses in chat interface

### Step 4: Test and Refine
- Test message sending and receiving
- Verify UI improvements
- Fix any bugs or issues

## Technical Details

### API Key Usage
The Mistral API key is configured by the user via the Settings modal and persisted in localStorage. No keys are hardcoded in source code.

### File Modifications Required
1. `public/index.html` - UI structure updates
2. `src/styles/main.css` - Enhanced styling
3. `src/renderer/renderer.ts` - Complete functionality implementation
4. `src/api/mistralService.ts` - Already implemented, just needs integration

### Expected Outcome
A fully functional chat interface with:
- Improved Mistral-branded UI
- Working message sending functionality
- Proper display of conversation history
- Error handling and user feedback