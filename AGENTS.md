# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Stack
- **Framework**: Electron
- **UI**: Tailwind CSS with DaisyUI
- **Language**: TypeScript
- **API**: Mistral AI

## Project Structure
- `src/`: Main source code
  - `main/`: Electron main process
  - `renderer/`: Electron renderer process
  - `api/`: Mistral API integration
  - `components/`: UI components
  - `styles/`: Tailwind and DaisyUI styles
- `public/`: Static assets
- `dist/`: Build output

## Key Commands
- `npm start`: Start the Electron app in development mode
- `npm run build`: Build the app for production
- `npm test`: Run tests (if applicable)

## Mistral API Integration
- Use the Mistral API for chat functionality
- Ensure API keys are securely managed
- Implement chat history and multi-model selection

## UI Guidelines
- Follow Tailwind CSS and DaisyUI conventions
- Match Mistral's color scheme and design language