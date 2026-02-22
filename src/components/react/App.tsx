import React from 'react';
import { createRoot } from 'react-dom/client';
import { motion } from 'framer-motion';
import ChatInterface from './ChatInterface';
import Sidebar from './SidebarEnhanced';
import { AppProvider } from '../state/AppContext';
import ErrorBoundary from './ErrorBoundary';
import { AppThemeProvider } from './ThemeProvider';

// Main App Component
const App: React.FC = () => {
  return (
    <React.StrictMode>
      <ErrorBoundary>
        <AppThemeProvider>
          <AppProvider>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex h-screen overflow-hidden"
            >
              <Sidebar />
              <ChatInterface />
            </motion.div>
          </AppProvider>
        </AppThemeProvider>
      </ErrorBoundary>
    </React.StrictMode>
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