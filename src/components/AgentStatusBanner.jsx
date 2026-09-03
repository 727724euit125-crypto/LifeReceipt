import React, { useEffect, useState } from 'react';
import { Bot, Terminal, CheckCircle2, Lock, Loader2, Sparkles, Activity } from 'lucide-react';
import { webMcpAgent } from '../services/webMcpAgent';

export function AgentStatusBanner() {
  const [agentState, setAgentState] = useState(webMcpAgent.getState());

  useEffect(() => {
    return webMcpAgent.subscribe((state) => setAgentState(state));
  }, []);

  const executing = agentState.activeToolExecuting;
  const isDemo = agentState.isDemoRunning;
  const approvalModal = agentState.approvalModalClaim;

  // Determine current status copy (Priority 4)
  let statusText = "MONITORING 7 LIVING ASSETS";
  let statusColor = "bg-[#10b981]";

  if (executing) {
    statusText = executing.statusText || "EXECUTING WEBMCP TOOL";
    statusColor = "bg-[#ff4d4d]";
  } else if (approvalModal) {
    statusText = "WAITING FOR YOU (HUMAN DECISION MODE)";
    statusColor = "bg-[#ff4d4d]";
  } else if (isDemo) {
    statusText = "RUNNING 3-MIN WEBMCP DEMO";
    statusColor = "bg-[#2d5da1]";
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-md animate-in slide-in-from-bottom-5 duration-200">
      <div className="p-3.5 bg-[#fff9c4] border-[3px] border-[#2d2d2d] wobbly-card sketch-shadow-lg flex items-center gap-3">
        <div className="p-2 bg-[#2d5da1] text-white border-2 border-[#2d2d2d] wobbly-circle flex items-center justify-center">
          {executing || isDemo ? (
            <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2.5} />
          ) : approvalModal ? (
            <Lock className="w-5 h-5 text-[#ff4d4d]" strokeWidth={2.5} />
          ) : (
            <Activity className="w-5 h-5" strokeWidth={2.5} />
          )}
        </div>

        <div className="flex-1 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#2d5da1] uppercase">
              LIFE RECEIPT AGENT
            </span>
            <span className="flex items-center gap-1 font-bold text-[10px] text-[#2d2d2d]">
              <span className={`w-2 h-2 ${statusColor} rounded-full animate-ping`} />
              ● VAULT ACTIVE
            </span>
          </div>

          <p className="font-heading text-lg font-bold text-[#2d2d2d] mt-0.5 leading-none">
            {statusText}
          </p>
        </div>
      </div>
    </div>
  );
}
