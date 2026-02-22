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

  private constructor() {}

  static getInstance(): ConversationManager {
    if (!ConversationManager.instance) {
      ConversationManager.instance = new ConversationManager()
    }
    return ConversationManager.instance
  }

  // ─── Private storage helpers ──────────────────────────────────────────────

  private load(): Conversation[] {
    const raw = localStorage.getItem(this.STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Conversation[]) : []
  }

  private persist(conversations: Conversation[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(conversations))
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
