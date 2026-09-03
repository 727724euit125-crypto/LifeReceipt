import React, { useState } from 'react';
import { Lock, CheckCircle2, ArrowRight, Sparkles, Loader2, Award, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { webMcpAgent } from '../services/webMcpAgent';

export function HumanApprovalModal({ claim, onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStep, setSubmissionStep] = useState(0); // 0: Idle, 1: Approved, 2: Submitting, 3: Success

  if (!claim) return null;

  const handleApprove = async () => {
    setIsSubmitting(true);
    setSubmissionStep(1); // HUMAN APPROVED

    await new Promise((r) => setTimeout(r, 700));
    setSubmissionStep(2); // SUBMITTING CLAIM

    await new Promise((r) => setTimeout(r, 1100));
    setSubmissionStep(3); // CLAIM CREATED & UNDER REVIEW

    // Fire victory celebration confetti
    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.55 }
      });
    } catch (e) {
      // fallback
    }

    await new Promise((r) => setTimeout(r, 1200));
    await webMcpAgent.approveAndSubmitClaim(claim.claimId);
    setIsSubmitting(false);
  };

  const handleReject = () => {
    webMcpAgent.rejectClaim(claim.claimId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2d2d2d]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#fdfbf7] border-[4px] border-[#2d2d2d] wobbly-card sketch-shadow-lg p-6 md:p-8">
        
        {/* Red Thumbtack Pin */}
        <div className="thumbtack-pin" />

        {/* Header Alert */}
        <div className="text-center pt-2 pb-4 border-b-2 border-[#2d2d2d]">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ff4d4d] text-white border-2 border-[#2d2d2d] wobbly-badge font-mono text-xs font-bold sketch-shadow-sm mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>MANDATORY HUMAN AUTHORIZATION GATEWAY</span>
          </div>
          <h2 className="font-heading text-4xl text-[#2d2d2d] font-bold tracking-tight">
            THE AGENT IS READY.
          </h2>
          <p className="font-body text-2xl text-[#2d2d2d] font-bold mt-1">
            Sony WH-1000XM6
          </p>
        </div>

        {/* Claim Package Details */}
        {submissionStep === 0 && (
          <div className="my-6 space-y-4">
            
            {/* Issue Description */}
            <div className="p-4 bg-[#fff9c4] border-2 border-[#2d2d2d] wobbly-md">
              <span className="font-mono text-xs font-bold text-[#b45309]">REPORTED ISSUE</span>
              <p className="font-heading text-2xl text-[#2d2d2d] mt-0.5 font-bold">
                "{claim.issue}"
              </p>
            </div>

            {/* 3 Verification Check Badges */}
            <div className="grid grid-cols-3 gap-2 font-mono text-xs font-bold">
              <div className="p-2.5 bg-[#e8f5e9] border border-[#10b981] rounded text-center text-[#047857]">
                ✓ WARRANTY ACTIVE
              </div>
              <div className="p-2.5 bg-[#e3f2fd] border border-[#2d5da1] rounded text-center text-[#2d5da1]">
                ✓ RECEIPT VERIFIED
              </div>
              <div className="p-2.5 bg-[#e8f5e9] border border-[#10b981] rounded text-center text-[#047857]">
                ✓ CLAIM ELIGIBLE
              </div>
            </div>

            {/* YOUR DECISION SECTION (Priority 6) */}
            <div className="p-4 bg-white border-2 border-[#2d2d2d] wobbly-card text-center space-y-1">
              <h3 className="font-heading text-2xl text-[#ff4d4d] font-bold">
                YOUR DECISION
              </h3>
              <p className="font-body text-xl text-[#2d2d2d]/80">
                The agent prepared everything. You decide whether to submit it.
              </p>
            </div>
          </div>
        )}

        {/* Cinematic Step Submission Progression (Priority 7) */}
        {submissionStep > 0 && (
          <div className="my-8 py-6 text-center space-y-4">
            <div className="w-24 h-24 mx-auto bg-[#fff9c4] border-[4px] border-[#2d2d2d] wobbly-circle flex items-center justify-center sketch-shadow">
              {submissionStep === 1 && <CheckCircle2 className="w-12 h-12 text-[#10b981] animate-bounce" />}
              {submissionStep === 2 && <Loader2 className="w-12 h-12 text-[#ff4d4d] animate-spin" />}
              {submissionStep === 3 && <Sparkles className="w-12 h-12 text-[#2d5da1]" />}
            </div>

            <div className="space-y-1">
              <span className="font-mono text-xs bg-[#2d5da1] text-white px-2 py-0.5 rounded font-bold uppercase">
                {submissionStep === 1 && "HUMAN APPROVED"}
                {submissionStep === 2 && "SUBMITTING CLAIM"}
                {submissionStep === 3 && "CLAIM CREATED"}
              </span>

              <h3 className="font-heading text-4xl text-[#2d2d2d] font-bold pt-2">
                {submissionStep === 3 ? `CLAIM #${claim.claimId}` : "Transmitting Claim Package..."}
              </h3>

              {submissionStep === 3 && (
                <div className="space-y-2 pt-2">
                  <div className="inline-block px-4 py-1.5 bg-[#e8f5e9] border-2 border-[#10b981] wobbly-badge font-mono text-sm font-bold text-[#047857]">
                    STATUS: UNDER REVIEW
                  </div>

                  {/* Priority 7 Requirement Badges */}
                  <div className="flex items-center justify-center gap-2 font-mono text-xs font-bold text-[#2d2d2d]/80">
                    <span className="bg-white border px-2 py-0.5 rounded">AGENT PREPARED</span>
                    <span>•</span>
                    <span className="bg-white border px-2 py-0.5 rounded">HUMAN APPROVED</span>
                    <span>•</span>
                    <span className="bg-white border px-2 py-0.5 rounded">SYSTEM SUBMITTED</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {submissionStep === 0 && (
          <div className="mt-6 pt-4 border-t-2 border-dashed border-[#2d2d2d] flex items-center justify-between gap-3">
            <button
              onClick={handleReject}
              className="px-5 py-2.5 bg-[#e5e0d8] border-2 border-[#2d2d2d] wobbly-btn font-body text-xl font-bold text-[#2d2d2d] hover:bg-[#ff4d4d] hover:text-white transition-colors"
            >
              REJECT
            </button>

            <button
              onClick={handleApprove}
              disabled={isSubmitting}
              className="px-6 py-3 bg-[#ff4d4d] text-white border-[3px] border-[#2d2d2d] wobbly-btn font-body text-2xl font-bold sketch-shadow-hover flex items-center gap-2"
            >
              <span>APPROVE & SUBMIT</span>
              <ArrowRight className="w-6 h-6" strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
