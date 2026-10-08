import React from 'react';
import { Bot, ShieldCheck, ShieldAlert, Cpu, Lock, CheckCircle2 } from 'lucide-react';
import { ActionType } from '../types';

interface AgentGatewayPreviewProps {
  action: ActionType;
  outcomeText: string;
  sourceType: string;
}

export const AgentGatewayPreview: React.FC<AgentGatewayPreviewProps> = ({
  action,
  outcomeText,
  sourceType,
}) => {
  let statusBadge = (
    <span className="flex items-center space-x-1 text-emerald-400 text-xs font-mono font-semibold">
      <ShieldCheck className="w-3.5 h-3.5" />
      <span>Safe Instruction Ingested</span>
    </span>
  );
  let containerBg = 'bg-slate-900/50 border-slate-800';

  if (action === 'BLOCK') {
    statusBadge = (
      <span className="flex items-center space-x-1 text-rose-400 text-xs font-mono font-semibold">
        <Lock className="w-3.5 h-3.5" />
        <span>Agent Perimeter Shield Engaged - 0 Execution</span>
      </span>
    );
    containerBg = 'bg-rose-950/20 border-rose-900/50';
  } else if (action === 'SANITIZE / REVIEW') {
    statusBadge = (
      <span className="flex items-center space-x-1 text-amber-400 text-xs font-mono font-semibold">
        <Cpu className="w-3.5 h-3.5" />
        <span>Sanitized Passive Data Forwarded</span>
      </span>
    );
    containerBg = 'bg-amber-950/20 border-amber-900/50';
  }

  return (
    <div className={`rounded-xl border p-4 ${containerBg} transition-all`}>
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center">
            <Bot className="w-4 h-4 text-indigo-300" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-200 block">
              AI Agent Execution Gateway (Downstream Sandbox)
            </span>
            <span className="text-[10px] text-slate-400">
              Source: {sourceType} → Firewall Filter → Agent Runtime
            </span>
          </div>
        </div>

        {statusBadge}
      </div>

      <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/90 font-mono text-xs leading-relaxed text-slate-300">
        <div className="text-[10px] uppercase font-bold text-slate-500 mb-1 flex items-center justify-between">
          <span>Agent Ingestion Stream:</span>
          <span>Policy: No Untrusted Autonomous Execution</span>
        </div>
        <p className="whitespace-pre-wrap">{outcomeText}</p>
      </div>
    </div>
  );
};
