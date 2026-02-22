import React from 'react';
import { Conversation } from '../../api/conversationManager';
import ConversationItem from './ConversationItem';

interface ConversationListProps {
  conversations: Conversation[];
  currentConversationId: string | null;
}

const ConversationList: React.FC<ConversationListProps> = ({ conversations, currentConversationId }) => {
  return (
    <>
      {conversations.map((conv) => (
        <ConversationItem
          key={conv.id}
          conversation={conv}
          isActive={conv.id === currentConversationId}
        />
      ))}
    </>
  );
};

export default ConversationList;