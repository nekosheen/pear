import React from 'react';
import { motion } from 'framer-motion';
import { css } from '@emotion/react';
import { useAppContext } from '../state/AppContext';
import ConversationList from './ConversationList';
import { useTheme } from './ThemeProvider';
import { responsiveSidebar, keyboardFocusable, srOnly } from '../../styles/responsive';

interface SidebarProps {
  // Props will be added as needed
}

const Sidebar: React.FC<SidebarProps> = () => {
  const { conversations, currentConversationId, createConversation } = useAppContext();
  const theme = useTheme();

  const sidebarStyles = css`
    width: 240px;
    background-color: ${theme.colors.gray[900]};
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    height: 100vh;
    overflow: hidden;
    ${responsiveSidebar}
  `;

  const logoStyles = css`
    padding: ${theme.spacing[5]};
    border-bottom: 1px solid ${theme.colors.gray[700]};
  `;

  const logoTextStyles = css`
    color: ${theme.colors.white};
    font-weight: ${theme.typography.fontWeight.bold};
    font-size: ${theme.typography.fontSize.lg};
  `;

  const logoSubtitleStyles = css`
    color: ${theme.colors.gray[500]};
    font-size: ${theme.typography.fontSize.xs};
    margin-top: ${theme.spacing[1]};
    font-weight: ${theme.typography.fontWeight.medium};
    text-transform: uppercase;
    letter-spacing: 0.05em;
  `;

  const newChatButtonStyles = css`
    width: 100%;
    text-align: left;
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.gray[400]};
    padding: ${theme.spacing[2]} ${theme.spacing[3]};
    border-radius: ${theme.spacing[2]};
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: ${theme.spacing[2]};
    transition: all 0.2s ease;
    ${keyboardFocusable}
    
    &:hover {
      background-color: ${theme.colors.gray[800]};
      color: ${theme.colors.gray[200]};
    }
  `;

  const conversationListStyles = css`
    flex: 1;
    overflow-y: auto;
    padding: ${theme.spacing[2]};
    padding-bottom: ${theme.spacing[2]};
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing[0.5]};
  `;

  const settingsButtonStyles = css`
    padding: ${theme.spacing[4]};
    border-top: 1px solid ${theme.colors.gray[800]};
    width: 100%;
    text-align: left;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease;
    
    &:hover {
      background-color: ${theme.colors.gray[800]};
    }
  `;

  const userAvatarStyles = css`
    width: ${theme.spacing[8]};
    height: ${theme.spacing[8]};
    border-radius: 50%;
    background-color: ${theme.colors.mistral.DEFAULT};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background-color 0.2s ease;
  `;

  const userInfoStyles = css`
    min-width: 0;
    flex: 1;
    overflow: hidden;
  `;

  const userNameStyles = css`
    color: ${theme.colors.gray[200]};
    font-size: ${theme.typography.fontSize.sm};
    font-weight: ${theme.typography.fontWeight.medium};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `;

  const userStatusStyles = css`
    color: ${theme.colors.gray[500]};
    font-size: ${theme.typography.fontSize.xs};
    transition: color 0.2s ease;
  `;

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      css={sidebarStyles}
    >
      {/* Logo with animation */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        css={logoStyles}
      >
        <div css={css`display: flex; align-items: center; gap: ${theme.spacing[2]};`}>
          <span css={css`font-size: ${theme.typography.fontSize['2xl']};`}>🍐</span>
          <span css={logoTextStyles}>Pear</span>
        </div>
        <p css={logoSubtitleStyles}>Mistral AI</p>
      </motion.div>

      {/* New Chat Button with animation */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        css={css`padding: ${theme.spacing[3]}; flex-shrink: 0;`}
      >
        <button 
          onClick={createConversation} 
          css={newChatButtonStyles}
          aria-label="Create new chat"
          title="Create new chat (Ctrl+N)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" css={css`width: ${theme.spacing[4]}; height: ${theme.spacing[4]};`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>New Chat</span>
          <span css={srOnly}> (Ctrl+N)</span>
        </button>
      </motion.div>

      {/* Conversation List with animation */}
      <motion.div
        initial={{ y: -5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        css={conversationListStyles}
      >
        <ConversationList
          conversations={conversations}
          currentConversationId={currentConversationId}
        />
      </motion.div>

      {/* Settings Button with animation */}
      <motion.button
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        id="settings-button"
        css={settingsButtonStyles}
        title="Settings"
        aria-label="Open settings"
      >
        <div css={css`display: flex; align-items: center; gap: ${theme.spacing[3]};`}>
          <div css={userAvatarStyles}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" css={css`width: ${theme.spacing[4]}; height: ${theme.spacing[4]}; color: white;`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div css={userInfoStyles}>
            <p css={userNameStyles}>You</p>
            <p css={userStatusStyles}>Click to open Settings</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" css={css`width: ${theme.spacing[4]}; height: ${theme.spacing[4]}; color: ${theme.colors.gray[600]}; flex-shrink: 0;`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.43.992a6.759 6.759 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          </svg>
        </div>
      </motion.button>
    </motion.div>
  );
};

export default Sidebar;