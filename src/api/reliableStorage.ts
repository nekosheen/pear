// Reliable Storage - Simple persistent storage that works in Electron
// Uses a single localStorage key with proper error handling
// More reliable than multiple keys for Electron persistence

export class ReliableStorage {
  private static instance: ReliableStorage | null = null;
  private readonly STORAGE_KEY = 'pear_app_data_v3';

  private constructor() {
    this.migrateFromLegacy();
  }

  public static getInstance(): ReliableStorage {
    if (ReliableStorage.instance === null) {
      ReliableStorage.instance = new ReliableStorage();
    }
    return ReliableStorage.instance;
  }

  private getData(): any {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return {};
      
      const parsed = JSON.parse(raw);
      if (typeof parsed !== 'object' || parsed === null) {
        throw new Error('Invalid data format');
      }
      
      return parsed;
    } catch (error) {
      console.error('Failed to parse storage data, resetting...', error);
      this.clear();
      return {};
    }
  }

  private setData(data: any): void {
    try {
      // Clean up any undefined values
      Object.keys(data).forEach(key => {
        if (data[key] === undefined) {
          delete data[key];
        }
      });
      
      const serialized = JSON.stringify(data);
      localStorage.setItem(this.STORAGE_KEY, serialized);
      
      // Verify it was saved
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved !== serialized) {
        console.error('⚠️ Storage verification failed');
      } else {
        console.log('💾 Data saved successfully');
      }
    } catch (error) {
      console.error('❌ Failed to save to localStorage:', error);
    }
  }

  private migrateFromLegacy(): void {
    try {
      // Check if we have legacy data and no new format
      const hasLegacyData = 
        localStorage.getItem('pear_mistral_api_key') ||
        localStorage.getItem('pear_conversations');
      
      const hasNewData = localStorage.getItem(this.STORAGE_KEY);
      
      if (hasLegacyData && !hasNewData) {
        console.log('🔄 Migrating from legacy storage format...');
        
        const newData: any = {};
        
        // Migrate API key
        const apiKey = localStorage.getItem('pear_mistral_api_key');
        if (apiKey) {
          newData.apiKey = apiKey;
          localStorage.removeItem('pear_mistral_api_key');
        }

        // Migrate model
        const model = localStorage.getItem('pear_mistral_model');
        if (model) {
          newData.model = model;
          localStorage.removeItem('pear_mistral_model');
        }

        // Migrate current conversation ID
        const currentId = localStorage.getItem('pear_current_conversation_id');
        if (currentId) {
          newData.currentConversationId = currentId;
          localStorage.removeItem('pear_current_conversation_id');
        }

        // Migrate conversations
        const conversations = localStorage.getItem('pear_conversations');
        if (conversations) {
          try {
            newData.conversations = JSON.parse(conversations);
          } catch (e) {
            console.error('Failed to parse legacy conversations:', e);
          }
          localStorage.removeItem('pear_conversations');
        }

        if (Object.keys(newData).length > 0) {
          this.setData(newData);
          console.log('✅ Migration completed successfully');
        }
      }
    } catch (error) {
      console.error('Migration failed:', error);
    }
  }

  // API Key methods
  public getApiKey(): string | null {
    try {
      const data = this.getData();
      return data.apiKey || null;
    } catch (error) {
      console.error('Failed to read API key:', error);
      return null;
    }
  }

  public setApiKey(apiKey: string): void {
    try {
      const data = this.getData();
      data.apiKey = apiKey;
      this.setData(data);
    } catch (error) {
      console.error('Failed to save API key:', error);
    }
  }

  // Model methods
  public getModel(): string {
    try {
      const data = this.getData();
      return data.model || 'mistral-large-latest';
    } catch (error) {
      console.error('Failed to read model:', error);
      return 'mistral-large-latest';
    }
  }

  public setModel(model: string): void {
    try {
      const data = this.getData();
      data.model = model;
      this.setData(data);
    } catch (error) {
      console.error('Failed to save model:', error);
    }
  }

  // Conversation methods
  public getCurrentConversationId(): string | null {
    try {
      const data = this.getData();
      return data.currentConversationId || null;
    } catch (error) {
      console.error('Failed to read current conversation ID:', error);
      return null;
    }
  }

  public setCurrentConversationId(id: string | null): void {
    try {
      const data = this.getData();
      data.currentConversationId = id;
      this.setData(data);
    } catch (error) {
      console.error('Failed to save current conversation ID:', error);
    }
  }

  public getConversations(): any[] {
    try {
      const data = this.getData();
      return data.conversations || [];
    } catch (error) {
      console.error('Failed to read conversations:', error);
      return [];
    }
  }

  public setConversations(conversations: any[]): void {
    try {
      const data = this.getData();
      data.conversations = conversations;
      this.setData(data);
    } catch (error) {
      console.error('Failed to save conversations:', error);
    }
  }

  // Clear all data
  public clear(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('🧹 All data cleared');
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  }

  // Debug method
  public debugLog(): void {
    try {
      const data = this.getData();
      console.log('📊 Storage contents:', {
        hasApiKey: !!data.apiKey,
        apiKeyLength: data.apiKey ? data.apiKey.length : 0,
        model: data.model,
        currentConversationId: data.currentConversationId,
        conversationCount: data.conversations ? data.conversations.length : 0,
        storageKey: this.STORAGE_KEY,
        rawData: localStorage.getItem(this.STORAGE_KEY)?.substring(0, 100) + '...'
      });
    } catch (error) {
      console.error('Failed to log storage contents:', error);
    }
  }
}