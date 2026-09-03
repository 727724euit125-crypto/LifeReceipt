import React, { useState, useEffect } from 'react';
import { Terminal, CheckCircle2, Lock, Sparkles, Play, Code, ChevronDown, ChevronUp } from 'lucide-react';
import { webMcpAgent } from '../services/webMcpAgent';

export function AgentActivityPage() {
  const [agentState, setAgentState] = useState(webMcpAgent.getState());
  const [showTechnicalLogs, setShowTechnicalLogs] = useState(false);

  useEffect(() => {
    return webMcpAgent.subscribe((state) => setAgentState(state));
  }, []);

  const logs = agentState.agentLogs;

  const missionSteps = [
    { num: "01", title: "SEARCHING YOUR VAULT", tool: "search_purchases()", desc: "Scan purchase intelligence vault for Sony WH-1000XM6", status: "SUCCESS" },
    { num: "02", title: "PURCHASE FOUND", tool: "get_purchase()", desc: "Retrieved metadata & serial number (SN: SN-WH1000XM6-773192)", status: "SUCCESS" },
    { num: "03", title: "WARRANTY VERIFIED", tool: "check_warranty()", desc: "Active manufacturer warranty verified with 19 days remaining", status: "SUCCESS" },
    { num: "04", title: "RECEIPT VERIFIED", tool: "get_receipt()", desc: "Receipt RCP-SNY-99201 verified. Subtotal ₹21,185 + GST ₹3,814", status: "SUCCESS" },
    { num: "05", title: "CLAIM PREPARED", tool: "prepare_claim()", desc: "Drafted formal claim package for Sony India Operations", status: "SUCCESS" },
    { num: "06", title: "HUMAN APPROVAL REQUIRED", tool: "request_claim_approval()", desc: "🔐 Halting execution until explicit user decision", status: "WAITING_FOR_APPROVAL" }
  ];

  return (
    <div className="py-6 px-4 md:px-8 space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-[#2d2d2d]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs bg-[#ff4d4d] text-white px-2.5 py-0.5 wobbly-badge font-bold">
              CINEMATIC MISSION ENGINE
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#2d2d2d]">
              LIFE RECEIPT AGENT
            </h1>
          </div>
          <p className="font-body text-xl text-[#2d2d2d]/70 mt-1">
            Structured mission sequence powered by WebMCP autonomous tools.
          </p>
        </div>

        <button
          onClick={() => webMcpAgent.runDemoWorkflow()}
          className="px-5 py-2.5 bg-[#2d5da1] text-white border-[3px] border-[#2d2d2d] wobbly-btn font-body text-xl font-bold sketch-shadow-hover flex items-center gap-2"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>TRIGGER AGENT MISSION</span>
        </button>
      </div>

      {/* PRIORITY 5: CINEMATIC MISSION TIMELINE */}
      <div className="p-6 bg-white border-[4px] border-[#2d2d2d] wobbly-card sketch-shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b-2 border-[#2d2d2d] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#ff4d4d]" />
            <h2 className="font-heading text-3xl text-[#2d2d2d] font-bold">
              ACTIVE MISSION STEPS
            </h2>
          </div>
          <span className="font-mono text-xs bg-[#fff9c4] border border-[#2d2d2d] px-2 py-0.5 font-bold">
            WEBMCP AUTOMATION
          </span>
        </div>

        <div className="space-y-4 pt-2">
          {missionSteps.map((step) => (
            <div key={step.num} className="p-4 bg-[#fdfbf7] border-2 border-[#2d2d2d] wobbly-sm sketch-shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 border-2 border-[#2d2d2d] wobbly-circle font-mono text-sm font-bold flex items-center justify-center ${
                  step.status === 'WAITING_FOR_APPROVAL' ? 'bg-[#ff4d4d] text-white animate-pulse' : 'bg-[#10b981] text-white'
                }`}>
                  {step.status === 'WAITING_FOR_APPROVAL' ? '🔐' : step.num}
                </div>

                <div>
                  <h3 className="font-heading text-2xl text-[#2d2d2d] font-bold">
                    {step.num} {step.title}
                  </h3>
                  <p className="font-body text-lg text-[#2d2d2d]/80">
                    {step.desc}
                  </p>
                </div>
              </div>

              <div className="self-end md:self-auto text-right">
                <code className="font-mono text-sm font-bold bg-[#e3f2fd] text-[#2d5da1] px-3 py-1 border border-[#2d5da1] rounded inline-block">
                  {step.tool}
                </code>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* COLLAPSIBLE TECHNICAL EXECUTION AUDIT LOGS */}
      <div className="p-4 bg-[#fff9c4] border-[3px] border-[#2d2d2d] wobbly-card sketch-shadow">
        <button
          onClick={() => setShowTechnicalLogs(!showTechnicalLogs)}
          className="w-full flex items-center justify-between font-heading text-2xl text-[#2d2d2d] font-bold focus:outline-none"
        >
          <span>VIEW TECHNICAL EXECUTION LOGS ({logs.length})</span>
          {showTechnicalLogs ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
        </button>

        {showTechnicalLogs && (
          <div className="mt-4 pt-3 border-t-2 border-dashed border-[#2d2d2d] space-y-2 font-mono text-xs animate-in fade-in duration-150">
            {logs.map((log) => (
              <div key={log.id} className="p-3 bg-white border border-[#2d2d2d] rounded flex items-start justify-between gap-3">
                <div>
                  <span className="font-bold text-[#2d5da1]">{log.timestamp} • {log.tool}()</span>
                  <p className="text-[#2d2d2d] text-sm font-body font-bold mt-0.5">{log.output}</p>
                </div>
                <span className="bg-[#e8f5e9] text-[#047857] px-2 py-0.5 font-bold rounded">
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
