import React from 'react';
import { createRoot } from 'react-dom/client';
import ChatInterface from './ChatInterface';
import Sidebar from './Sidebar';
import { AppProvider } from '../state/AppContext';

// Main App Component
const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <ChatInterface />
      </div>
    </AppProvider>
  );
};

// Initialize React when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('root');
  if (container) {
    const root = createRoot(container);
    root.render(<App />);
  } else {
    console.error('Root container not found');
  }
});

export default App;