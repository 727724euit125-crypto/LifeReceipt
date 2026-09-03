import React from 'react';
import { User, ShieldCheck, Mail, Calendar, Key, CheckCircle2, X } from 'lucide-react';
import { webMcpAgent } from '../services/webMcpAgent';

export function ProfileModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const state = webMcpAgent.getState();
  const profile = state.userProfile;
  const metrics = {
    totalAssets: state.purchases.length,
    activeClaims: state.claims.length,
    loggedIssues: state.appIssues.length
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2d2d2d]/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-[#fdfbf7] dark:bg-[#1f2028] border-[4px] border-[#2d2d2d] dark:border-white/30 wobbly-card sketch-shadow-lg p-6 text-[#2d2d2d] dark:text-[#f3f4f6] space-y-6">
        
        <div className="tape-strip" />

        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#2d2d2d] dark:border-white/20 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#fff9c4] dark:bg-[#2d5da1] border-2 border-[#2d2d2d] dark:border-white/30 rounded">
              <User className="w-6 h-6 text-[#2d2d2d] dark:text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="font-heading text-3xl font-bold leading-none">
                USER PROFILE
              </h2>
              <span className="font-mono text-xs text-[#2d2d2d]/60 dark:text-white/60 font-bold">
                LifeReceipt Personal Account
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 bg-white dark:bg-[#282a36] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Info Cards */}
        <div className="space-y-3 font-mono">
          
          <div className="p-3 bg-white dark:bg-[#282a36] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-sm sketch-shadow-sm flex items-center justify-between">
            <span className="text-xs font-bold text-[#2d2d2d]/60 dark:text-white/60">NAME</span>
            <span className="font-heading text-2xl font-bold">{profile.name}</span>
          </div>

          <div className="p-3 bg-white dark:bg-[#282a36] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-sm sketch-shadow-sm flex items-center justify-between">
            <span className="text-xs font-bold text-[#2d2d2d]/60 dark:text-white/60">EMAIL</span>
            <span className="text-sm font-bold text-[#2d5da1] dark:text-[#ff4d4d]">{profile.email}</span>
          </div>

          <div className="p-3 bg-[#fff9c4] dark:bg-[#2d5da1]/30 border-2 border-[#2d2d2d] dark:border-white/30 wobbly-sm sketch-shadow-sm flex items-center justify-between">
            <span className="text-xs font-bold text-[#2d2d2d]">MEMBERSHIP PLAN</span>
            <span className="font-heading text-xl font-bold text-[#2d2d2d] dark:text-white flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#10b981]" /> {profile.plan}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-white dark:bg-[#282a36] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-sm sketch-shadow-sm text-center">
              <span className="text-[10px] font-bold text-[#2d2d2d]/60 dark:text-white/60 block">ACCOUNT ID</span>
              <span className="text-xs font-bold">{profile.accountId}</span>
            </div>

            <div className="p-3 bg-white dark:bg-[#282a36] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-sm sketch-shadow-sm text-center">
              <span className="text-[10px] font-bold text-[#2d2d2d]/60 dark:text-white/60 block">TRACKED ASSETS</span>
              <span className="text-xs font-bold text-[#10b981]">{metrics.totalAssets} Living Assets</span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-3 border-t-2 border-dashed border-[#2d2d2d]/30 dark:border-white/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#2d5da1] text-white border-2 border-[#2d2d2d] wobbly-btn font-body text-xl font-bold sketch-shadow-hover"
          >
            Close Profile
          </button>
        </div>

      </div>
    </div>
  );
}
