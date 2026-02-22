console.log('Renderer process loaded')

// Import all dependencies at the top (ESM requirement)
import { MistralService } from '../api/mistralService.js'
import { SettingsModal } from '../components/SettingsModal.js'
import { SettingsManager } from '../api/settingsManager.js'
import { ConversationManager } from '../api/conversationManager.js'

// marked is loaded via CDN script tag in index.html
declare const marked: { parse: (src: string) => string }

// ─── DOM elements ────────────────────────────────────────────────────────────

const messageInput      = document.getElementById('message-input')      as HTMLInputElement
const sendButton        = document.getElementById('send-button')        as HTMLButtonElement
const chatMessages      = document.getElementById('chat-messages')      as HTMLDivElement
const conversationList  = document.getElementById('conversation-list')  as HTMLDivElement
const newChatButton     = document.getElementById('new-chat-button')    as HTMLButtonElement

// ─── Singletons ───────────────────────────────────────────────────────────────

const settingsManager      = SettingsManager.getInstance()
const conversationManager  = ConversationManager.getInstance()
let   mistralService: MistralService | null = null

// ─── Input state ──────────────────────────────────────────────────────────────

function updateInputState(): void {
  const hasKey = !!settingsManager.getApiKey()
  const notice = document.getElementById('no-api-key-notice')

  messageInput.disabled = !hasKey
  sendButton.disabled   = !hasKey

  if (notice) {
    notice.classList.toggle('hidden', hasKey)
  }
}

// ─── MistralService ───────────────────────────────────────────────────────────

function initializeMistralService(): void {
  const apiKey = settingsManager.getApiKey()
  const model  = settingsManager.getModel()

  if (!apiKey) {
    console.warn('No API key configured. Open Settings to add one.')
    return
  }

  try {
    mistralService = new MistralService(apiKey, model)
    console.log('MistralService initialized.')
  } catch (error) {
    console.error('Failed to initialize MistralService:', error)
    mistralService = null
  }
}

// ─── Rendering helpers ────────────────────────────────────────────────────────

/** Renders a message bubble in the DOM only — does NOT save to storage. */
function renderMessageToDOM(role: 'user' | 'assistant', content: string): void {
  const div = document.createElement('div')
  div.className = role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'

  if (role === 'assistant') {
    div.innerHTML = marked.parse(content)
    div.classList.add('markdown-body')
  } else {
    div.textContent = content
  }

  chatMessages.appendChild(div)
  chatMessages.scrollTop = chatMessages.scrollHeight
}

/** Renders a message bubble AND saves it to the current conversation. */
function addMessageToChat(role: 'user' | 'assistant', content: string): void {
  renderMessageToDOM(role, content)
  conversationManager.addMessage(role, content)
  renderSidebar()
}

function clearChatDisplay(): void {
  chatMessages.innerHTML = ''
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function formatRelativeDate(timestamp: number): string {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 60_000)
  const hours   = Math.floor(diff / 3_600_000)
  const days    = Math.floor(diff / 86_400_000)

  if (minutes < 1)  return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24)   return `${hours}h ago`
  if (days < 7)     return `${days}d ago`
  return new Date(timestamp).toLocaleDateString()
}

function renderSidebar(): void {
  const conversations  = conversationManager.getAllConversations()
  const currentId      = conversationManager.getCurrentConversationId()

  conversationList.innerHTML = ''

  conversations.forEach(conv => {
    const isActive = conv.id === currentId

    const item = document.createElement('button')
    item.className = `conversation-item${isActive ? ' active' : ''}`
    item.title = conv.title
    item.innerHTML = `
      <span class="conv-title">${escapeHtml(conv.title)}</span>
      <span class="conv-date">${formatRelativeDate(conv.updatedAt)}</span>
    `

    item.addEventListener('click', () => {
      if (conv.id !== conversationManager.getCurrentConversationId()) {
        loadConversation(conv.id)
      }
    })

    conversationList.appendChild(item)
  })
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// ─── Conversation loading ─────────────────────────────────────────────────────

function loadConversation(id: string): void {
  const conv = conversationManager.switchToConversation(id)
  if (!conv) return

  clearChatDisplay()
  conv.messages.forEach(msg => renderMessageToDOM(msg.role, msg.content))
  chatMessages.scrollTop = chatMessages.scrollHeight
  renderSidebar()
  messageInput.focus()
}

function startNewChat(): void {
  conversationManager.createConversation()
  clearChatDisplay()

  const welcome = settingsManager.getApiKey()
    ? 'Hello! I\'m your Mistral AI assistant. How can I help you today?'
    : 'Welcome to Pear! To get started, open Settings (⋮ in the top right) and add your Mistral API key.'

  addMessageToChat('assistant', welcome)
  renderSidebar()
  messageInput.focus()
}

// ─── Sending messages ─────────────────────────────────────────────────────────

async function handleSendMessage(): Promise<void> {
  const message = messageInput.value.trim()
  if (!message) return

  if (!mistralService) {
    addMessageToChat('assistant', 'No API key configured. Please open Settings (⋮) and add your Mistral API key.')
    return
  }

  // Save and render user message, then build the full history for the API call
  addMessageToChat('user', message)
  messageInput.value = ''
  messageInput.focus()

  // Show loading indicator (not saved to storage)
  const loadingDiv = document.createElement('div')
  loadingDiv.className = 'chat-bubble-assistant loading'
  loadingDiv.innerHTML = '<span class="loading-dot"></span><span class="loading-dot"></span><span class="loading-dot"></span>'
  chatMessages.appendChild(loadingDiv)
  chatMessages.scrollTop = chatMessages.scrollHeight

  try {
    // Send the full conversation history so the AI has context
    const history = conversationManager.getMessages().map(m => ({
      role: m.role,
      content: m.content
    }))

    const response = await mistralService.chat(history)

    chatMessages.removeChild(loadingDiv)

    const reply = response.choices[0].message.content
    addMessageToChat('assistant', reply)

  } catch (error) {
    console.error('Error sending message:', error)
    chatMessages.removeChild(loadingDiv)
    addMessageToChat('assistant', 'Sorry, there was an error processing your request.')
  }
}

// ─── Event listeners ──────────────────────────────────────────────────────────

sendButton.addEventListener('click', handleSendMessage)

messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleSendMessage()
})

newChatButton.addEventListener('click', startNewChat)

// ─── Settings modal ───────────────────────────────────────────────────────────

const settingsModal = new SettingsModal()

document.getElementById('settings-button')?.addEventListener('click', () => {
  settingsModal.show()
  const currentApiKey = settingsManager.getApiKey()
  const currentModel  = settingsManager.getModel()
  settingsModal.setApiKey(currentApiKey)
  settingsModal.setModel(currentModel)

  if (currentApiKey) {
    settingsManager.getAvailableModels(currentApiKey)
      .then(models => settingsModal.setAvailableModels(models))
      .catch(err => console.error('Error loading models:', err))
  }
})

settingsModal.onCancel(() => settingsModal.hide())

settingsModal.onTestConnection(async (apiKey) => {
  if (!apiKey || apiKey.length < 20) {
    settingsModal.showConnectionStatus(false, 'Invalid API key format')
    return
  }
  settingsModal.showConnectionStatus(false, 'Testing connection...')
  try {
    const ok = await settingsManager.testApiKey(apiKey)
    if (ok) {
      settingsModal.showConnectionStatus(true, 'Connection successful!')
      const models = await settingsManager.getAvailableModels(apiKey)
      settingsModal.setAvailableModels(models)
    } else {
      settingsModal.showConnectionStatus(false, 'Connection failed')
    }
  } catch {
    settingsModal.showConnectionStatus(false, 'Connection error')
  }
})

settingsModal.onSave(async (apiKey, model) => {
  try {
    if (!apiKey) { settingsModal.showStatus('API key is required', true); return }
    await settingsManager.setApiKey(apiKey)
    await settingsManager.setModel(model)

    if (mistralService) {
      mistralService.updateSettings(apiKey, model)
    } else {
      mistralService = new MistralService(apiKey, model)
    }

    updateInputState()
    settingsModal.showStatus('Settings saved successfully!')
    setTimeout(() => { settingsModal.hide(); settingsModal.hideStatus() }, 1500)
  } catch (error) {
    settingsModal.showStatus((error as Error).message || 'Failed to save settings', true)
  }
})

// ─── Startup ──────────────────────────────────────────────────────────────────

initializeMistralService()
updateInputState()

// Resume the most recent conversation, or start a fresh one
const existing = conversationManager.getCurrentConversation()
if (existing && existing.messages.length > 0) {
  existing.messages.forEach(msg => renderMessageToDOM(msg.role, msg.content))
  chatMessages.scrollTop = chatMessages.scrollHeight
} else {
  startNewChat()
}

renderSidebar()
