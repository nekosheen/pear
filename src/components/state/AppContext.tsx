import React, { createContext, useContext, useState, useEffect } from 'react';
import { ConversationManager, Conversation } from '../../api/conversationManager';
import { SettingsManager } from '../../api/settingsManager';

interface AppContextType {
  conversations: Conversation[];
  currentConversationId: string | null;
  apiKey: string | null;
  model: string;
  isLoading: boolean;
  error: string | null;
  createConversation: () => void;
  deleteConversation: (id: string) => void;
  switchConversation: (id: string) => void;
  sendMessage: (message: string) => Promise<void>;
  setApiKey: (key: string) => void;
  setModel: (model: string) => void;
  testConnection: () => Promise<boolean>;
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
      setError('API key not configured');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // This would integrate with the MistralService
      // For now, we'll simulate adding the message
      const currentConv = conversationManager.getCurrentConversation();
      if (currentConv) {
        conversationManager.addMessage('user', message);
        setConversations(conversationManager.getAllConversations());
        
        // TODO: Integrate with actual Mistral API
        // const response = await mistralService.chat(...);
        // conversationManager.addMessage('assistant', response);
      }
    } catch (err) {
      setError('Failed to send message');
      console.error('Send message error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const setApiKey = (key: string) => {
    try {
      settingsManager.setApiKey(key);
      setApiKeyState(key);
    } catch (err) {
      setError('Failed to save API key');
      console.error('Set API key error:', err);
    }
  };

  const setModel = (newModel: string) => {
    try {
      settingsManager.setModel(newModel);
      setModelState(newModel);
    } catch (err) {
      setError('Failed to save model');
      console.error('Set model error:', err);
    }
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
      createConversation,
      deleteConversation,
      switchConversation,
      sendMessage,
      setApiKey,
      setModel,
      testConnection
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