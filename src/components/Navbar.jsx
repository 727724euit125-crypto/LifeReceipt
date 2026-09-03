import React, { useState, useEffect } from 'react';
import { 
  Receipt, 
  ShieldCheck, 
  Sparkles, 
  Terminal, 
  Radar, 
  FileCheck2, 
  Search, 
  Settings,
  Menu, 
  X
} from 'lucide-react';
import { webMcpAgent } from '../services/webMcpAgent';
import { SettingsPopover } from './SettingsPopover';

export function Navbar({ 
  currentRoute, 
  navigateTo, 
  onOpenCommandBar,
  onOpenProfile,
  onOpenReportProblem,
  onOpenLogout
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [agentState, setAgentState] = useState(webMcpAgent.getState());

  useEffect(() => {
    return webMcpAgent.subscribe((state) => setAgentState(state));
  }, []);

  const navItems = [
    { label: 'Vault', route: '/vault', icon: ShieldCheck },
    { label: 'Purchases', route: '/vault/purchases', icon: Receipt },
    { label: 'Warranty Radar', route: '/vault/warranty-radar', icon: Radar },
    { label: 'Claims', route: '/vault/claims', icon: FileCheck2 },
    { label: 'Agent Log', route: '/vault/agent-activity', icon: Terminal },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#fdfbf7]/90 dark:bg-[#16171d]/90 backdrop-blur-md border-b-[3px] border-[#2d2d2d] dark:border-white/20 py-3 px-4 md:px-8 transition-all text-[#2d2d2d] dark:text-[#f3f4f6]">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4 relative">
        
        {/* Brand / Logo (Left) */}
        <button 
          onClick={() => navigateTo('/')}
          className="flex items-center gap-3 group text-left focus:outline-none shrink-0"
        >
          <div className="w-10 h-10 bg-[#fff9c4] dark:bg-[#2d5da1] border-[3px] border-[#2d2d2d] dark:border-white/30 wobbly-sm flex items-center justify-center sketch-shadow group-hover:rotate-6 transition-transform">
            <Receipt className="w-6 h-6 text-[#2d2d2d] dark:text-white" strokeWidth={2.5} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-[#2d2d2d] dark:text-white">
                Life<span className="text-[#ff4d4d]">Receipt</span>
              </span>
              <span className="text-xs bg-[#2d5da1] text-white px-2 py-0.5 wobbly-badge font-mono font-bold tracking-wider">
                WEBMCP
              </span>
            </div>
            <p className="text-xs text-[#2d2d2d]/70 dark:text-white/70 hidden sm:block font-body -mt-1">
              Your purchases, remembered.
            </p>
          </div>
        </button>

        {/* Center Container: Main Navigation Links + Search Button */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Main Navigation Links */}
          <nav className="flex items-center gap-1 bg-white/70 dark:bg-[#282a36]/70 p-1.5 border-2 border-[#2d2d2d] dark:border-white/30 wobbly-md sketch-shadow-sm">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => navigateTo(item.route)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 font-body text-lg font-bold rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#fff9c4] dark:bg-[#ff4d4d] text-[#2d2d2d] dark:text-white border-2 border-[#2d2d2d] dark:border-white sketch-shadow-sm rotate-[-1deg]'
                      : 'text-[#2d2d2d]/80 dark:text-white/80 hover:text-[#2d2d2d] dark:hover:text-white hover:bg-[#e5e0d8]/50 dark:hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" strokeWidth={2.5} />
                  <span>{item.label}</span>
                  {item.route === '/vault/claims' && agentState.claims.some(c => c.status === 'AWAITING_APPROVAL') && (
                    <span className="w-2.5 h-2.5 bg-[#ff4d4d] rounded-full animate-ping inline-block ml-0.5" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* SEARCH BUTTON */}
          <button
            onClick={onOpenCommandBar}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-white dark:bg-[#282a36] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-btn sketch-shadow-hover text-sm font-mono font-bold text-[#2d2d2d] dark:text-white"
            title="Open Search (Cmd+K)"
          >
            <Search className="w-4 h-4 text-[#2d5da1] dark:text-[#ff4d4d]" strokeWidth={2.5} />
            <span>Search</span>
          </button>
        </div>

        {/* Right Action Controls: Settings (Far Right) */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 bg-white dark:bg-[#282a36] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-sm text-[#2d2d2d] dark:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* SETTINGS ⚙️ ICON BUTTON (EXTREME FAR RIGHT WITH VERTICAL DIVIDER) */}
          <div className="relative border-l-2 border-dashed border-[#2d2d2d]/30 dark:border-white/30 pl-2.5 md:pl-3 ml-1">
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={`p-2.5 bg-[#fff9c4] dark:bg-[#282a36] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-btn sketch-shadow-hover text-[#2d2d2d] dark:text-white transition-all flex items-center justify-center ${
                settingsOpen ? 'rotate-90 bg-[#ff4d4d] text-white dark:bg-[#ff4d4d]' : 'hover:bg-[#ff4d4d] hover:text-white'
              }`}
              title="Settings & Application Options"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" strokeWidth={2.5} />
            </button>

            {/* FLOATING SETTINGS POPOVER */}
            <SettingsPopover
              isOpen={settingsOpen}
              onClose={() => setSettingsOpen(false)}
              onOpenProfile={onOpenProfile}
              onOpenReportProblem={onOpenReportProblem}
              onOpenLogout={onOpenLogout}
            />
          </div>

        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t-2 border-[#2d2d2d] dark:border-white/20 bg-[#fdfbf7] dark:bg-[#16171d] flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.route}
                onClick={() => {
                  navigateTo(item.route);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-2 text-xl font-heading font-bold rounded-lg ${
                  isActive ? 'bg-[#fff9c4] dark:bg-[#ff4d4d] border-2 border-[#2d2d2d] text-[#2d2d2d] dark:text-white' : 'text-[#2d2d2d] dark:text-white'
                }`}
              >
                <Icon className="w-4 h-4 text-[#2d5da1] dark:text-[#ff4d4d]" strokeWidth={2.5} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => {
              onOpenCommandBar();
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 px-4 py-2 text-xl font-heading font-bold text-[#2d5da1] dark:text-[#ff4d4d]"
          >
            <Search className="w-4 h-4" strokeWidth={2.5} />
            <span>Search</span>
          </button>

          <button
            onClick={() => {
              setSettingsOpen(true);
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 px-4 py-2 text-xl font-heading font-bold text-[#2d2d2d] dark:text-white"
          >
            <Settings className="w-4 h-4" strokeWidth={2.5} />
            <span>Settings ⚙️</span>
          </button>
        </div>
      )}
    </header>
  );
}
