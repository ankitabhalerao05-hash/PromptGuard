import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Info, Terminal, ChevronRight } from 'lucide-react';
import { FirewallDecision } from '../types';

interface DecisionCardProps {
  decision: FirewallDecision;
  processingTimeMs: number;
}

export const DecisionCard: React.FC<DecisionCardProps> = ({ decision, processingTimeMs }) => {
  const { action, risk_score, confidence, primary_attack, explanation, severity, indicators } = decision;

  // Visual state styling
  let badgeBg = 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400';
  let badgeIcon = <ShieldCheck className="w-5 h-5 text-emerald-400" />;
  let badgeText = 'ALLOWED';
  let borderGlow = 'border-emerald-500/30 shadow-emerald-950/20';

  if (action === 'BLOCK') {
    badgeBg = 'bg-rose-500/15 border-rose-500/50 text-rose-400';
    badgeIcon = <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />;
    badgeText = 'BLOCKED';
    borderGlow = 'border-rose-500/40 shadow-rose-950/30';
  } else if (action === 'SANITIZE / REVIEW') {
    badgeBg = 'bg-amber-500/15 border-amber-500/50 text-amber-400';
    badgeIcon = <AlertTriangle className="w-5 h-5 text-amber-400" />;
    badgeText = 'SANITIZED / REVIEW';
    borderGlow = 'border-amber-500/40 shadow-amber-950/30';
  }

  return (
    <div className={`rounded-xl border bg-slate-900/80 p-5 shadow-xl ${borderGlow} transition-all`}>
      {/* Top Banner / Verdict */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Firewall Security Verdict
          </span>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg border font-mono font-bold text-sm tracking-wide shadow-sm ${badgeBg}`}>
              {badgeIcon}
              <span>{badgeText}</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ({processingTimeMs} ms)
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <span className="text-[10px] uppercase text-slate-400 block">Classified Threat</span>
            <span className="font-semibold text-sm text-slate-200">
              {primary_attack || 'Safe Benign Input'}
            </span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="text-right">
            <span className="text-[10px] uppercase text-slate-400 block">Threat Score</span>
            <span className="font-mono font-bold text-sm text-white">
              {risk_score} / 100
            </span>
          </div>
        </div>
      </div>

      {/* SOC Explainability Section */}
      <div className="mt-4 space-y-3">
        <div>
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-300 mb-1.5">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>SOC Explainability Rationale</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 leading-relaxed font-sans">
            {explanation}
          </div>
        </div>

        {/* Explainability Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60">
            <span className="text-[10px] uppercase text-slate-400 block mb-0.5 font-semibold">
              1. What was detected?
            </span>
            <p className="text-slate-300 text-[11px]">
              {primary_attack ? `Active syntax signature matching ${primary_attack}` : 'Benign input within operational parameters'}
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60">
            <span className="text-[10px] uppercase text-slate-400 block mb-0.5 font-semibold">
              2. Core Security Policy
            </span>
            <p className="text-slate-300 text-[11px]">
              {action === 'BLOCK'
                ? 'Zero-trust perimeter enforced. Instructions quarantined.'
                : action === 'SANITIZE / REVIEW'
                ? 'Content sanitized. Dangerous overrides replaced.'
                : 'Verified safe. Instructions passed to agent.'}
            </p>
          </div>
        </div>

        {/* Detected Indicators List if any */}
        {indicators && indicators.length > 0 && (
          <div className="mt-3">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
              Triggered Detection Signatures ({indicators.length})
            </span>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {indicators.map((ind, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between p-2 rounded bg-slate-950/60 border border-slate-800 text-[11px]"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-semibold text-rose-400 font-mono">
                        [{ind.attack_type}]
                      </span>
                      <span className="text-slate-400 text-[10px]">{ind.detector_name}</span>
                    </div>
                    {ind.excerpt && (
                      <code className="text-amber-300/90 text-[10px] block font-mono bg-slate-900 px-1 py-0.5 rounded">
                        {ind.excerpt}
                      </code>
                    )}
                    {ind.decoded_content && (
                      <div className="text-cyan-300 text-[10px] font-mono mt-0.5">
                        ↳ Decoded: "{ind.decoded_content.slice(0, 60)}..."
                      </div>
                    )}
                  </div>
                  <div className="text-right whitespace-nowrap ml-2">
                    <span className="text-rose-400 font-bold font-mono">+{ind.risk_contribution}</span>
                    <span className="text-slate-500 block text-[9px]">Conf: {Math.round(ind.confidence * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
