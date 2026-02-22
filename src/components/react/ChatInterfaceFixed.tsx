import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { css } from '@emotion/react';
import { useAppContext } from '../state/AppContext';
import { useTheme } from './ThemeProvider';
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
  const theme = useTheme();
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

  // Style definitions
  const chatInterfaceStyles = css`
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: ${theme.colors.white};
    min-width: 0;
    height: 100vh;
    overflow: hidden;
  `;

  const headerStyles = css`
    border-bottom: 1px solid ${theme.colors.gray[200]};
    padding: ${theme.spacing[6]} ${theme.spacing[6]};
    display: flex;
    align-items: center;
    background-color: ${theme.colors.white};
    flex-shrink: 0;
  `;

  const avatarStyles = css`
    width: ${theme.spacing[9]};
    height: ${theme.spacing[9]};
    border-radius: 50%;
    background-color: ${theme.colors.mistral.DEFAULT};
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: ${theme.shadows.sm};
  `;

  const avatarTextStyles = css`
    color: ${theme.colors.white};
    font-size: ${theme.typography.fontSize.sm};
    font-weight: ${theme.typography.fontWeight.bold};
  `;

  const headerInfoStyles = css`
    margin-left: ${theme.spacing[3]};
  `;

  const headerTitleStyles = css`
    font-size: ${theme.typography.fontSize.sm};
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.gray[900]};
  `;

  const statusContainerStyles = css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing[1.5]};
    margin-top: ${theme.spacing[1]};
  `;

  const statusDotStyles = css`
    width: ${theme.spacing[2]};
    height: ${theme.spacing[2]};
    border-radius: 50%;
    background-color: ${theme.colors.success};
  `;

  const statusTextStyles = css`
    font-size: ${theme.typography.fontSize.xs};
    font-weight: ${theme.typography.fontWeight.medium};
    color: ${theme.colors.success};
  `;

  const chatAreaStyles = css`
    flex: 1;
    overflow-y: auto;
    padding: ${theme.spacing[6]};
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing[5]};
  `;

  const emptyChatStyles = css`
    text-align: center;
    padding: ${theme.spacing[10]} 0;
    color: ${theme.colors.gray[500]};
  `;

  const userBubbleStyles = css`
    align-self: flex-end;
    max-width: 80%;
    background-color: ${theme.colors.mistral.DEFAULT};
    color: ${theme.colors.white};
    padding: ${theme.spacing[3]} ${theme.spacing[4]};
    border-radius: ${theme.spacing[3]} ${theme.spacing[1]} ${theme.spacing[3]} ${theme.spacing[3]};
    margin-left: auto;
    word-wrap: break-word;
  `;

  const assistantBubbleStyles = css`
    align-self: flex-start;
    max-width: 80%;
    background-color: ${theme.colors.gray[100]};
    color: ${theme.colors.gray[900]};
    padding: ${theme.spacing[3]} ${theme.spacing[4]};
    border-radius: ${theme.spacing[1]} ${theme.spacing[3]} ${theme.spacing[3]} ${theme.spacing[3]};
    margin-right: auto;
    
    /* Markdown styling */
    h1, h2, h3, h4, h5, h6 {
      margin-top: ${theme.spacing[4]};
      margin-bottom: ${theme.spacing[2]};
      color: ${theme.colors.gray[900]};
    }
    
    p {
      margin-bottom: ${theme.spacing[3]};
      line-height: 1.6;
    }
    
    code {
      background-color: ${theme.colors.gray[200]};
      padding: ${theme.spacing[1]} ${theme.spacing[2]};
      border-radius: ${theme.spacing[1]};
      font-family: monospace;
    }
    
    pre {
      background-color: ${theme.colors.gray[900]};
      color: ${theme.colors.white};
      padding: ${theme.spacing[4]};
      border-radius: ${theme.spacing[2]};
      overflow-x: auto;
      
      code {
        background: none;
        padding: 0;
      }
    }
  `;

  const loadingBubbleStyles = css`
    ${assistantBubbleStyles}
    display: flex;
    align-items: center;
    gap: ${theme.spacing[2]};
  `;

  const loadingDotStyles = css`
    width: ${theme.spacing[2]};
    height: ${theme.spacing[2]};
    border-radius: 50%;
    background-color: ${theme.colors.gray[400]};
    animation: pulse 1.5s infinite ease-in-out;
    
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 0.4;
      }
      50% {
        opacity: 1;
      }
    }
  `;

  const errorStyles = css`
    padding: ${theme.spacing[2]} ${theme.spacing[4]};
    background-color: ${theme.colors.danger[50]};
    border: 1px solid ${theme.colors.danger[200]};
    color: ${theme.colors.danger};
    border-radius: ${theme.spacing[2]};
    font-size: ${theme.typography.fontSize.sm};
    margin: 0 ${theme.spacing[6]} ${theme.spacing[2]};
  `;

  const inputAreaStyles = css`
    border-top: 1px solid ${theme.colors.gray[100]};
    padding: ${theme.spacing[6]};
    background-color: ${theme.colors.white};
    flex-shrink: 0;
  `;

  const noApiKeyNoticeStyles = css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing[2]};
    background-color: ${theme.colors.warning[50]};
    border: 1px solid ${theme.colors.warning[200]};
    color: ${theme.colors.warning};
    padding: ${theme.spacing[2]} ${theme.spacing[3]};
    border-radius: ${theme.spacing[2]};
    margin-bottom: ${theme.spacing[3]};
    font-size: ${theme.typography.fontSize.sm};
  `;

  const inputWrapperStyles = css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing[3]};
    background-color: ${theme.colors.gray[50]};
    border: 1px solid ${theme.colors.gray[200]};
    border-radius: ${theme.spacing[5]};
    padding: ${theme.spacing[3]} ${theme.spacing[4]};
    transition: all 0.2s ease;
    
    &:focus-within {
      border-color: ${theme.colors.mistral.DEFAULT};
      box-shadow: 0 0 0 2px ${theme.colors.mistral[50]};
    }
  `;

  const inputStyles = css`
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.gray[900]};
    min-width: 0;
    
    &::placeholder {
      color: ${theme.colors.gray[400]};
    }
    
    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  `;

  const sendButtonStyles = css`
    padding: ${theme.spacing[2.5]};
    background-color: ${theme.colors.mistral.DEFAULT};
    color: ${theme.colors.white};
    border-radius: ${theme.spacing[3]};
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.2s ease;
    box-shadow: ${theme.shadows.sm};
    
    &:hover:not(:disabled) {
      background-color: ${theme.colors.mistral.dark};
    }
    
    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  `;

  const disclaimerStyles = css`
    font-size: ${theme.typography.fontSize.xs};
    color: ${theme.colors.gray[400]};
    text-align: center;
    margin-top: ${theme.spacing[2.5]};
  `;

  return (
    <div css={chatInterfaceStyles}>
      {/* Header Section */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        css={headerStyles}
      >
        <div css={css`display: flex; align-items: center; gap: ${theme.spacing[3]};`}>
          <div css={avatarStyles}>
            <span css={avatarTextStyles}>M</span>
          </div>
          <div css={headerInfoStyles}>
            <p css={headerTitleStyles}>Mistral AI</p>
            <div css={statusContainerStyles}>
              <span css={statusDotStyles}></span>
              <span css={statusTextStyles}>Online</span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Chat Area Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        css={chatAreaStyles}
      >
        {messages.length === 0 ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            css={emptyChatStyles}
          >
            {apiKey ? 'Start a new conversation...' : 'Configure your API key in settings to begin'}
          </motion.div>
        ) : (
          messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              css={msg.role === 'user' ? userBubbleStyles : assistantBubbleStyles}
              dangerouslySetInnerHTML={{
                __html: msg.role === 'assistant' ? marked.parse(msg.content) : msg.content
              }}
            />
          ))
        )}
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            css={loadingBubbleStyles}
          >
            <span css={loadingDotStyles}></span>
            <span css={loadingDotStyles}></span>
            <span css={loadingDotStyles}></span>
          </motion.div>
        )}
        
        <div ref={chatEndRef} />
      </motion.div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          css={errorStyles}
        >
          {error}
        </motion.div>
      )}

      {/* Input Area Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        css={inputAreaStyles}
      >
        {!apiKey && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            css={noApiKeyNoticeStyles}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" css={css`width: ${theme.spacing[4]}; height: ${theme.spacing[4]}; flex-shrink: 0;`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
            <span>Add your Mistral API key in <strong>Settings</strong> (your avatar, bottom left) to start chatting.</span>
          </motion.div>
        )}

        <div css={inputWrapperStyles}>
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!apiKey || isLoading}
            css={inputStyles}
            placeholder="Message Mistral AI..."
            autoComplete="off"
            aria-label="Type your message here"
          />
          <button
            onClick={handleSendMessage}
            disabled={!apiKey || isLoading || !messageInput.trim()}
            css={sendButtonStyles}
            aria-label="Send message"
            title="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" css={css`width: ${theme.spacing[4]}; height: ${theme.spacing[4]};`}>
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>
        <p css={disclaimerStyles}>Mistral AI can make mistakes. Use with discretion.</p>
      </motion.div>
    </div>
  );
};

export default ChatInterface;