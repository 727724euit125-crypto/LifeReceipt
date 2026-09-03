import React from 'react';
import { X, Shield, Receipt, FileText, CheckCircle2, AlertTriangle, ArrowRight, Store, Calendar, Hash, Trash2 } from 'lucide-react';
import { WarrantyRing } from './WarrantyRing';
import { PurchaseMemoryTrail } from './PurchaseMemoryTrail';
import { webMcpAgent } from '../services/webMcpAgent';

export function PurchaseDetailModal({ purchase, onClose }) {
  if (!purchase) return null;

  const handleOpenReceipt = () => {
    onClose();
    webMcpAgent.executeTool('get_receipt', { purchaseId: purchase.id });
  };

  const handlePrepareClaim = () => {
    onClose();
    webMcpAgent.executeTool('prepare_claim', {
      purchaseId: purchase.id,
      issue: purchase.issueDescription || "Hardware defect under warranty."
    });
  };

  const handleRemovePurchase = () => {
    if (window.confirm(`Are you sure you want to remove "${purchase.name}" from your vault?`)) {
      webMcpAgent.removePurchaseFromVault(purchase.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2d2d2d]/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#fdfbf7] dark:bg-[#1f2028] border-[4px] border-[#2d2d2d] dark:border-white/30 wobbly-card sketch-shadow-lg p-6 md:p-8 max-h-[90vh] overflow-y-auto text-[#2d2d2d] dark:text-[#f3f4f6]">
        
        {/* Top Tape Strip */}
        <div className="tape-strip" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white dark:bg-[#282a36] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-sm text-[#2d2d2d] dark:text-white hover:bg-[#ff4d4d] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" strokeWidth={2.5} />
        </button>

        {/* Header Title */}
        <div className="flex items-start gap-4 pb-4 border-b-2 border-[#2d2d2d] dark:border-white/20">
          <div className="text-4xl p-3 bg-[#fff9c4] dark:bg-[#282a36] border-[3px] border-[#2d2d2d] dark:border-white/30 wobbly-circle sketch-shadow">
            {purchase.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs bg-[#2d5da1] text-white px-2 py-0.5 wobbly-badge font-bold">
                {purchase.brand}
              </span>
              <span className={`font-mono text-xs px-2 py-0.5 border border-[#2d2d2d] dark:border-white/30 font-bold ${
                purchase.status === 'PROTECTED' ? 'bg-[#e8f5e9] text-[#047857]' : 'bg-[#fff9c4] text-[#b45309]'
              }`}>
                {purchase.status}
              </span>
            </div>
            <h2 className="font-heading text-3xl text-[#2d2d2d] dark:text-white mt-1 font-bold">
              {purchase.name}
            </h2>
            <p className="font-mono text-base font-bold text-[#2d2d2d]/80 dark:text-white/80">
              Purchased for ₹{purchase.price.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Main Grid: Warranty Ring + Technical Specs */}
        <div className="grid md:grid-cols-2 gap-6 my-6">
          
          {/* Left: Warranty Countdown Ring */}
          <div className="p-4 bg-white dark:bg-[#282a36] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-md sketch-shadow flex flex-col items-center justify-center text-center">
            <h3 className="font-heading text-xl text-[#2d2d2d] dark:text-white mb-2">
              WARRANTY STATUS
            </h3>
            
            <WarrantyRing
              daysRemaining={purchase.daysRemaining}
              totalDays={purchase.warrantyMonths * 30}
              status={purchase.status}
            />

            <p className="font-body text-lg text-[#2d2d2d]/80 dark:text-white/80 mt-2">
              Expires on <strong className="font-mono text-[#2d2d2d] dark:text-white">{purchase.warrantyExpires}</strong>
            </p>
          </div>

          {/* Right: Asset Metadata */}
          <div className="space-y-2.5 font-mono text-sm">
            <div className="p-2.5 bg-white dark:bg-[#282a36] border border-[#2d2d2d] dark:border-white/30 rounded flex items-center justify-between">
              <span className="text-[#2d2d2d]/70 dark:text-white/70 flex items-center gap-1.5">
                <Store className="w-4 h-4 text-[#2d5da1] dark:text-[#ff4d4d]" /> Store:
              </span>
              <span className="font-bold text-[#2d2d2d] dark:text-white">{purchase.store}</span>
            </div>

            <div className="p-2.5 bg-white dark:bg-[#282a36] border border-[#2d2d2d] dark:border-white/30 rounded flex items-center justify-between">
              <span className="text-[#2d2d2d]/70 dark:text-white/70 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#2d5da1] dark:text-[#ff4d4d]" /> Date:
              </span>
              <span className="font-bold text-[#2d2d2d] dark:text-white">{purchase.purchaseDate}</span>
            </div>

            <div className="p-2.5 bg-white dark:bg-[#282a36] border border-[#2d2d2d] dark:border-white/30 rounded flex items-center justify-between">
              <span className="text-[#2d2d2d]/70 dark:text-white/70 flex items-center gap-1.5">
                <Hash className="w-4 h-4 text-[#2d5da1] dark:text-[#ff4d4d]" /> Serial:
              </span>
              <span className="font-bold text-[#2d2d2d] dark:text-white">{purchase.serialNumber}</span>
            </div>

            <div className="p-2.5 bg-white dark:bg-[#282a36] border border-[#2d2d2d] dark:border-white/30 rounded flex items-center justify-between">
              <span className="text-[#2d2d2d]/70 dark:text-white/70 flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-[#2d5da1] dark:text-[#ff4d4d]" /> Receipt ID:
              </span>
              <span className="font-bold text-[#2d5da1] dark:text-[#ff4d4d] underline">{purchase.receiptId}</span>
            </div>

            <div className="p-2.5 bg-[#fff9c4] dark:bg-[#282a36] border border-[#2d2d2d] dark:border-white/30 rounded flex items-center justify-between font-bold">
              <span className="text-[#2d2d2d] dark:text-white">Claim Eligibility:</span>
              <span className="text-[#10b981]">{purchase.claimEligibility}</span>
            </div>
          </div>
        </div>

        {/* PURCHASE MEMORY TRAIL */}
        <PurchaseMemoryTrail purchase={purchase} />

        {/* Action Buttons */}
        <div className="pt-4 border-t-2 border-dashed border-[#2d2d2d] dark:border-white/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenReceipt}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#282a36] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-btn font-body text-lg font-bold text-[#2d2d2d] dark:text-white hover:bg-[#e5e0d8] sketch-shadow-hover"
            >
              <Receipt className="w-5 h-5 text-[#2d5da1] dark:text-[#ff4d4d]" />
              <span>OPEN RECEIPT</span>
            </button>

            <button
              onClick={handleRemovePurchase}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#ffebee] dark:bg-[#ff4d4d]/20 border-2 border-[#2d2d2d] dark:border-white/30 wobbly-btn font-body text-lg font-bold text-[#ff4d4d] dark:text-red-300 hover:bg-[#ff4d4d] hover:text-white transition-colors"
              title="Remove this asset from your vault"
            >
              <Trash2 className="w-4 h-4" />
              <span>REMOVE DEVICE</span>
            </button>
          </div>

          <button
            onClick={handlePrepareClaim}
            className="flex items-center gap-2 px-5 py-2 bg-[#ff4d4d] text-white border-[3px] border-[#2d2d2d] dark:border-white/30 wobbly-btn font-body text-xl font-bold sketch-shadow-hover"
          >
            <span>PREPARE CLAIM</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
