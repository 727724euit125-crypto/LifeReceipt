import React from 'react';
import { ShoppingBag, FileCheck2, ShieldCheck, Clock, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';

export function PurchaseMemoryTrail({ purchase }) {
  if (!purchase) return null;

  const memorySteps = [
    {
      title: "PURCHASED",
      subtitle: `${purchase.purchaseDate} at ${purchase.store}`,
      status: "COMPLETED",
      icon: ShoppingBag,
      color: "#2d5da1"
    },
    {
      title: "RECEIPT VERIFIED",
      subtitle: `ID: ${purchase.receiptId} • 100% Tax Match`,
      status: "COMPLETED",
      icon: FileCheck2,
      color: "#10b981"
    },
    {
      title: "RETURN WINDOW CLOSED",
      subtitle: purchase.returnWindow,
      status: "COMPLETED",
      icon: Clock,
      color: "#2d2d2d"
    },
    {
      title: "WARRANTY ACTIVATED",
      subtitle: `${purchase.warrantyMonths}-Month Manufacturer Protection`,
      status: "COMPLETED",
      icon: ShieldCheck,
      color: "#10b981"
    },
    {
      title: purchase.status === 'PROTECTED' ? "WARRANTY PROTECTED" : "WARRANTY EXPIRING",
      subtitle: `${purchase.daysRemaining} days remaining (Expires ${purchase.warrantyExpires})`,
      status: purchase.status === 'PROTECTED' ? "PROTECTED" : "EXPIRING",
      icon: AlertTriangle,
      color: purchase.status === 'PROTECTED' ? "#10b981" : "#f59e0b"
    },
    {
      title: "ACTION AVAILABLE",
      subtitle: purchase.claimEligibility === 'Eligible' ? "Hardware claim eligible via WebMCP Agent" : "Protected under AppleCare+/Standard Warranty",
      status: "ACTION",
      icon: Sparkles,
      color: "#ff4d4d"
    }
  ];

  return (
    <div className="p-4 bg-[#fff9c4] border-[3px] border-[#2d2d2d] wobbly-card sketch-shadow my-4 space-y-3">
      <div className="flex items-center justify-between border-b-2 border-[#2d2d2d] pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#2d5da1]" strokeWidth={2.5} />
          <h4 className="font-heading text-2xl text-[#2d2d2d] font-bold">
            PURCHASE MEMORY
          </h4>
        </div>
        <span className="font-mono text-xs bg-white border border-[#2d2d2d] px-2 py-0.5 font-bold text-[#2d2d2d]">
          OBJECT HISTORY
        </span>
      </div>

      {/* Sequential Memory Timeline Steps */}
      <div className="relative border-l-2 border-dashed border-[#2d2d2d] ml-3 pl-5 space-y-3.5 pt-1">
        {memorySteps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div 
              key={idx} 
              className="relative flex items-center justify-between animate-in fade-in slide-in-from-left-2 duration-300"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Timeline Connector Icon */}
              <div 
                className="absolute -left-[29px] w-5 h-5 rounded-full border-2 border-[#2d2d2d] bg-white flex items-center justify-center sketch-shadow-sm"
                style={{ borderColor: step.color }}
              >
                <Icon className="w-3 h-3" style={{ color: step.color }} strokeWidth={2.5} />
              </div>

              <div>
                <span className="font-heading text-lg text-[#2d2d2d] font-bold block leading-none">
                  {step.title}
                </span>
                <span className="font-mono text-xs text-[#2d2d2d]/70">
                  {step.subtitle}
                </span>
              </div>

              <span className="font-mono text-[10px] px-2 py-0.5 border border-[#2d2d2d] rounded font-bold bg-white text-[#2d2d2d]">
                ✓ RECORDED
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
