import React, { useState, useEffect } from 'react';
import { Command, Search, Sparkles, Receipt, ShieldAlert, ArrowRight, CornerDownLeft, Play, X, Radar } from 'lucide-react';
import { webMcpAgent } from '../services/webMcpAgent';

export function CommandBar({ isOpen, onClose, navigateTo }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(true);
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const suggestions = [
    {
      text: "What is expiring?",
      icon: ShieldAlert,
      action: async () => {
        onClose();
        navigateTo('/vault/warranty-radar');
        await webMcpAgent.executeTool('find_expiring_warranties');
      }
    },
    {
      text: "What can I claim?",
      icon: Sparkles,
      action: async () => {
        onClose();
        navigateTo('/vault/claims');
      }
    },
    {
      text: "Find my monitor receipt",
      icon: Receipt,
      action: async () => {
        onClose();
        await webMcpAgent.executeTool('get_receipt', { purchaseId: 'purch-1' });
      }
    },
    {
      text: "Prepare a claim for my headphones",
      icon: Command,
      action: async () => {
        onClose();
        navigateTo('/vault');
        await webMcpAgent.executeTool('prepare_claim', {
          purchaseId: 'purch-2',
          issue: 'Left earcup stopped producing sound after recent firmware update.'
        });
      }
    },
    {
      text: "Run complete 3-minute WebMCP demo",
      icon: Play,
      action: async () => {
        onClose();
        navigateTo('/vault');
        webMcpAgent.runDemoWorkflow();
      }
    }
  ];

  const filteredSuggestions = suggestions.filter((s) =>
    s.text.toLowerCase().includes(query.toLowerCase())
  );

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onClose();

    const q = query.toLowerCase();
    if (q.includes('expire') || q.includes('month') || q.includes('radar')) {
      navigateTo('/vault/warranty-radar');
      await webMcpAgent.executeTool('find_expiring_warranties');
    } else if (q.includes('claim')) {
      navigateTo('/vault/claims');
    } else {
      // Dynamic execution for ALL purchases ("Apple MacBook", "MacBook", "Sony headphones", "LG monitor", "Mechanical Keyboard", etc.)
      await webMcpAgent.executeTool('search_purchases', { query });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-28 p-4 bg-[#2d2d2d]/75 backdrop-blur-md animate-in fade-in duration-150">
      {/* Hand-Drawn Raycast Command Palette Box */}
      <div className="relative w-full max-w-2xl bg-[#fdfbf7] border-[4px] border-[#2d2d2d] wobbly-card sketch-shadow-lg p-4 md:p-6">
        
        {/* Top Tape Strip */}
        <div className="tape-strip" />

        {/* Input Form Header */}
        <form onSubmit={handleCustomSubmit} className="relative flex items-center mb-4">
          <Search className="absolute left-3 w-6 h-6 text-[#2d5da1]" strokeWidth={2.5} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a purchase name (e.g., 'Apple MacBook', 'Sony headphones', 'LG monitor')"
            autoFocus
            className="w-full pl-12 pr-12 py-3 bg-white border-2 border-[#2d2d2d] wobbly-input font-body text-xl text-[#2d2d2d] placeholder-[#2d2d2d]/40 focus:outline-none focus:border-[#2d5da1] focus:ring-2 focus:ring-[#2d5da1]/20 sketch-shadow-sm"
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 p-1 text-[#2d2d2d]/60 hover:text-[#2d2d2d]"
          >
            <X className="w-5 h-5" />
          </button>
        </form>

        {/* Suggested Actions Section */}
        <div>
          <div className="flex items-center justify-between px-2 py-1 mb-2 font-mono text-xs font-bold text-[#2d2d2d]/60">
            <span>SUGGESTED COMMANDS OR TYPE ANY PURCHASE NAME</span>
            <span className="flex items-center gap-1">Press <kbd className="bg-white border px-1 rounded">↵</kbd> to search</span>
          </div>

          <div className="space-y-1.5 max-h-72 overflow-y-auto">
            {filteredSuggestions.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={item.action}
                  className="w-full flex items-center justify-between p-3 bg-white hover:bg-[#fff9c4] border-2 border-[#2d2d2d] wobbly-sm text-left transition-colors group sketch-shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-[#e5e0d8] group-hover:bg-[#ff4d4d] group-hover:text-white border border-[#2d2d2d] rounded transition-colors">
                      <Icon className="w-4 h-4" strokeWidth={2.5} />
                    </div>
                    <span className="font-heading text-xl text-[#2d2d2d] font-bold">
                      {item.text}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 font-mono text-xs text-[#2d5da1] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                    <span>Execute</span>
                    <CornerDownLeft className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })}

            {filteredSuggestions.length === 0 && (
              <div className="p-6 text-center text-[#2d2d2d]/60 font-body text-xl">
                Search purchase: "{query}". Press <kbd className="bg-white border px-1 rounded font-mono">Enter</kbd> to inspect details.
              </div>
            )}
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className="mt-4 pt-3 border-t-2 border-dashed border-[#2d2d2d] flex items-center justify-between font-mono text-xs text-[#2d2d2d]/60">
          <div className="flex gap-3">
            <span><kbd className="bg-white border px-1 rounded">⌘K</kbd> Toggle</span>
            <span><kbd className="bg-white border px-1 rounded">ESC</kbd> Close</span>
          </div>
          <span className="font-bold text-[#2d5da1]">WebMCP Universal Purchase Search</span>
        </div>
      </div>
    </div>
  );
}
