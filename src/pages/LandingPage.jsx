import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Sparkles, Play, Receipt, Lock, CheckCircle2, Search, Activity } from 'lucide-react';
import { PurchaseUniverseCanvas } from '../components/PurchaseUniverseCanvas';
import { webMcpAgent } from '../services/webMcpAgent';

export function LandingPage({ navigateTo, onSelectPurchase }) {
  const [isAskingVault, setIsAskingVault] = useState(false);

  const scrollToUniverse = () => {
    const el = document.getElementById('universe-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAskVault = async () => {
    setIsAskingVault(true);
    // Trigger scanning purchase memory tool & navigate to vault with expiring filter
    await webMcpAgent.executeTool('find_expiring_warranties');
    setIsAskingVault(false);
    navigateTo('/vault');
  };

  return (
    <div className="min-h-screen py-8 px-4 md:px-8 space-y-16 max-w-6xl mx-auto">
      
      {/* HERO SECTION */}
      <section className="relative pt-6 pb-12 text-center space-y-6">
        
        {/* Category Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1 bg-[#fff9c4] border-2 border-[#2d2d2d] wobbly-badge sketch-shadow-sm font-mono text-sm font-bold text-[#2d2d2d] rotate-[-1.5deg]">
          <Sparkles className="w-4 h-4 text-[#ff4d4d]" />
          <span>PERSONAL PURCHASE INTELLIGENCE VAULT</span>
        </div>

        {/* Hero Title */}
        <h1 className="font-heading text-5xl md:text-7xl font-bold text-[#2d2d2d] tracking-tight max-w-4xl mx-auto leading-none">
          Your purchases, <span className="hand-drawn-underline text-[#ff4d4d]">remembered.</span>
        </h1>

        {/* Subtitle */}
        <p className="font-body text-2xl md:text-3xl text-[#2d2d2d]/85 max-w-3xl mx-auto leading-relaxed">
          LifeReceipt turns every receipt into a living asset — tracking value, warranties, deadlines and what you can do next.
        </p>

        {/* INTERACTIVE PROMPT (SECTION 3: ASK YOUR VAULT) */}
        <div className="max-w-xl mx-auto p-4 bg-white border-[3px] border-[#2d2d2d] wobbly-card sketch-shadow space-y-3">
          <div className="flex items-center justify-between font-mono text-xs font-bold text-[#2d2d2d]/70">
            <span className="flex items-center gap-1.5 text-[#2d5da1]">
              <Activity className="w-4 h-4" /> ASK YOUR VAULT INTELLIGENCE
            </span>
            <span>WEBMCP PROMPT</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full text-left bg-[#fdfbf7] border-2 border-[#2d2d2d] wobbly-input px-3 py-2 font-body text-xl font-bold text-[#2d2d2d]">
              "What needs my attention?"
            </div>

            <button
              onClick={handleAskVault}
              disabled={isAskingVault}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#ff4d4d] text-white border-2 border-[#2d2d2d] wobbly-btn font-body text-xl font-bold sketch-shadow-hover flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 fill-white" />
              <span>{isAskingVault ? 'SCANNING...' : 'ASK YOUR VAULT'}</span>
            </button>
          </div>

          <div className="text-xs font-mono text-[#2d2d2d]/60 text-left pt-1 flex items-center justify-between">
            <span>Runs find_expiring_warranties() WebMCP tool</span>
            <span className="text-[#ff4d4d] font-bold">● 3 ASSETS NEED ATTENTION</span>
          </div>
        </div>

        {/* Secondary CTAs */}
        <div className="relative pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <button
            onClick={() => navigateTo('/vault')}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#2d5da1] text-white border-[3px] border-[#2d2d2d] wobbly-btn font-body text-2xl font-bold sketch-shadow-hover flex items-center justify-center gap-3 transition-transform"
          >
            <span>ENTER YOUR VAULT</span>
            <ArrowRight className="w-6 h-6" strokeWidth={2.5} />
          </button>

          <button
            onClick={scrollToUniverse}
            className="w-full sm:w-auto px-6 py-3.5 bg-white text-[#2d2d2d] border-[3px] border-[#2d2d2d] wobbly-btn font-body text-xl font-bold sketch-shadow-hover flex items-center justify-center gap-2"
          >
            <span>EXPLORE UNIVERSE</span>
          </button>
        </div>
      </section>

      {/* THE PURCHASE UNIVERSE DISPLAY */}
      <section id="universe-section" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs bg-[#2d5da1] text-white px-2 py-0.5 wobbly-badge font-bold">
                SPATIAL VAULT
              </span>
              <h2 className="font-heading text-3xl text-[#2d2d2d]">
                The Purchase Universe
              </h2>
            </div>
            <p className="font-body text-xl text-[#2d2d2d]/70">
              Every purchase exists as a living node in your spatial vault.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 font-mono text-xs font-bold">
            <span className="px-2 py-1 bg-[#e8f5e9] text-[#047857] border border-[#10b981] rounded">🟢 Protected</span>
            <span className="px-2 py-1 bg-[#fff9c4] text-[#b45309] border border-[#f59e0b] rounded">🟡 Expiring</span>
            <span className="px-2 py-1 bg-[#ffebee] text-[#b91c1c] border border-[#ff4d4d] rounded">🔴 At Risk</span>
          </div>
        </div>

        <PurchaseUniverseCanvas onSelectPurchase={onSelectPurchase} />
      </section>

      {/* PHILOSOPHY & COMPARISON SECTION */}
      <section className="grid md:grid-cols-2 gap-8 pt-4">
        
        {/* Normal Receipt App */}
        <div className="p-6 bg-white border-2 border-dashed border-[#2d2d2d]/50 wobbly-card opacity-75">
          <span className="font-mono text-xs text-[#2d2d2d]/60 uppercase font-bold">
            ORDINARY RECEIPT APP
          </span>
          <h3 className="font-heading text-2xl text-[#2d2d2d]/80 mt-1">
            Boring PDF Archive
          </h3>
          <ul className="mt-4 space-y-2 font-body text-xl text-[#2d2d2d]/70 list-disc list-inside">
            <li>Stores static PDFs you forget exist</li>
            <li>Zero awareness of warranty expiration</li>
            <li>No action when hardware breaks</li>
            <li>Requires manual form filing</li>
          </ul>
        </div>

        {/* LifeReceipt */}
        <div className="p-6 bg-[#fff9c4] border-[3px] border-[#2d2d2d] wobbly-card sketch-shadow relative rotate-[0.5deg]">
          <div className="tape-strip" />
          <span className="font-mono text-xs bg-[#ff4d4d] text-white px-2 py-0.5 wobbly-badge font-bold">
            THE LIFERECEIPT DIFFERENCE
          </span>
          <h3 className="font-heading text-3xl text-[#2d2d2d] mt-1">
            Living Purchase Intelligence
          </h3>
          <ul className="mt-4 space-y-2 font-body text-xl text-[#2d2d2d] font-bold">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#10b981]" strokeWidth={2.5} />
              <span>Understands what you own & tracks deadlines</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#10b981]" strokeWidth={2.5} />
              <span>Discovers claim opportunities automatically</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#10b981]" strokeWidth={2.5} />
              <span>WebMCP agent prepares claims end-to-end</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#10b981]" strokeWidth={2.5} />
              <span>Always asks your permission before submitting</span>
            </li>
          </ul>

          <div className="mt-6 pt-4 border-t-2 border-dashed border-[#2d2d2d] flex items-center justify-between">
            <span className="font-heading text-xl text-[#2d5da1]">Ready to experience it?</span>
            <button
              onClick={() => navigateTo('/vault')}
              className="px-4 py-1.5 bg-[#2d5da1] text-white border-2 border-[#2d2d2d] wobbly-btn font-body text-lg font-bold"
            >
              Enter Vault
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
