import React from 'react';
import { Conversation } from '../../api/conversationManager';
import { useAppContext } from '../state/AppContext';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
}

const ConversationItem: React.FC<ConversationItemProps> = ({ conversation, isActive }) => {
  const { switchConversation, deleteConversation } = useAppContext();

  const formatRelativeDate = (timestamp: number): string => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60_000);
    const hours = Math.floor(diff / 3_600_000);
    const days = Math.floor(diff / 86_400_000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!isActive) {
      switchConversation(conversation.id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteConversation(conversation.id);
  };

  const escapeHtml = (text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  };

  return (
    <div className={`conversation-item${isActive ? ' active' : ''}`}>
      <button
        onClick={handleClick}
        className="conversation-button"
        title={conversation.title}
      >
        <span className="conv-title">{escapeHtml(conversation.title)}</span>
        <span className="conv-date">{formatRelativeDate(conversation.updatedAt)}</span>
      </button>
      <button
        onClick={handleDelete}
        className="delete-conversation-button"
        title="Delete conversation"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default ConversationItem;