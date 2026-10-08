import React, { useState } from 'react';
import { Sparkles, Shield, ArrowRight, Copy, Check } from 'lucide-react';

interface SanitizerDiffProps {
  originalText: string;
  sanitizedText?: string;
  untrustedInstructions?: string[];
}

export const SanitizerDiff: React.FC<SanitizerDiffProps> = ({
  originalText,
  sanitizedText,
  untrustedInstructions = [],
}) => {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'sanitized'>('split');

  if (!sanitizedText && untrustedInstructions.length === 0) {
    return null;
  }

  const handleCopy = () => {
    if (sanitizedText) {
      navigator.clipboard.writeText(sanitizedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Perimeter Sanitization & Content Separation
          </h3>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex rounded-lg bg-slate-950 p-0.5 border border-slate-800 text-[11px]">
            <button
              onClick={() => setViewMode('split')}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                viewMode === 'split' ? 'bg-slate-800 text-slate-200 font-semibold' : 'text-slate-400'
              }`}
            >
              Side-by-Side Diff
            </button>
            <button
              onClick={() => setViewMode('sanitized')}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                viewMode === 'sanitized' ? 'bg-slate-800 text-amber-300 font-semibold' : 'text-slate-400'
              }`}
            >
              Sanitized Output
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Quarantined Instructions Alert */}
      {untrustedInstructions.length > 0 && (
        <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-900/50">
          <span className="text-[11px] font-semibold text-rose-300 block mb-1">
            Quarantined Instructions (Neutralized by Firewall):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {untrustedInstructions.map((instr, idx) => (
              <span
                key={idx}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-900/40 border border-rose-700/60 text-rose-200 line-through"
              >
                {instr}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Content Comparison */}
      {viewMode === 'split' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          {/* Original */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-400 block mb-1">
              Untrusted Raw Input
            </span>
            <div className="text-slate-300 whitespace-pre-wrap max-h-44 overflow-y-auto leading-relaxed">
              {originalText}
            </div>
          </div>

          {/* Sanitized */}
          <div className="p-3 rounded-lg bg-slate-950 border border-emerald-900/40">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 block mb-1">
              Firewall-Sanitized Payload (Safe for Agent)
            </span>
            <div className="text-slate-200 whitespace-pre-wrap max-h-44 overflow-y-auto leading-relaxed">
              {sanitizedText || '[No instruction modifications required]'}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-lg bg-slate-950 border border-emerald-900/40 font-mono text-xs text-slate-200 whitespace-pre-wrap max-h-56 overflow-y-auto">
          {sanitizedText}
        </div>
      )}
    </div>
  );
};
