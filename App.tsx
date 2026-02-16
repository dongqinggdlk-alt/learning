import React, { useState } from 'react';
import { View } from './types';
import TheoryVisualizer from './components/TheoryVisualizer';
import ChatInterface from './components/ChatInterface';
import ImageGenerator from './components/ImageGenerator';
import { Music, MessageSquare, Image as ImageIcon, Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.THEORY);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: View.THEORY, label: 'Theory & Scales', icon: Music },
    { id: View.CHAT, label: 'AI Tutor', icon: MessageSquare },
    { id: View.IMAGE, label: 'Art Studio', icon: ImageIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Navigation Bar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView(View.THEORY)}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-900/50">
                <Music className="text-white w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                Lumina
              </h1>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`
                      px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2
                      ${currentView === item.id 
                        ? 'bg-slate-800 text-white shadow-inner' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}
                    `}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-900">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    block w-full text-left px-3 py-4 rounded-md text-base font-medium flex items-center gap-3
                    ${currentView === item.id 
                      ? 'bg-slate-800 text-white' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'}
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="animate-fade-in-up">
           {currentView === View.THEORY && <TheoryVisualizer />}
           {currentView === View.CHAT && <ChatInterface />}
           {currentView === View.IMAGE && <ImageGenerator />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 mt-auto py-8 text-center text-slate-600 text-sm">
        <p>© {new Date().getFullYear()} Lumina Music. Powered by Google Gemini.</p>
      </footer>

    </div>
  );
};

export default App;