import React from 'react';
import { useAppContext } from '../state/AppContext';
import ConversationList from './ConversationList';

interface SidebarProps {
  // Props will be added as needed
}

const Sidebar: React.FC<SidebarProps> = () => {
  const { conversations, currentConversationId, createConversation } = useAppContext();

  return (
    <div className="w-60 bg-gray-900 flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🍐</span>
          <span className="text-white font-bold text-lg">Pear</span>
        </div>
        <p className="text-gray-500 text-xs mt-1 font-medium tracking-wide uppercase">Mistral AI</p>
      </div>

      {/* New Chat Button */}
      <div className="p-3 flex-shrink-0">
        <button
          onClick={createConversation}
          className="w-full text-left text-sm text-gray-400 hover:bg-gray-800 hover:text-gray-200 rounded-lg px-3 py-2.5 transition-colors duration-150 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Chat
        </button>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5">
        <ConversationList
          conversations={conversations}
          currentConversationId={currentConversationId}
        />
      </div>

      {/* Settings Button */}
      <button
        id="settings-button"
        className="p-4 border-t border-gray-800 w-full text-left hover:bg-gray-800 transition-colors duration-150 group"
        title="Settings"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-mistral flex items-center justify-center flex-shrink-0 group-hover:bg-mistral-dark transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-gray-200 text-sm font-medium truncate">You</p>
            <p className="text-gray-500 text-xs group-hover:text-gray-400 transition-colors">Click to open Settings</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-gray-600 group-hover:text-gray-400 flex-shrink-0 transition-colors">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.43.992a6.759 6.759 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </button>
    </div>
  );
};

export default Sidebar;