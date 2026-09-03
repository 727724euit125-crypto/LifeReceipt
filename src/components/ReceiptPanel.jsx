import React from 'react';
import { X, CheckCircle2, ShieldCheck, FileCheck, Award, Printer, ArrowRight } from 'lucide-react';
import { webMcpAgent } from '../services/webMcpAgent';

export function ReceiptPanel({ receiptData, onClose }) {
  if (!receiptData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2d2d2d]/60 backdrop-blur-sm animate-fade-in">
      {/* Hand-Drawn Receipt Wrapper with tape strip */}
      <div className="relative w-full max-w-lg bg-[#fffdfa] border-[3px] border-[#2d2d2d] wobbly-receipt sketch-shadow-lg p-6 md:p-8 animate-unfold overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Top Tape Strip */}
        <div className="tape-strip"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 bg-white border-2 border-[#2d2d2d] wobbly-sm text-[#2d2d2d] hover:bg-[#ff4d4d] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" strokeWidth={2.5} />
        </button>

        {/* Thermal Receipt Header */}
        <div className="text-center pb-4 border-b-2 border-dashed border-[#2d2d2d]">
          <div className="inline-block bg-[#fff9c4] border-2 border-[#2d2d2d] px-3 py-1 wobbly-badge font-mono text-xs font-bold text-[#2d5da1] mb-2">
            AUTHENTIC RECEIPT VAULT
          </div>
          <h3 className="font-heading text-2xl md:text-3xl text-[#2d2d2d] font-bold">
            {receiptData.storeName || 'Authorized Tech Retailer'}
          </h3>
          <p className="font-mono text-xs text-[#2d2d2d]/70 mt-1">
            TAX ID: {receiptData.taxId || 'GSTIN29ABCDE1234F1Z5'}
          </p>
          <p className="font-mono text-xs text-[#2d2d2d]/70">
            DATE: {receiptData.purchaseDate}
          </p>
        </div>

        {/* Verified Stamp Overlay */}
        <div className="relative my-4 p-3 bg-[#e8f5e9] border-2 border-[#10b981] wobbly-card flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-[#10b981]" strokeWidth={2.5} />
            <div>
              <span className="font-heading text-lg font-bold text-[#047857]">
                RECEIPT VERIFIED & ANCHORED
              </span>
              <p className="font-mono text-xs text-[#047857]/80">
                Receipt ID: {receiptData.receiptId}
              </p>
            </div>
          </div>
          <span className="font-mono text-xs bg-white border border-[#10b981] px-2 py-0.5 font-bold text-[#10b981]">
            100% MATCH
          </span>
        </div>

        {/* Itemized Purchase Table */}
        <div className="my-4">
          <h4 className="font-heading text-xl text-[#2d2d2d] border-b-2 border-[#2d2d2d] pb-1">
            PURCHASED ITEMS
          </h4>
          <div className="divide-y divide-dashed divide-[#2d2d2d]/30 font-mono text-sm py-2">
            {(receiptData.items || []).map((item, idx) => (
              <div key={idx} className="py-2 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#2d2d2d] block">{item.name}</span>
                  <span className="text-xs text-[#2d2d2d]/70">Qty: {item.qty || 1}</span>
                </div>
                <span className="font-bold text-[#2d2d2d]">
                  ₹{(item.price * (item.qty || 1)).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Subtotal, Tax, Total */}
          <div className="border-t-2 border-[#2d2d2d] pt-2 font-mono text-sm space-y-1">
            <div className="flex justify-between text-[#2d2d2d]/80">
              <span>SUBTOTAL</span>
              <span>₹{receiptData.subtotal?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#2d2d2d]/80">
              <span>GST / TAX (18%)</span>
              <span>₹{receiptData.tax?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#2d2d2d] pt-1 border-t border-dashed border-[#2d2d2d]">
              <span>TOTAL PAID</span>
              <span>₹{receiptData.total?.toLocaleString()}</span>
            </div>
            <div className="text-xs text-[#2d2d2d]/60 text-right pt-0.5">
              Paid via {receiptData.paymentMethod || 'Credit Card'}
            </div>
          </div>
        </div>

        {/* LIFE RECEIPT INTELLIGENCE CARD */}
        <div className="mt-6 p-4 bg-[#fff9c4] border-[3px] border-[#2d2d2d] wobbly-card sketch-shadow">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-6 h-6 text-[#2d5da1]" strokeWidth={2.5} />
            <h4 className="font-heading text-xl text-[#2d2d2d]">
              LIFE RECEIPT INTELLIGENCE
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm font-mono font-bold">
            <div className="p-2 bg-white border border-[#2d2d2d] rounded flex items-center justify-between">
              <span className="text-[#2d2d2d]/70">Warranty:</span>
              <span className="text-[#10b981] bg-[#e8f5e9] px-1.5 py-0.5 rounded">ACTIVE</span>
            </div>
            <div className="p-2 bg-white border border-[#2d2d2d] rounded flex items-center justify-between">
              <span className="text-[#2d2d2d]/70">Return Window:</span>
              <span className="text-[#ff4d4d] bg-[#ffebee] px-1.5 py-0.5 rounded">CLOSED</span>
            </div>
            <div className="p-2 bg-white border border-[#2d2d2d] rounded flex items-center justify-between">
              <span className="text-[#2d2d2d]/70">Receipt State:</span>
              <span className="text-[#2d5da1] bg-[#e3f2fd] px-1.5 py-0.5 rounded">VERIFIED</span>
            </div>
            <div className="p-2 bg-white border border-[#2d2d2d] rounded flex items-center justify-between">
              <span className="text-[#2d2d2d]/70">Claim Status:</span>
              <span className="text-[#10b981] bg-[#e8f5e9] px-1.5 py-0.5 rounded">ELIGIBLE</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-between pt-3 border-t-2 border-dashed border-[#2d2d2d]">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-[#2d2d2d] wobbly-btn font-body text-base font-bold text-[#2d2d2d] hover:bg-[#e5e0d8]"
          >
            <Printer className="w-4 h-4" /> Print / Export PDF
          </button>
          
          <button
            onClick={() => {
              onClose();
              webMcpAgent.executeTool('prepare_claim', {
                purchaseId: 'purch-2',
                issue: 'Left earcup stopped producing sound'
              });
            }}
            className="flex items-center gap-2 px-4 py-1.5 bg-[#ff4d4d] text-white border-2 border-[#2d2d2d] wobbly-btn font-body text-lg font-bold sketch-shadow-hover"
          >
            <span>Prepare Claim</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Simulated Jagged Bottom Receipt Edge */}
        <div className="mt-6 flex justify-between overflow-hidden text-[#2d2d2d]/30 text-xs font-mono select-none">
          ▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲
        </div>
      </div>
    </div>
  );
}
