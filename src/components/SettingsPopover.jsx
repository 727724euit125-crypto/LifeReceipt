import React, { useState, useEffect, useRef } from 'react';
import { Settings, User, AlertTriangle, LogOut, Sun, Moon, Check, X } from 'lucide-react';
import { webMcpAgent } from '../services/webMcpAgent';

export function SettingsPopover({ isOpen, onClose, onOpenProfile, onOpenReportProblem, onOpenLogout }) {
  const [agentState, setAgentState] = useState(webMcpAgent.getState());
  const popoverRef = useRef(null);

  useEffect(() => {
    return webMcpAgent.subscribe((state) => setAgentState(state));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        onClose();
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleThemeChange = (newTheme) => {
    webMcpAgent.setTheme(newTheme);
  };

  return (
    <div 
      ref={popoverRef}
      className="absolute right-0 top-12 z-50 w-72 bg-[#fdfbf7] dark:bg-[#1f2028] border-[3px] border-[#2d2d2d] dark:border-white/30 wobbly-card sketch-shadow-lg p-4 animate-in fade-in zoom-in-95 duration-150 text-[#2d2d2d] dark:text-[#f3f4f6]"
    >
      <div className="tape-strip" />

      {/* Popover Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-[#2d2d2d]/30 dark:border-white/20 mb-3">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#2d5da1] dark:text-[#ff4d4d]" strokeWidth={2.5} />
          <h3 className="font-heading text-2xl font-bold tracking-tight">
            SETTINGS
          </h3>
        </div>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-[#e5e0d8] dark:hover:bg-white/10 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 1. APPEARANCE SECTION */}
      <div className="space-y-2 mb-4">
        <span className="font-mono text-[11px] font-bold text-[#2d2d2d]/60 dark:text-white/60 block uppercase">
          1. APPEARANCE
        </span>
        <div className="flex items-center justify-between p-2 bg-white dark:bg-[#282a36] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-sm sketch-shadow-sm">
          <span className="font-body text-lg font-bold">Theme</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleThemeChange('dark')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-bold rounded transition-all border ${
                agentState.theme === 'dark'
                  ? 'bg-[#2d2d2d] text-white border-white'
                  : 'bg-white text-[#2d2d2d] border-[#2d2d2d]/30 hover:bg-[#e5e0d8]'
              }`}
            >
              <Moon className="w-3 h-3" />
              <span>Dark</span>
            </button>

            <button
              onClick={() => handleThemeChange('light')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-bold rounded transition-all border ${
                agentState.theme === 'light'
                  ? 'bg-[#fff9c4] text-[#2d2d2d] border-[#2d2d2d]'
                  : 'bg-white text-[#2d2d2d] border-[#2d2d2d]/30 hover:bg-[#e5e0d8]'
              }`}
            >
              <Sun className="w-3 h-3 text-[#f59e0b]" />
              <span>Light</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. PROFILE SECTION */}
      <div className="space-y-1 mb-4">
        <span className="font-mono text-[11px] font-bold text-[#2d2d2d]/60 dark:text-white/60 block uppercase">
          2. PROFILE
        </span>
        <button
          onClick={() => {
            onClose();
            onOpenProfile();
          }}
          className="w-full flex items-center justify-between p-2 bg-white dark:bg-[#282a36] hover:bg-[#fff9c4] dark:hover:bg-[#2d5da1] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-sm text-left transition-colors group sketch-shadow-sm"
        >
          <div className="flex items-center gap-2.5">
            <User className="w-4 h-4 text-[#2d5da1] dark:text-[#ff4d4d] group-hover:text-[#2d2d2d]" strokeWidth={2.5} />
            <span className="font-body text-xl font-bold">👤 Profile</span>
          </div>
          <span className="font-mono text-xs text-[#2d2d2d]/60 dark:text-white/60 font-bold">
            {agentState.userProfile.name.split(' ')[0]}
          </span>
        </button>
      </div>

      {/* 3. REPORT A PROBLEM SECTION (APPLICATION ONLY) */}
      <div className="space-y-1 mb-4">
        <span className="font-mono text-[11px] font-bold text-[#ff4d4d] block uppercase">
          3. APPLICATION SUPPORT
        </span>
        <button
          onClick={() => {
            onClose();
            onOpenReportProblem();
          }}
          className="w-full flex items-center justify-between p-2 bg-[#ffebee] dark:bg-[#ff4d4d]/20 hover:bg-[#ff4d4d] hover:text-white border-2 border-[#2d2d2d] dark:border-white/30 wobbly-sm text-left transition-colors group sketch-shadow-sm"
        >
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-[#ff4d4d] group-hover:text-white" strokeWidth={2.5} />
            <span className="font-body text-xl font-bold">⚠️ Report a Problem</span>
          </div>
          <span className="font-mono text-[10px] bg-white dark:bg-black/40 text-[#2d2d2d] dark:text-white px-1.5 py-0.5 rounded font-bold">
            APP BUG
          </span>
        </button>
      </div>

      {/* 4. LOG OUT SECTION */}
      <div className="pt-2 border-t-2 border-dashed border-[#2d2d2d]/30 dark:border-white/20">
        <button
          onClick={() => {
            onClose();
            onOpenLogout();
          }}
          className="w-full flex items-center gap-2.5 p-2 bg-white dark:bg-[#282a36] hover:bg-[#ff4d4d] hover:text-white border-2 border-[#2d2d2d] dark:border-white/30 wobbly-sm font-body text-xl font-bold transition-colors group sketch-shadow-sm"
        >
          <LogOut className="w-4 h-4 text-[#2d2d2d] dark:text-white group-hover:text-white" strokeWidth={2.5} />
          <span>🚪 Log Out</span>
        </button>
      </div>
    </div>
  );
}
