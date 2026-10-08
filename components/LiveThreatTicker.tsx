import React from 'react';
import { ShieldAlert, ShieldCheck, Activity, Terminal } from 'lucide-react';

export const LiveThreatTicker: React.FC = () => {
  const events = [
    { time: '10:48:12', source: 'PDF Invoice', threat: 'Indirect Prompt Injection', score: 99, status: 'BLOCKED' },
    { time: '10:48:05', source: 'User Message', threat: 'Instruction Override', score: 95, status: 'BLOCKED' },
    { time: '10:47:51', source: 'Web Scraper', threat: 'Context Poisoning', score: 91, status: 'BLOCKED' },
    { time: '10:47:33', source: 'Customer Email', threat: 'Adversarial Override', score: 48, status: 'SANITIZED' },
    { time: '10:47:19', source: 'Vision OCR', threat: 'Encoded Base64 Payload', score: 96, status: 'BLOCKED' },
    { time: '10:47:04', source: 'API Payload', threat: 'Credential Exfiltration', score: 98, status: 'BLOCKED' },
    { time: '10:46:42', source: 'User Message', threat: 'Verified Benign Query', score: 5, status: 'ALLOWED' },
  ];

  return (
    <div className="w-full bg-[#080c15] border-b border-slate-800/80 px-4 py-1.5 flex items-center justify-between overflow-hidden text-[11px] font-mono text-slate-400 select-none">
      <div className="flex items-center space-x-2 shrink-0 pr-3 border-r border-slate-800">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
        </span>
        <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
          LIVE SOC TELEMETRY
        </span>
      </div>

      <div className="flex items-center space-x-6 overflow-x-auto no-scrollbar py-0.5 px-4 whitespace-nowrap">
        {events.map((e, idx) => (
          <div key={idx} className="flex items-center space-x-2 shrink-0">
            <span className="text-slate-500">{e.time}</span>
            <span className="text-slate-300 font-semibold">{e.source}:</span>
            <span
              className={
                e.status === 'BLOCKED'
                  ? 'text-rose-400'
                  : e.status === 'SANITIZED'
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }
            >
              {e.threat}
            </span>
            <span
              className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${
                e.status === 'BLOCKED'
                  ? 'bg-rose-950/60 border-rose-800 text-rose-300'
                  : e.status === 'SANITIZED'
                  ? 'bg-amber-950/60 border-amber-800 text-amber-300'
                  : 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
              }`}
            >
              {e.status} ({e.score})
            </span>
            <span className="text-slate-700">|</span>
          </div>
        ))}
      </div>

      <div className="hidden lg:flex items-center space-x-2 shrink-0 pl-3 border-l border-slate-800 text-[10px] text-slate-500">
        <Terminal className="w-3 h-3 text-cyan-400" />
        <span>ZERO-TRUST AGENT BARRIER</span>
      </div>
    </div>
  );
};
