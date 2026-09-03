import React, { useState, useEffect } from 'react';
import { FileCheck2, Lock, Clock, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { webMcpAgent } from '../services/webMcpAgent';

export function ClaimsPage({ onSelectPurchase }) {
  const [agentState, setAgentState] = useState(webMcpAgent.getState());

  useEffect(() => {
    return webMcpAgent.subscribe((state) => setAgentState(state));
  }, []);

  const claims = agentState.claims;

  const awaitingApproval = claims.filter((c) => c.status === 'AWAITING_APPROVAL');
  const underReview = claims.filter((c) => c.status === 'UNDER_REVIEW' || c.status === 'SUBMITTED');
  const readyToClaim = claims.filter((c) => c.status === 'READY_TO_CLAIM');

  return (
    <div className="py-6 px-4 md:px-8 space-y-10 max-w-6xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-[#2d2d2d]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs bg-[#2d5da1] text-white px-2 py-0.5 wobbly-badge font-bold">
              AUTONOMOUS DISPATCH
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#2d2d2d]">
              Warranty Claims Management
            </h1>
          </div>
          <p className="font-body text-xl text-[#2d2d2d]/70 mt-1">
            Track prepared warranty claims, human approvals, and manufacturer status.
          </p>
        </div>

        <button
          onClick={() => {
            webMcpAgent.executeTool('prepare_claim', {
              purchaseId: 'purch-2',
              issue: 'Left earcup stopped producing sound'
            });
          }}
          className="px-5 py-2.5 bg-[#ff4d4d] text-white border-[3px] border-[#2d2d2d] wobbly-btn font-body text-xl font-bold sketch-shadow-hover flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          <span>Draft Claim for Sony Headphones</span>
        </button>
      </div>

      {/* SECTION 1: AWAITING HUMAN APPROVAL (CRITICAL HIGHLIGHT) */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs bg-[#ff4d4d] text-white px-2 py-0.5 wobbly-badge font-bold animate-pulse">
            ACTION REQUIRED
          </span>
          <h2 className="font-heading text-3xl text-[#2d2d2d]">
            Awaiting Human Authorization ({awaitingApproval.length})
          </h2>
        </div>

        {awaitingApproval.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {awaitingApproval.map((claim) => (
              <div
                key={claim.claimId}
                className="p-6 bg-[#fff9c4] border-[4px] border-[#2d2d2d] wobbly-card sketch-shadow-lg relative space-y-4"
              >
                <div className="tape-strip" />

                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs bg-[#ff4d4d] text-white px-2.5 py-0.5 wobbly-badge font-bold flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> HUMAN APPROVAL REQUIRED
                  </span>
                  <span className="font-mono text-xs font-bold text-[#2d2d2d]/70">
                    ID: #{claim.claimId}
                  </span>
                </div>

                <div>
                  <h3 className="font-heading text-3xl text-[#2d2d2d] font-bold">
                    {claim.productName}
                  </h3>
                  <p className="font-mono text-sm text-[#2d2d2d]/80 mt-0.5">
                    Brand: {claim.brand} • Claim Value: ₹{claim.price?.toLocaleString()}
                  </p>
                </div>

                <div className="p-3 bg-white border-2 border-[#2d2d2d] wobbly-sm font-heading text-xl text-[#2d2d2d]">
                  "{claim.issue}"
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex gap-2 font-mono text-xs">
                    <span className="bg-[#e8f5e9] text-[#047857] px-2 py-0.5 rounded font-bold">Receipt ✓</span>
                    <span className="bg-[#e3f2fd] text-[#2d5da1] px-2 py-0.5 rounded font-bold">Warranty Active</span>
                  </div>

                  <button
                    onClick={() => webMcpAgent.setApprovalModalClaim(claim)}
                    className="px-5 py-2 bg-[#ff4d4d] text-white border-2 border-[#2d2d2d] wobbly-btn font-body text-xl font-bold sketch-shadow-hover flex items-center gap-2"
                  >
                    <span>AUTHORIZE & SUBMIT</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-white border-2 border-dashed border-[#2d2d2d]/40 wobbly-card text-center font-body text-xl text-[#2d2d2d]/70">
            No claims pending human authorization right now.
          </div>
        )}
      </section>

      {/* SECTION 2: SUBMITTED & UNDER REVIEW */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs bg-[#10b981] text-white px-2 py-0.5 wobbly-badge font-bold">
            IN PROGRESS
          </span>
          <h2 className="font-heading text-3xl text-[#2d2d2d]">
            Submitted & Under Review ({underReview.length})
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {underReview.map((claim) => (
            <div
              key={claim.claimId}
              className="p-5 bg-white border-[3px] border-[#2d2d2d] wobbly-card sketch-shadow space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs bg-[#e8f5e9] text-[#047857] px-2.5 py-0.5 border border-[#10b981] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" /> UNDER REVIEW
                </span>
                <span className="font-mono text-xs text-[#2d2d2d]/70 font-bold">
                  Claim #{claim.claimId}
                </span>
              </div>

              <div>
                <h3 className="font-heading text-2xl text-[#2d2d2d]">{claim.productName}</h3>
                <p className="font-mono text-xs text-[#2d2d2d]/80 mt-0.5">
                  Ref Ticket: {claim.claimReference || 'SNY-WR-992014'}
                </p>
              </div>

              <div className="p-2.5 bg-[#fdfbf7] border border-[#2d2d2d] rounded font-mono text-xs text-[#2d2d2d]/80">
                Submitted to {claim.brand} Support API on {claim.createdAt}. Response expected within 48h.
              </div>
            </div>
          ))}

          {underReview.length === 0 && (
            <div className="col-span-full p-6 bg-white border-2 border-dashed border-[#2d2d2d]/40 wobbly-card text-center font-body text-xl text-[#2d2d2d]/70">
              No submitted claims currently in review.
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3: READY TO CLAIM (POTENTIAL CLAIMS) */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs bg-[#2d2d2d] text-white px-2 py-0.5 wobbly-badge font-bold">
            ELIGIBLE ASSETS
          </span>
          <h2 className="font-heading text-3xl text-[#2d2d2d]">
            Ready to Claim ({readyToClaim.length})
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {readyToClaim.map((claim) => (
            <div
              key={claim.claimId}
              className="p-5 bg-white border-[3px] border-[#2d2d2d] wobbly-card sketch-shadow space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs bg-[#fff9c4] text-[#b45309] px-2.5 py-0.5 border border-[#2d2d2d] font-bold">
                  READY TO DRAFT
                </span>
                <span className="font-mono text-xs text-[#2d2d2d]/70 font-bold">
                  Value: ₹{claim.price?.toLocaleString()}
                </span>
              </div>

              <div>
                <h3 className="font-heading text-2xl text-[#2d2d2d]">{claim.productName}</h3>
                <p className="font-mono text-xs text-[#2d2d2d]/80 mt-0.5">
                  Issue: {claim.issue}
                </p>
              </div>

              <button
                onClick={() => webMcpAgent.executeTool('prepare_claim', { purchaseId: claim.purchaseId })}
                className="w-full py-2 bg-[#2d5da1] text-white border-2 border-[#2d2d2d] wobbly-btn font-body text-lg font-bold flex items-center justify-center gap-2"
              >
                <span>PREPARE CLAIM PACKAGE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
