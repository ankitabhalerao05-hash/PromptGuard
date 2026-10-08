import React from 'react';
import { ArrowDown, Shield, FileText, Cpu, CheckCircle2, AlertOctagon, RefreshCw, Lock, Sparkles } from 'lucide-react';

export const ArchitectureDiagram: React.FC = () => {
  const steps = [
    {
      num: 1,
      title: 'Untrusted Input Sources',
      desc: 'User text, PDF files, Web URLs/HTML, Image/OCR, Email, JSON/API',
      icon: FileText,
      color: 'border-slate-700 bg-slate-900 text-slate-300',
    },
    {
      num: 2,
      title: 'Content Parser & Text Extraction',
      desc: 'pypdf parser, BeautifulSoup HTML parser, OCR vision reader, email mime unpacker',
      icon: Cpu,
      color: 'border-cyan-800 bg-cyan-950/40 text-cyan-300',
    },
    {
      num: 3,
      title: 'Normalization & Decoupling',
      desc: 'Unicode NFKC, entity unescaping, zero-width stripping, untrusted boundary tagging',
      icon: RefreshCw,
      color: 'border-cyan-800 bg-cyan-950/40 text-cyan-300',
    },
    {
      num: 4,
      title: 'Modular Detection Engine',
      desc: '9 Attack Detectors + Isolated Base64/Hex/ROT13 decoder + Prompt-immune LLM classifier',
      icon: Shield,
      color: 'border-indigo-800 bg-indigo-950/40 text-indigo-300',
    },
    {
      num: 5,
      title: 'Attack Classification & Risk Scoring',
      desc: '0-100 composite threat score, confidence calculation, primary attack attribution',
      icon: AlertOctagon,
      color: 'border-amber-800 bg-amber-950/40 text-amber-300',
    },
    {
      num: 6,
      title: 'Decision Engine (3 States)',
      desc: 'ALLOW (0-29 Safe) | SANITIZE / REVIEW (30-69) | BLOCK (70-100 Malicious)',
      icon: Lock,
      color: 'border-emerald-800 bg-emerald-950/40 text-emerald-300',
    },
    {
      num: 7,
      title: 'AI Agent Sandbox Runtime',
      desc: 'Zero-trust perimeter. Quarantined attacks never execute. Clean instructions passed.',
      icon: Sparkles,
      color: 'border-purple-800 bg-purple-950/40 text-purple-300',
    },
  ];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl space-y-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center justify-center gap-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          Perimeter Security Architecture
        </h2>
        <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800/60 text-cyan-300 text-xs font-semibold">
          CORE SECURITY PRINCIPLE: "Untrusted content must never automatically become trusted instructions."
        </div>
      </div>

      {/* Step by Step Flow */}
      <div className="flex flex-col items-center space-y-2 max-w-3xl mx-auto">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <React.Fragment key={step.num}>
              <div
                className={`w-full p-4 rounded-xl border ${step.color} shadow-md flex items-center space-x-4 transition-all hover:scale-[1.01]`}
              >
                <div className="w-9 h-9 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-center text-sm font-bold font-mono">
                  {step.num}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4 opacity-80" />
                    <h4 className="text-sm font-bold">{step.title}</h4>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{step.desc}</p>
                </div>
              </div>

              {idx < steps.length - 1 && (
                <div className="flex flex-col items-center">
                  <div className="h-3 w-0.5 bg-slate-800"></div>
                  <ArrowDown className="w-3.5 h-3.5 text-slate-500" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* 3 Decision Paths Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800">
        <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/60 text-center">
          <span className="text-emerald-400 font-bold text-xs uppercase block mb-1">
            🟢 ALLOW (0–29)
          </span>
          <p className="text-[11px] text-slate-400">
            Low risk legitimate business prompts. Direct pass-through to AI Agent.
          </p>
        </div>

        <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-900/60 text-center">
          <span className="text-amber-400 font-bold text-xs uppercase block mb-1">
            🟡 SANITIZE / REVIEW (30–69)
          </span>
          <p className="text-[11px] text-slate-400">
            Suspicious syntax neutralized. Malicious instructions stripped and isolated.
          </p>
        </div>

        <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-900/60 text-center">
          <span className="text-rose-400 font-bold text-xs uppercase block mb-1">
            🔴 BLOCK (70–100)
          </span>
          <p className="text-[11px] text-slate-400">
            Malicious attack quarantined. 0 instructions sent to AI agent runtime.
          </p>
        </div>
      </div>
    </div>
  );
};
