import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Activity,
  ShieldCheck,
  AlertTriangle,
  Receipt,
  FileText,
  Plus,
  Trash2
} from 'lucide-react';
import { PurchaseUniverseCanvas } from '../components/PurchaseUniverseCanvas';
import { webMcpAgent } from '../services/webMcpAgent';
import { calculateVaultMetrics } from '../data/mockData';

export function VaultOverview({ navigateTo, onSelectPurchase, onOpenAddToVault, onOpenRemoveFromVault }) {
  const [agentState, setAgentState] = useState(webMcpAgent.getState());

  useEffect(() => {
    return webMcpAgent.subscribe((state) => setAgentState(state));
  }, []);

  const metrics = calculateVaultMetrics(agentState.purchases, agentState.claims);

  const handleFocusProduct = (purchaseId) => {
    const p = agentState.purchases.find((x) => x.id === purchaseId);
    if (p) {
      onSelectPurchase(p);
      webMcpAgent.setUniverseFilter(p.name);
    }
  };

  return (
    <div className="py-6 px-4 md:px-8 space-y-8 max-w-6xl mx-auto">
      
      {/* SYSTEM TELEMETRY HERO HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b-2 border-[#2d2d2d]/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs bg-[#ff4d4d] text-white px-2.5 py-0.5 wobbly-badge font-bold animate-pulse flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" /> LIFE RECEIPT AGENT • VAULT ACTIVE
            </span>
            <span className="font-mono text-xs text-[#2d2d2d]/70 dark:text-white/70 font-bold hidden sm:inline">
              • Monitoring {metrics.totalAssetsCount} living assets • Nothing slips through the cracks.
            </span>
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-[#2d2d2d] dark:text-white mt-1 tracking-tight">
            YOUR VAULT IS WATCHING
          </h1>
          <p className="font-body text-2xl text-[#ff4d4d] font-bold">
            ⚡ {metrics.expiringCount} things need your attention right now.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {/* PRIMARY ENTRY POINT: + ADD TO VAULT */}
          <button
            onClick={onOpenAddToVault}
            className="px-5 py-3 bg-[#fff9c4] dark:bg-[#2d5da1] text-[#2d2d2d] dark:text-white border-[3px] border-[#2d2d2d] dark:border-white/30 wobbly-btn font-body text-2xl font-bold sketch-shadow-hover flex items-center gap-2 transition-transform"
          >
            <Plus className="w-5 h-5 text-[#ff4d4d] dark:text-white" strokeWidth={2.5} />
            <span>+ ADD TO VAULT</span>
          </button>

          {/* SECONDARY ENTRY POINT: - REMOVE DEVICE */}
          <button
            onClick={onOpenRemoveFromVault}
            className="px-4 py-3 bg-[#ffebee] dark:bg-[#ff4d4d]/20 text-[#ff4d4d] dark:text-red-300 border-[3px] border-[#2d2d2d] dark:border-white/30 wobbly-btn font-body text-2xl font-bold sketch-shadow-hover flex items-center gap-2 transition-transform"
          >
            <Trash2 className="w-5 h-5 text-[#ff4d4d]" strokeWidth={2.5} />
            <span>- REMOVE DEVICE</span>
          </button>
        </div>
      </div>

      {/* PRIORITY 1: THE PURCHASE UNIVERSE HERO (50-60% VIEWPORT DOMINANCE) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs bg-[#2d5da1] text-white px-2.5 py-0.5 wobbly-badge font-bold">
              SPATIAL CONSTELLATION
            </span>
            <h2 className="font-heading text-3xl text-[#2d2d2d] dark:text-white font-bold">
              The Purchase Universe
            </h2>
          </div>

          <span className="font-mono text-xs text-[#2d2d2d]/70 dark:text-white/70 font-bold hidden sm:inline">
            Living objects in space • Click to open Purchase Memory
          </span>
        </div>

        {/* Hero Purchase Universe Canvas Container */}
        <PurchaseUniverseCanvas 
          onSelectPurchase={onSelectPurchase} 
          className="min-h-[560px] md:min-h-[640px]"
        />
      </section>

      {/* SYSTEM TELEMETRY STRIP (CENTRALLY DERIVED FROM DATASET) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
        <div className="p-3 bg-white dark:bg-[#282a36] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-sm sketch-shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#2d2d2d]/60 dark:text-white/60 font-bold block">PROTECTED VALUE</span>
            <span className="font-heading text-2xl text-[#10b981] font-bold">₹{metrics.protectedValue.toLocaleString()}</span>
          </div>
          <ShieldCheck className="w-6 h-6 text-[#10b981]" />
        </div>

        <div className="p-3 bg-[#fff9c4] dark:bg-[#282a36] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-sm sketch-shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#2d2d2d]/70 dark:text-white/70 block">ACTIVE WARRANTIES</span>
            <span className="font-heading text-2xl text-[#2d2d2d] dark:text-white font-bold">{metrics.activeWarrantiesCount} Total</span>
          </div>
          <span className="text-xl">📜</span>
        </div>

        <div className="p-3 bg-[#ffebee] dark:bg-[#ff4d4d]/20 border-2 border-[#2d2d2d] dark:border-white/30 wobbly-sm sketch-shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#ff4d4d] font-bold block">EXPIRING SOON</span>
            <span className="font-heading text-2xl text-[#ff4d4d] font-bold">{metrics.expiringCount} Products</span>
          </div>
          <AlertTriangle className="w-6 h-6 text-[#ff4d4d]" />
        </div>

        <div className="p-3 bg-[#e3f2fd] dark:bg-[#2d5da1]/30 border-2 border-[#2d5da1] dark:border-white/30 wobbly-sm sketch-shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#2d5da1] dark:text-[#ff4d4d] font-bold block">MONEY AT RISK</span>
            <span className="font-heading text-2xl text-[#2d5da1] dark:text-white font-bold">₹{metrics.moneyAtRisk.toLocaleString()}</span>
          </div>
          <Sparkles className="w-6 h-6 text-[#2d5da1] dark:text-[#ff4d4d]" />
        </div>
      </div>

      {/* ACTION CENTER */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs bg-[#2d2d2d] text-white px-2 py-0.5 wobbly-badge font-bold">
              INTELLIGENCE
            </span>
            <h2 className="font-heading text-3xl text-[#2d2d2d] dark:text-white">
              Action Center
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAddToVault}
              className="px-3.5 py-1.5 bg-[#fff9c4] dark:bg-[#282a36] text-[#2d2d2d] dark:text-white border-2 border-[#2d2d2d] dark:border-white/30 wobbly-btn font-body text-lg font-bold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-[#ff4d4d]" />
              <span>Add Asset</span>
            </button>

            <button
              onClick={onOpenRemoveFromVault}
              className="px-3 py-1.5 bg-[#ffebee] dark:bg-[#ff4d4d]/20 text-[#ff4d4d] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-btn font-body text-lg font-bold flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4 text-[#ff4d4d]" />
              <span>Remove</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          
          {/* Item 1 */}
          <div className="p-5 bg-[#fff9c4] dark:bg-[#282a36] border-[3px] border-[#2d2d2d] dark:border-white/30 wobbly-card sketch-shadow flex flex-col justify-between space-y-3 relative">
            <div className="tape-strip-left" />
            <div>
              <span className="font-mono text-xs bg-[#f59e0b] text-white px-2 py-0.5 rounded font-bold">
                WARRANTY EXPIRING
              </span>
              <h3 className="font-heading text-2xl text-[#2d2d2d] dark:text-white mt-2 font-bold">
                LG UltraGear Monitor
              </h3>
              <p className="font-mono text-base font-bold text-[#2d2d2d] dark:text-white">₹32,999</p>
              <p className="font-body text-lg text-[#ff4d4d] font-bold mt-1">
                Warranty expires in <strong>11 days</strong>
              </p>
            </div>

            <button
              onClick={() => handleFocusProduct('purch-1')}
              className="w-full py-2 bg-white dark:bg-[#1f2028] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-btn font-body text-lg font-bold text-[#2d2d2d] dark:text-white hover:bg-[#ff4d4d] hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <span>CHECK WARRANTY</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Item 2 */}
          <div className="p-5 bg-[#ffebee] dark:bg-[#282a36] border-[3px] border-[#2d2d2d] dark:border-white/30 wobbly-card sketch-shadow flex flex-col justify-between space-y-3 relative">
            <div>
              <span className="font-mono text-xs bg-[#ff4d4d] text-white px-2 py-0.5 rounded font-bold">
                CLAIM OPPORTUNITY
              </span>
              <h3 className="font-heading text-2xl text-[#2d2d2d] dark:text-white mt-2 font-bold">
                Sony WH-1000XM6
              </h3>
              <p className="font-mono text-base font-bold text-[#2d2d2d] dark:text-white">₹24,999</p>
              <p className="font-body text-lg text-[#2d2d2d] dark:text-white/80 font-bold mt-1">
                Left earcup audio issue detected.
              </p>
            </div>

            <button
              onClick={() => {
                webMcpAgent.executeTool('prepare_claim', {
                  purchaseId: 'purch-2',
                  issue: 'Left earcup stopped producing sound'
                });
              }}
              className="w-full py-2 bg-[#ff4d4d] text-white border-2 border-[#2d2d2d] dark:border-white/30 wobbly-btn font-body text-lg font-bold sketch-shadow-hover flex items-center justify-center gap-2"
            >
              <span>REVIEW CLAIM</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Item 3 */}
          <div className="p-5 bg-white dark:bg-[#282a36] border-[3px] border-[#2d2d2d] dark:border-white/30 wobbly-card sketch-shadow flex flex-col justify-between space-y-3 relative">
            <div>
              <span className="font-mono text-xs bg-[#2d5da1] text-white px-2 py-0.5 rounded font-bold">
                RETURN WINDOW
              </span>
              <h3 className="font-heading text-2xl text-[#2d2d2d] dark:text-white mt-2 font-bold">
                Mechanical Keyboard
              </h3>
              <p className="font-mono text-base font-bold text-[#2d2d2d] dark:text-white">₹8,499</p>
              <p className="font-body text-lg text-[#2d5da1] dark:text-[#ff4d4d] font-bold mt-1">
                Return window closes in <strong>2 days</strong>
              </p>
            </div>

            <button
              onClick={() => handleFocusProduct('purch-3')}
              className="w-full py-2 bg-white dark:bg-[#1f2028] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-btn font-body text-lg font-bold text-[#2d2d2d] dark:text-white hover:bg-[#2d5da1] hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <span>VIEW PURCHASE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* MONEY AT RISK SECTION */}
      <section className="p-6 bg-[#fff9c4] dark:bg-[#282a36] border-[4px] border-[#2d2d2d] dark:border-white/30 wobbly-card sketch-shadow space-y-4 relative">
        <div className="thumbtack-pin" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-[#2d2d2d] dark:border-white/20">
          <div>
            <span className="font-mono text-xs bg-[#ff4d4d] text-white px-2 py-0.5 wobbly-badge font-bold">
              FINANCIAL RISK ANALYSIS
            </span>
            <h2 className="font-heading text-4xl text-[#2d2d2d] dark:text-white mt-1 font-bold">
              MONEY AT RISK
            </h2>
          </div>

          <div className="text-right">
            <div className="font-heading text-5xl text-[#ff4d4d] font-bold leading-none">
              ₹{metrics.moneyAtRisk.toLocaleString()}
            </div>
            <p className="font-body text-xl text-[#2d2d2d]/80 dark:text-white/80 font-bold">
              purchase value exposed to expiring warranties ({metrics.expiringCount} items)
            </p>
          </div>
        </div>

        {/* Contributing Items */}
        <div className="space-y-3 pt-2">
          <span className="font-mono text-xs font-bold text-[#2d2d2d]/70 dark:text-white/70 block">
            CONTRIBUTING PURCHASES (CLICK ITEM TO FOCUS UNIVERSE)
          </span>

          <div className="grid md:grid-cols-3 gap-3">
            {agentState.purchases.filter(p => p.status === 'EXPIRING').map((item) => (
              <button
                key={item.id}
                onClick={() => handleFocusProduct(item.id)}
                className="p-3 bg-white dark:bg-[#1f2028] hover:bg-[#ffebee] dark:hover:bg-[#ff4d4d]/20 border-2 border-[#2d2d2d] dark:border-white/30 wobbly-sm text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="font-heading text-xl text-[#2d2d2d] dark:text-white font-bold group-hover:text-[#ff4d4d]">
                    {item.name}
                  </div>
                  <span className="font-mono text-xs text-[#2d2d2d]/70 dark:text-white/70">
                    Expires in {item.daysRemaining} days
                  </span>
                </div>
                <span className="font-mono text-base font-bold text-[#ff4d4d]">
                  ₹{item.price.toLocaleString()}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
