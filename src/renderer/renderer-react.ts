console.log('React Renderer process loaded')

// Import React and our main App component
import './components/react/App.tsx'

// Import settings modal for backward compatibility
import { SettingsModal } from '../components/SettingsModal.js'
import { SettingsManager } from '../api/settingsManager.js'

// ─── Singletons ───────────────────────────────────────────────────────────────
const settingsManager = SettingsManager.getInstance()

// ─── Settings Modal Integration ───────────────────────────────────────────────
const settingsModal = new SettingsModal()

// Set up settings button click handler (delegated from React)
document.addEventListener('DOMContentLoaded', () => {
  // This will be handled by React, but we keep the modal available
  console.log('Settings modal ready')
})

// Expose settings modal to window for React components to use
declare global {
  interface Window {
    settingsModal: SettingsModal
    settingsManager: SettingsManager
  }
}

window.settingsModal = settingsModal
window.settingsManager = settingsManager

console.log('React renderer initialized successfully')