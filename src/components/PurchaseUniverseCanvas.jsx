import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Sparkles, ArrowUpRight, Radio, Search, AlertCircle, Receipt, ArrowRight, CheckCircle2 } from 'lucide-react';
import { webMcpAgent } from '../services/webMcpAgent';

export function PurchaseUniverseCanvas({ onSelectPurchase, className = "" }) {
  const [agentState, setAgentState] = useState(webMcpAgent.getState());
  const [hoveredNode, setHoveredNode] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    return webMcpAgent.subscribe((state) => setAgentState(state));
  }, []);

  const purchases = agentState.purchases;
  const universeFilter = agentState.universeFilter;
  const isScanActive = agentState.universeScanActive;
  const pulsingId = agentState.pulsingPurchaseId;
  const focusedId = agentState.focusedPurchaseId;
  const isHumanApproval = !!agentState.approvalModalClaim;
  const outwardSignal = agentState.outwardSignalActive;
  const activeTool = agentState.activeToolExecuting;

  const handleMouseMove = (e) => {
    if (isHumanApproval || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const offsetX = (e.clientX - rect.left - centerX) / centerX;
    const offsetY = (e.clientY - rect.top - centerY) / centerY;
    setMousePos({ x: offsetX * 20, y: offsetY * 20 });
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'PROTECTED':
        return {
          bg: '#e8f5e9',
          border: '#10b981',
          text: '#047857',
          badgeBg: '#10b981',
          glow: 'rgba(16, 185, 129, 0.4)',
          label: 'PROTECTED'
        };
      case 'EXPIRING':
        return {
          bg: '#fff9c4',
          border: '#f59e0b',
          text: '#b45309',
          badgeBg: '#f59e0b',
          glow: 'rgba(245, 158, 11, 0.6)',
          label: 'EXPIRING'
        };
      case 'AT_RISK':
      default:
        return {
          bg: '#ffebee',
          border: '#ff4d4d',
          text: '#b91c1c',
          badgeBg: '#ff4d4d',
          glow: 'rgba(255, 77, 77, 0.7)',
          label: 'AT RISK'
        };
    }
  };

  const isHighlighted = (item) => {
    if (!universeFilter) return true;
    const f = universeFilter.toLowerCase();
    if (f === 'expiring') return item.status === 'EXPIRING' || item.status === 'AT_RISK';
    if (f === 'protected') return item.status === 'PROTECTED';
    return (
      item.name.toLowerCase().includes(f) ||
      item.brand.toLowerCase().includes(f) ||
      item.category.toLowerCase().includes(f)
    );
  };

  // Section 1 Tool Execution Status Text
  const getToolStatusOverlayText = () => {
    if (isHumanApproval) return "HUMAN DECISION MODE • EXECUTION PAUSED";
    if (outwardSignal) return "SUBMITTING CLAIM • OUTWARD SIGNAL TRANSMITTED";
    if (activeTool) {
      if (activeTool.tool === 'search_purchases') return "SCANNING PURCHASE MEMORY • 7 PURCHASES FOUND";
      if (activeTool.tool === 'find_expiring_warranties') return "FOCUSING EXPIRING ASSETS • 3 ASSETS NEED ATTENTION";
      if (activeTool.tool === 'check_warranty') return "VERIFYING WARRANTY • 19 DAYS REMAINING";
      if (activeTool.tool === 'get_receipt') return "VERIFYING RECEIPT • 100% TAX MATCH";
      if (activeTool.tool === 'prepare_claim') return "PREPARING CLAIM • CLAIM PACKAGE READY";
    }
    if (universeFilter === 'EXPIRING') return "3 ASSETS NEED ATTENTION";
    return "7 LIVING ASSETS";
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative w-full h-[580px] md:h-[650px] bg-[#fdfbf7] border-[4px] border-[#2d2d2d] wobbly-lg sketch-shadow-lg overflow-hidden select-none transition-all duration-300 ${
        isHumanApproval ? 'filter brightness-75 backdrop-blur-sm' : ''
      } ${className}`}
      style={{
        backgroundImage: 'radial-gradient(#e5e0d8 1.5px, transparent 1.5px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* SCANNING LASER BEAM ANIMATION */}
      {isScanActive && !isHumanApproval && (
        <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
          <div className="w-full h-2.5 bg-gradient-to-r from-transparent via-[#ff4d4d] to-transparent opacity-85 animate-scan-beam shadow-[0_0_20px_#ff4d4d]" />
        </div>
      )}

      {/* OUTWARD SIGNAL WAVE ON CLAIM SUBMISSION (Section 2) */}
      {outwardSignal && (
        <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
          <div className="w-48 h-48 rounded-full border-4 border-[#ff4d4d] animate-ping opacity-80" />
          <div className="w-[600px] h-[600px] rounded-full border-2 border-[#2d5da1] animate-ping opacity-50" />
        </div>
      )}

      {/* CENTRAL LIVING VAULT CORE */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center z-10">
        <div className="relative flex items-center justify-center">
          <div className={`w-40 h-40 md:w-56 md:h-56 border-[3px] border-dashed border-[#2d2d2d]/30 rounded-full flex items-center justify-center ${
            isHumanApproval ? '' : 'animate-spin-slow'
          }`}>
            <div className="w-28 h-28 md:w-36 md:h-36 border-2 border-[#2d5da1]/40 rounded-full bg-[#fff9c4]/40 backdrop-blur-xs flex flex-col items-center justify-center p-2 text-center sketch-shadow-sm">
              <div className={`w-3 h-3 ${isHumanApproval ? 'bg-[#ff4d4d]' : 'bg-[#10b981] animate-ping'} rounded-full mb-1`} />
              <span className="font-heading text-[#2d5da1] text-lg md:text-xl font-bold leading-tight">
                YOUR VAULT
              </span>
              <span className="font-mono text-[10px] font-bold text-[#2d2d2d]/70">
                {isHumanApproval ? '🔐 PAUSED' : '● VAULT ACTIVE'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CONNECTING HAND-DRAWN SKETCH LINES */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <filter id="handDrawnLine">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
          </filter>
        </defs>

        {purchases.map((item, index) => {
          const highlighted = isHighlighted(item);
          const styles = getStatusStyles(item.status);
          const isExpiringFilter = (universeFilter === 'EXPIRING' || activeTool?.tool === 'find_expiring_warranties') && item.status === 'EXPIRING';

          let targetX = item.x;
          let targetY = item.y;
          if (isExpiringFilter) {
            // Expiring items move smoothly inward toward Vault Core!
            targetX = 425 + (item.x - 425) * 0.45;
            targetY = 325 + (item.y - 325) * 0.45;
          }

          const px = targetX + (isHumanApproval ? 0 : mousePos.x * (0.15 + (index % 3) * 0.08));
          const py = targetY + (isHumanApproval ? 0 : mousePos.y * (0.15 + (index % 3) * 0.08));

          return (
            <line
              key={`line-${item.id}`}
              x1="50%"
              y1="50%"
              x2={`${(px / 850) * 100}%`}
              y2={`${(py / 650) * 100}%`}
              stroke={highlighted ? styles.border : '#e5e0d8'}
              strokeWidth={highlighted ? "2.5" : "1"}
              strokeDasharray="6 4"
              opacity={highlighted ? "0.8" : "0.2"}
              filter="url(#handDrawnLine)"
            />
          );
        })}
      </svg>

      {/* FLOATING LIVING PRODUCT NODES */}
      {purchases.map((item, index) => {
        const highlighted = isHighlighted(item);
        const styles = getStatusStyles(item.status);
        const isHovered = hoveredNode === item.id;
        const isPulsing = pulsingId === item.id;
        const isFocused = focusedId === item.id;
        const isExpiringFilter = (universeFilter === 'EXPIRING' || activeTool?.tool === 'find_expiring_warranties') && item.status === 'EXPIRING';

        let posX = (item.x / 850) * 82 + 9;
        let posY = (item.y / 600) * 78 + 11;

        if (isExpiringFilter) {
          // Smooth inward contraction
          posX = 50 + (posX - 50) * 0.5;
          posY = 50 + (posY - 50) * 0.5;
        }

        return (
          <div
            key={item.id}
            onClick={() => onSelectPurchase && onSelectPurchase(item)}
            onMouseEnter={() => setHoveredNode(item.id)}
            onMouseLeave={() => setHoveredNode(null)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-500 ${
              highlighted ? 'opacity-100 scale-100 z-20' : 'opacity-30 scale-85 z-10'
            }`}
            style={{
              left: `${posX}%`,
              top: `${posY}%`,
              transform: `translate(calc(-50% + ${isHumanApproval ? 0 : mousePos.x * (0.2 + index * 0.04)}px), calc(-50% + ${isHumanApproval ? 0 : mousePos.y * (0.2 + index * 0.04)}px)) ${
                isHovered || isFocused ? 'scale(1.15) rotate(-2deg)' : 'scale(1) rotate(0deg)'
              }`,
            }}
          >
            {/* Pulsing Warranty Rings on active tool check */}
            {isPulsing && (
              <div className="absolute inset-0 rounded-full border-4 border-[#ff4d4d] animate-ping opacity-80" />
            )}

            {/* Hand-Drawn Living Node Card */}
            <div
              className={`p-3 md:p-4 border-[3px] border-[#2d2d2d] wobbly-card transition-all ${
                isHovered || isFocused ? 'sketch-shadow-lg' : 'sketch-shadow'
              }`}
              style={{
                backgroundColor: styles.bg,
                borderColor: styles.border,
                boxShadow: (isHovered || isFocused || isPulsing)
                  ? `6px 6px 0px 0px #2d2d2d, 0 0 22px ${styles.glow}`
                  : '4px 4px 0px 0px #2d2d2d',
              }}
            >
              {/* Top Status Pin Badge */}
              <div
                className="absolute -top-3 left-3 px-2 py-0.5 border-2 border-[#2d2d2d] wobbly-badge font-mono text-[11px] font-bold text-white flex items-center gap-1 shadow-sm"
                style={{ backgroundColor: styles.badgeBg }}
              >
                <span>{item.status === 'PROTECTED' ? '🟢' : item.status === 'EXPIRING' ? '🟡' : '🔴'}</span>
                <span>{item.daysRemaining}d Left</span>
              </div>

              {/* Product Visual Content */}
              <div className="flex items-center gap-3 mt-1">
                <div className="text-2xl md:text-3xl p-1.5 bg-white border-2 border-[#2d2d2d] wobbly-circle flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-heading text-lg md:text-xl text-[#2d2d2d] font-bold leading-none">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-xs text-[#2d2d2d]/80 font-bold">
                      ₹{item.price.toLocaleString()}
                    </span>
                    <span className="text-[10px] bg-white border border-[#2d2d2d] px-1.5 py-0.2 rounded font-body">
                      {item.brand}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hover Revelations & Action Buttons */}
              {isHovered && !isHumanApproval && (
                <div className="mt-3 pt-2 border-t-2 border-dashed border-[#2d2d2d]/40 flex items-center justify-between gap-2 font-mono text-xs animate-in fade-in duration-150">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      webMcpAgent.executeTool('get_receipt', { purchaseId: item.id });
                    }}
                    className="px-2 py-1 bg-white hover:bg-[#2d5da1] hover:text-white border border-[#2d2d2d] rounded font-bold transition-colors flex items-center gap-1"
                  >
                    <Receipt className="w-3 h-3" /> Receipt
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      webMcpAgent.executeTool('prepare_claim', { purchaseId: item.id });
                    }}
                    className="px-2 py-1 bg-[#ff4d4d] text-white border border-[#2d2d2d] rounded font-bold transition-colors flex items-center gap-1"
                  >
                    Claim <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* TOP AGENT TOOL EXECUTION STATUS OVERLAY (Section 1 & 5) */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-30">
        <div className={`border-2 border-[#2d2d2d] wobbly-sm px-3.5 py-1.5 sketch-shadow-sm font-mono text-xs font-bold flex items-center gap-2 pointer-events-auto transition-all ${
          isHumanApproval ? 'bg-[#ff4d4d] text-white' : 'bg-[#fff9c4] text-[#2d2d2d]'
        }`}>
          <div className={`w-2.5 h-2.5 ${isHumanApproval ? 'bg-white' : 'bg-[#10b981]'} rounded-full animate-ping`} />
          <span>{getToolStatusOverlayText()}</span>
        </div>

        {universeFilter && !isHumanApproval && (
          <button
            onClick={() => webMcpAgent.setUniverseFilter(null)}
            className="bg-white border-2 border-[#2d2d2d] px-3 py-1 wobbly-badge font-mono text-xs font-bold text-[#ff4d4d] pointer-events-auto hover:bg-[#ffebee]"
          >
            Clear Filter ("{universeFilter}") ✕
          </button>
        )}
      </div>

    </div>
  );
}
