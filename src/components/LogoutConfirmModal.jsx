import React, { useState } from 'react';
import { LogOut, ShieldCheck, ArrowRight } from 'lucide-react';
import { webMcpAgent } from '../services/webMcpAgent';

export function LogoutConfirmModal({ isOpen, onClose, navigateTo }) {
  const [isLoggedOutState, setIsLoggedOutState] = useState(false);

  if (!isOpen) return null;

  const handleConfirmLogout = () => {
    webMcpAgent.setLoggedOut(true);
    setIsLoggedOutState(true);
  };

  const handleReLogin = () => {
    webMcpAgent.setLoggedOut(false);
    setIsLoggedOutState(false);
    onClose();
    if (navigateTo) {
      navigateTo('/vault');
    }
  };

  const handleCancel = () => {
    setIsLoggedOutState(false);
    onClose();
  };

  const state = webMcpAgent.getState();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2d2d2d]/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-[#fdfbf7] dark:bg-[#1f2028] border-[4px] border-[#2d2d2d] dark:border-white/30 wobbly-card sketch-shadow-lg p-6 text-[#2d2d2d] dark:text-[#f3f4f6] space-y-5 text-center">
        
        <div className="tape-strip" />

        {!isLoggedOutState ? (
          <>
            {/* Warning Icon */}
            <div className="w-16 h-16 bg-[#ffebee] border-[3px] border-[#2d2d2d] wobbly-card mx-auto flex items-center justify-center sketch-shadow">
              <LogOut className="w-8 h-8 text-[#ff4d4d]" strokeWidth={2.5} />
            </div>

            <div>
              <h3 className="font-heading text-3xl font-bold">
                Log out of LifeReceipt?
              </h3>
              <p className="font-body text-xl text-[#2d2d2d]/80 dark:text-white/80 mt-1">
                Your WebMCP Purchase Vault session will be paused.
              </p>
            </div>

            <div className="p-3 bg-[#fff9c4] dark:bg-[#282a36] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-sm font-mono text-xs text-[#2d2d2d] dark:text-white font-bold">
              Account: {state.userProfile.name} ({state.userProfile.email})
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleCancel}
                className="w-1/2 py-2.5 bg-white dark:bg-[#282a36] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-btn font-body text-xl font-bold text-[#2d2d2d] dark:text-white"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmLogout}
                className="w-1/2 py-2.5 bg-[#ff4d4d] text-white border-2 border-[#2d2d2d] dark:border-white/30 wobbly-btn font-body text-xl font-bold sketch-shadow-hover"
              >
                Log Out
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-[#e8f5e9] border-[3px] border-[#2d2d2d] wobbly-card mx-auto flex items-center justify-center sketch-shadow">
              <ShieldCheck className="w-10 h-10 text-[#10b981]" strokeWidth={2.5} />
            </div>

            <div>
              <h3 className="font-heading text-3xl font-bold">
                Logged Out
              </h3>
              <p className="font-body text-xl text-[#10b981] font-bold mt-1">
                You have safely logged out of your vault session.
              </p>
            </div>

            <button
              onClick={handleReLogin}
              className="w-full py-3 bg-[#2d5da1] text-white border-2 border-[#2d2d2d] dark:border-white/30 wobbly-btn font-body text-xl font-bold sketch-shadow-hover flex items-center justify-center gap-2"
            >
              <span>Log Back In → Open Vault</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </>
        )}

      </div>
    </div>
  );
}
