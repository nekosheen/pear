import React, { createContext, useContext, useState, useEffect } from 'react';
import { ConversationManager, Conversation } from '../../api/conversationManager';
import { SettingsManager } from '../../api/settingsManager';
import { MistralService } from '../../api/mistralService';

interface AppContextType {
  conversations: Conversation[];
  currentConversationId: string | null;
  apiKey: string | null;
  model: string;
  isLoading: boolean;
  error: string | null;
  isSettingsOpen: boolean;
  createConversation: () => void;
  deleteConversation: (id: string) => void;
  switchConversation: (id: string) => void;
  sendMessage: (message: string) => Promise<void>;
  setApiKey: (key: string) => Promise<void>;
  setModel: (model: string) => Promise<void>;
  testConnection: () => Promise<boolean>;
  openSettings: () => void;
  closeSettings: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const conversationManager = ConversationManager.getInstance();
  const settingsManager = SettingsManager.getInstance();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [apiKey, setApiKeyState] = useState<string | null>(null);
  const [model, setModelState] = useState<string>('mistral-tiny');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

  // Initialize state from local storage
  useEffect(() => {
    const loadInitialState = () => {
      const convs = conversationManager.getAllConversations();
      const currentId = conversationManager.getCurrentConversationId();
      const key = settingsManager.getApiKey();
      const currentModel = settingsManager.getModel();
      
      setConversations(convs);
      setCurrentConversationId(currentId);
      setApiKeyState(key);
      setModelState(currentModel || 'mistral-tiny');
      
      // If no conversations exist, create a welcome conversation
      if (convs.length === 0) {
        const welcomeConv = conversationManager.createConversation();
        setConversations([welcomeConv]);
        setCurrentConversationId(welcomeConv.id);
        
        // Add a welcome message
        conversationManager.addMessage('assistant', key
          ? 'Hello! I\'m your Mistral AI assistant. How can I help you today?'
          : 'Welcome to Pear! To get started, open Settings (⋮) and add your Mistral API key.'
        );
        
        // Refresh conversations after adding welcome message
        const updatedConvs = conversationManager.getAllConversations();
        setConversations(updatedConvs);
      }
    };
    
    loadInitialState();
    
    // Set up event listeners for external changes
    window.addEventListener('storage', loadInitialState);
    
    return () => {
      window.removeEventListener('storage', loadInitialState);
    };
  }, []);

  const createConversation = () => {
    try {
      const newConv = conversationManager.createConversation();
      setConversations(conversationManager.getAllConversations());
      setCurrentConversationId(newConv.id);
    } catch (err) {
      setError('Failed to create conversation');
      console.error('Create conversation error:', err);
    }
  };

  const deleteConversation = (id: string) => {
    try {
      conversationManager.deleteConversation(id);
      const updatedConvs = conversationManager.getAllConversations();
      setConversations(updatedConvs);
      
      // If we deleted the current conversation, create a new one
      if (currentConversationId === id) {
        const newConv = conversationManager.createConversation();
        setCurrentConversationId(newConv.id);
      }
    } catch (err) {
      setError('Failed to delete conversation');
      console.error('Delete conversation error:', err);
    }
  };

  const switchConversation = (id: string) => {
    try {
      const conv = conversationManager.switchToConversation(id);
      if (conv) {
        setCurrentConversationId(id);
      }
    } catch (err) {
      setError('Failed to switch conversation');
      console.error('Switch conversation error:', err);
    }
  };

  const sendMessage = async (message: string) => {
    if (!apiKey) {
      setError('API key not configured. Open Settings to add your Mistral API key.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Add user message first
      conversationManager.addMessage('user', message);
      setConversations(conversationManager.getAllConversations());

      // Build message history for the API
      const currentConv = conversationManager.getCurrentConversation();
      if (!currentConv) return;

      const chatMessages = currentConv.messages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

      // Call Mistral API
      const mistralService = new MistralService(apiKey, model);
      const response = await mistralService.chat(chatMessages);
      const assistantContent = response.choices[0]?.message?.content;

      if (assistantContent) {
        conversationManager.addMessage('assistant', assistantContent);
        setConversations(conversationManager.getAllConversations());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      console.error('Send message error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const setApiKey = async (key: string) => {
    await settingsManager.setApiKey(key);
    setApiKeyState(key);
  };

  const setModel = async (newModel: string) => {
    await settingsManager.setModel(newModel);
    setModelState(newModel);
  };

  const testConnection = async () => {
    if (!apiKey) return false;
    
    try {
      const isValid = await settingsManager.testApiKey(apiKey);
      return isValid;
    } catch (err) {
      setError('Connection test failed');
      return false;
    }
  };

  return (
    <AppContext.Provider value={{
      conversations,
      currentConversationId,
      apiKey,
      model,
      isLoading,
      error,
      isSettingsOpen,
      createConversation,
      deleteConversation,
      switchConversation,
      sendMessage,
      setApiKey,
      setModel,
      testConnection,
      openSettings,
      closeSettings,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};