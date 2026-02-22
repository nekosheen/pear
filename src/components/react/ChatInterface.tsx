import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../state/AppContext';
import { marked } from 'marked';

const ChatInterface: React.FC = () => {
  const { 
    currentConversationId, 
    conversations, 
    sendMessage, 
    isLoading, 
    error, 
    apiKey
  } = useAppContext();
  const [messageInput, setMessageInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Get current conversation messages
  const currentConversation = conversations.find(conv => conv.id === currentConversationId);
  const messages = currentConversation?.messages || [];

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    const message = messageInput.trim();
    if (!message) return;
    
    await sendMessage(message);
    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white min-w-0">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex items-center bg-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-mistral flex items-center justify-center shadow-sm">
            <span className="text-white text-sm font-bold">M</span>
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">Mistral AI</p>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block"></span>
              <span className="text-emerald-600 text-xs font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
        {messages.length === 0 ? (
          <div className="text-gray-500 text-center py-10">
            {apiKey ? 'Start a new conversation...' : 'Configure your API key in settings to begin'}
          </div>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={index}
              className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant markdown-body'}
              dangerouslySetInnerHTML={{
                __html: msg.role === 'assistant' ? marked.parse(msg.content) : msg.content
              }}
            />
          ))
        )}
        
        {isLoading && (
          <div className="chat-bubble-assistant loading">
            <span className="loading-dot"></span>
            <span className="loading-dot"></span>
            <span className="loading-dot"></span>
          </div>
        )}
        
        <div ref={chatEndRef} />
      </div>

      {/* Error Display */}
      {error && (
        <div className="px-6 pb-2">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-gray-100 px-6 py-4 bg-white">
        {!apiKey && (
          <div id="no-api-key-notice" className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 px-3 py-2 rounded-lg mb-3 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 flex-shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
            <span>Add your Mistral API key in <strong>Settings</strong> (your avatar, bottom left) to start chatting.</span>
          </div>
        )}

        <div className="flex items-center gap-3 bg-gray-50 rounded-2xl border border-gray-200 px-4 py-3 focus-within:border-mistral focus-within:ring-2 focus-within:ring-mistral-50 transition-all duration-200">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!apiKey || isLoading}
            className="flex-1 bg-transparent focus:outline-none text-sm text-gray-900 placeholder-gray-400 min-w-0 disabled:cursor-not-allowed"
            placeholder="Message Mistral AI..."
            autoComplete="off"
          />
          <button
            onClick={handleSendMessage}
            disabled={!apiKey || isLoading || !messageInput.trim()}
            className="p-2.5 bg-mistral text-white rounded-xl hover:bg-mistral-dark focus:outline-none focus:ring-2 focus:ring-mistral focus:ring-offset-1 transition-all duration-200 flex items-center justify-center flex-shrink-0 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            title="Send"
          >
            <svg xmlns="http://www://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-400 text-center mt-2.5">Mistral AI can make mistakes. Use with discretion.</p>
      </div>
    </div>
  );
};

export default ChatInterface;