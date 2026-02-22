export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface Conversation {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: number
  updatedAt: number
}

export class ConversationManager {
  private static instance: ConversationManager
  private readonly STORAGE_KEY = 'pear_conversations'
  private readonly CURRENT_KEY = 'pear_current_conversation_id'

  private constructor() {
    // Test if localStorage is available and working
    this.testStorage()
  }

  static getInstance(): ConversationManager {
    if (!ConversationManager.instance) {
      ConversationManager.instance = new ConversationManager()
    }
    return ConversationManager.instance
  }

  private testStorage(): void {
    try {
      // Test if localStorage is working
      const testKey = '__pear_storage_test__'
      localStorage.setItem(testKey, 'test')
      const value = localStorage.getItem(testKey)
      localStorage.removeItem(testKey)
      
      if (value !== 'test') {
        throw new Error('localStorage test failed')
      }
    } catch (error) {
      console.error('localStorage is not available or not working:', error)
      throw new Error('Storage is not available in this environment')
    }
  }

  // ─── Private storage helpers ──────────────────────────────────────────────

  private load(): Conversation[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY)
      console.log('📂 ConversationManager.load():', {
        rawPresent: !!raw,
        rawLength: raw ? raw.length : 0,
        storageLength: localStorage.length,
        storageKeys: Array.from({length: localStorage.length}, (_, i) => localStorage.key(i))
      })
      
      if (!raw) return []
      
      const parsed = JSON.parse(raw) as Conversation[]
      
      // Validate the data structure
      if (!Array.isArray(parsed)) {
        console.error('Invalid conversations data format, resetting...')
        this.persist([])
        return []
      }
      
      console.log('📋 Loaded conversations:', parsed.length)
      return parsed
    } catch (error) {
      console.error('Failed to load conversations from localStorage:', error)
      return []
    }
  }

  private persist(conversations: Conversation[]): void {
    try {
      const serialized = JSON.stringify(conversations)
      localStorage.setItem(this.STORAGE_KEY, serialized)
      
      // Verify the data was saved correctly
      const saved = localStorage.getItem(this.STORAGE_KEY)
      if (saved !== serialized) {
        throw new Error('Failed to persist conversations to localStorage')
      }
    } catch (error) {
      console.error('Failed to save conversations to localStorage:', error)
      throw new Error('Failed to persist conversations: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  // ─── Conversation CRUD ────────────────────────────────────────────────────

  createConversation(): Conversation {
    const conv: Conversation = {
      id: `conv_${Date.now()}`,
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    const all = this.load()
    all.unshift(conv)
    this.persist(all)
    this.setCurrentId(conv.id)
    return conv
  }

  getAllConversations(): Conversation[] {
    return this.load().sort((a, b) => b.updatedAt - a.updatedAt)
  }

  getCurrentConversationId(): string | null {
    return localStorage.getItem(this.CURRENT_KEY)
  }

  getCurrentConversation(): Conversation | null {
    const id = this.getCurrentConversationId()
    if (!id) return null
    return this.load().find(c => c.id === id) ?? null
  }

  switchToConversation(id: string): Conversation | null {
    const conv = this.load().find(c => c.id === id)
    if (conv) this.setCurrentId(id)
    return conv ?? null
  }

  deleteConversation(id: string): void {
    const filtered = this.load().filter(c => c.id !== id)
    this.persist(filtered)
    if (this.getCurrentConversationId() === id) {
      localStorage.removeItem(this.CURRENT_KEY)
    }
  }

  // ─── Messages ─────────────────────────────────────────────────────────────

  addMessage(role: 'user' | 'assistant', content: string): void {
    const id = this.getCurrentConversationId()
    if (!id) return

    const all = this.load()
    const conv = all.find(c => c.id === id)
    if (!conv) return

    conv.messages.push({ role, content, timestamp: Date.now() })
    conv.updatedAt = Date.now()

    // Auto-title: use the first user message, truncated to 45 chars
    const userMessages = conv.messages.filter(m => m.role === 'user')
    if (role === 'user' && userMessages.length === 1) {
      conv.title = content.length > 45 ? content.slice(0, 45) + '…' : content
    }

    this.persist(all)
  }

  getMessages(): ChatMessage[] {
    return this.getCurrentConversation()?.messages ?? []
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private setCurrentId(id: string): void {
    localStorage.setItem(this.CURRENT_KEY, id)
  }
}
