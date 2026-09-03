import React, { useState, useEffect } from 'react';
import { Radar, Clock, ListFilter, ArrowRight, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { webMcpAgent } from '../services/webMcpAgent';

export function WarrantyRadar({ onSelectPurchase }) {
  const [agentState, setAgentState] = useState(webMcpAgent.getState());
  const [viewMode, setViewMode] = useState('RADAR'); // 'RADAR', 'TIMELINE', 'LIST'

  useEffect(() => {
    return webMcpAgent.subscribe((state) => setAgentState(state));
  }, []);

  const sortedByDays = [...agentState.purchases].sort((a, b) => a.daysRemaining - b.daysRemaining);

  return (
    <div className="py-6 px-4 md:px-8 space-y-8 max-w-6xl mx-auto">
      
      {/* Header & Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-[#2d2d2d]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs bg-[#ff4d4d] text-white px-2 py-0.5 wobbly-badge font-bold">
              CONCENTRIC EXPIRATION RINGS
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#2d2d2d]">
              Warranty Intelligence Radar
            </h1>
          </div>
          <p className="font-body text-xl text-[#2d2d2d]/70 mt-1">
            As warranties approach expiration, assets orbit inward toward the core.
          </p>
        </div>

        {/* 3 View Mode Toggle Buttons */}
        <div className="flex items-center gap-1 bg-white p-1.5 border-2 border-[#2d2d2d] wobbly-md sketch-shadow-sm self-start sm:self-auto">
          <button
            onClick={() => setViewMode('RADAR')}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-body text-lg font-bold rounded transition-all ${
              viewMode === 'RADAR' ? 'bg-[#fff9c4] border-2 border-[#2d2d2d]' : 'text-[#2d2d2d]/70'
            }`}
          >
            <Radar className="w-4 h-4 text-[#2d5da1]" />
            <span>RADAR</span>
          </button>

          <button
            onClick={() => setViewMode('TIMELINE')}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-body text-lg font-bold rounded transition-all ${
              viewMode === 'TIMELINE' ? 'bg-[#fff9c4] border-2 border-[#2d2d2d]' : 'text-[#2d2d2d]/70'
            }`}
          >
            <Clock className="w-4 h-4 text-[#ff4d4d]" />
            <span>TIMELINE</span>
          </button>

          <button
            onClick={() => setViewMode('LIST')}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-body text-lg font-bold rounded transition-all ${
              viewMode === 'LIST' ? 'bg-[#fff9c4] border-2 border-[#2d2d2d]' : 'text-[#2d2d2d]/70'
            }`}
          >
            <ListFilter className="w-4 h-4 text-[#10b981]" />
            <span>LIST</span>
          </button>
        </div>
      </div>

      {/* MODE 1: DYNAMIC CONCENTRIC RADAR RINGS */}
      {viewMode === 'RADAR' && (
        <div className="relative w-full h-[540px] md:h-[600px] bg-[#fdfbf7] border-[4px] border-[#2d2d2d] wobbly-lg sketch-shadow-lg flex items-center justify-center overflow-hidden p-4">
          
          {/* Ring Labels */}
          <span className="absolute top-6 font-mono text-[11px] font-bold text-[#ff4d4d] bg-[#ffebee] border px-2 py-0.5 rounded">
            INNER RING: URGENT (≤ 30 DAYS)
          </span>

          <span className="absolute top-16 font-mono text-[10px] font-bold text-[#b45309] bg-[#fff9c4] border px-2 py-0.5 rounded">
            MIDDLE RING: EXPIRING SOON
          </span>

          <span className="absolute top-24 font-mono text-[10px] font-bold text-[#047857] bg-[#e8f5e9] border px-2 py-0.5 rounded">
            OUTER RING: PROTECTED (&gt; 180 DAYS)
          </span>

          {/* Concentric Dynamic Rings */}
          <div className="absolute w-[460px] h-[460px] border-2 border-dashed border-[#10b981]/40 rounded-full animate-spin-slow opacity-60" />
          <div className="absolute w-[300px] h-[300px] border-2 border-dashed border-[#f59e0b]/50 rounded-full" />
          <div className="absolute w-[160px] h-[160px] border-2 border-dashed border-[#ff4d4d]/60 rounded-full" />

          {/* Center User Vault Icon */}
          <div className="z-10 text-center p-4 bg-[#fff9c4] border-[3px] border-[#2d2d2d] wobbly-circle sketch-shadow">
            <span className="font-heading text-xl font-bold text-[#2d2d2d] block leading-none">YOUR VAULT</span>
            <span className="font-mono text-[10px] text-[#2d2d2d]/70 font-bold">CORE</span>
          </div>

          {/* Products Positioned Inward Radially Based on Expiration Urgency */}
          {sortedByDays.map((item, index) => {
            // Urgency distance mapping: closer = urgent
            let radiusPx = 220; // default outer
            if (item.daysRemaining <= 30) {
              radiusPx = 95; // Inner urgent ring!
            } else if (item.daysRemaining <= 180) {
              radiusPx = 155; // Middle ring
            }

            const angleRad = (index / sortedByDays.length) * 2 * Math.PI - Math.PI / 2;
            const offsetX = Math.cos(angleRad) * radiusPx;
            const offsetY = Math.sin(angleRad) * radiusPx;

            const isUrgent = item.daysRemaining <= 30;

            return (
              <div
                key={item.id}
                onClick={() => onSelectPurchase(item)}
                className="absolute z-20 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-115 transition-all duration-300"
                style={{
                  transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`,
                }}
              >
                <div className={`p-3 border-[3px] border-[#2d2d2d] wobbly-card sketch-shadow text-center flex flex-col items-center ${
                  isUrgent ? 'bg-[#ffebee] border-[#ff4d4d]' : 'bg-white'
                }`}>
                  <span className="text-3xl">{item.icon}</span>
                  <span className="font-heading text-base text-[#2d2d2d] font-bold block max-w-[110px] truncate mt-0.5">
                    {item.name}
                  </span>
                  <span className={`font-mono text-xs font-bold px-2 py-0.5 border border-[#2d2d2d] rounded mt-1 ${
                    isUrgent ? 'bg-[#ff4d4d] text-white' : 'bg-[#e5e0d8] text-[#2d2d2d]'
                  }`}>
                    {item.daysRemaining}d Left
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODE 2: VISUAL TIMELINE */}
      {viewMode === 'TIMELINE' && (
        <div className="p-6 bg-white border-[3px] border-[#2d2d2d] wobbly-card sketch-shadow space-y-6">
          <h2 className="font-heading text-2xl text-[#2d2d2d]">Upcoming Expiration Timeline</h2>

          <div className="relative border-l-4 border-dashed border-[#2d2d2d] ml-4 pl-6 space-y-6">
            {sortedByDays.map((item) => {
              const isUrgent = item.daysRemaining <= 30;
              return (
                <div key={item.id} className="relative group">
                  <div className={`absolute -left-[35px] top-1 w-6 h-6 rounded-full border-2 border-[#2d2d2d] flex items-center justify-center ${
                    isUrgent ? 'bg-[#ff4d4d] text-white' : 'bg-[#10b981] text-white'
                  }`}>
                    <span className="text-[10px] font-bold font-mono">•</span>
                  </div>

                  <div
                    onClick={() => onSelectPurchase(item)}
                    className="p-4 bg-[#fdfbf7] hover:bg-[#fff9c4] border-2 border-[#2d2d2d] wobbly-card cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{item.icon}</span>
                      <div>
                        <h3 className="font-heading text-2xl text-[#2d2d2d]">{item.name}</h3>
                        <span className="font-mono text-xs text-[#2d2d2d]/70">Expires: {item.warrantyExpires} ({item.store})</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`font-mono text-lg font-bold px-3 py-1 border-2 border-[#2d2d2d] wobbly-badge ${
                        isUrgent ? 'bg-[#ff4d4d] text-white' : 'bg-[#e8f5e9] text-[#047857]'
                      }`}>
                        {item.daysRemaining} DAYS
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 3: ACTION LIST */}
      {viewMode === 'LIST' && (
        <div className="space-y-4">
          {sortedByDays.map((item) => {
            const isUrgent = item.daysRemaining <= 30;

            return (
              <div
                key={item.id}
                onClick={() => onSelectPurchase(item)}
                className={`p-4 border-[3px] border-[#2d2d2d] wobbly-card sketch-shadow-hover cursor-pointer transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isUrgent ? 'bg-[#ffebee]' : 'bg-white'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 border-2 border-[#2d2d2d] wobbly-badge font-mono text-center min-w-[90px] ${
                    isUrgent ? 'bg-[#ff4d4d] text-white' : 'bg-[#e8f5e9] text-[#047857]'
                  }`}>
                    <span className="text-xl font-bold block leading-none">{item.daysRemaining}</span>
                    <span className="text-[10px] font-bold">DAYS LEFT</span>
                  </div>

                  <div>
                    <h3 className="font-heading text-2xl text-[#2d2d2d]">{item.name}</h3>
                    <div className="flex items-center gap-3 font-mono text-xs text-[#2d2d2d]/80 mt-0.5">
                      <span>Brand: {item.brand}</span>
                      <span>•</span>
                      <span>Value: ₹{item.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    webMcpAgent.executeTool('prepare_claim', { purchaseId: item.id });
                  }}
                  className="px-4 py-2 bg-white hover:bg-[#ff4d4d] hover:text-white border-2 border-[#2d2d2d] wobbly-btn font-body text-lg font-bold transition-colors flex items-center justify-center gap-2 self-end md:self-auto"
                >
                  <span>INSPECT CLAIM</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
