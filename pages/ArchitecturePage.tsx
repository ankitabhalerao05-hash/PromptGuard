import React from 'react';
import { Layers, Shield, CheckCircle2, Award, Zap, FileText, ArrowRight, Eye, Lock, Sparkles } from 'lucide-react';
import { ArchitectureDiagram } from '../components/ArchitectureDiagram';

export const ArchitecturePage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Target Achievement Hero Card */}
      <div className="rounded-xl border border-cyan-800/80 bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 p-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <Award className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">
                ET AI Hackathon Verification & Compliance
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Demonstrating production-grade Agentic Cybersecurity against Direct & Indirect Prompt Injections
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-lg bg-emerald-950/90 border border-emerald-500/80 text-emerald-300 font-mono font-bold text-xs shadow-md">
              ✓ D2 TARGET ACHIEVED
            </span>
            <span className="px-3 py-1 rounded-lg bg-cyan-950/90 border border-cyan-500/80 text-cyan-300 font-mono font-bold text-xs shadow-md">
              ✓ F3 TARGET ACHIEVED
            </span>
            <span className="px-3 py-1 rounded-lg bg-purple-950/90 border border-purple-500/80 text-purple-300 font-mono font-bold text-xs shadow-md">
              9/9 ATTACK CATEGORIES
            </span>
          </div>
        </div>

        {/* Requirements Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Target D2: High Demonstrable Reliability</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Demonstrates resilient, deterministic parsing and contextual detection for structured and textual content across raw text, PDFs, HTML web pages, JSON payloads, emails, and OCR image text. False-positive resistant with boundary semantic awareness.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Target F3: Comprehensive Attack Coverage (9/9)</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Exceeds the 7-category requirement by supporting all 9 major prompt injection archetypes: Instruction Override, Role Change, Secret Extraction, Tool Abuse, Credential Theft, Context Poisoning, Multi-Step Jailbreaks, Encoded Instructions, and Indirect Injections.
            </p>
          </div>
        </div>
      </div>

      {/* Visual Pipeline Architecture Diagram */}
      <ArchitectureDiagram />

      {/* 3-Minute Judge Demo Guide */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl space-y-4">
        <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
          <Zap className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white uppercase tracking-wider">
            3-Minute Judge Walkthrough Script
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          {[
            { step: '1', title: 'Open Dashboard', desc: 'Observe PromptGuard AI header, active status radar dot, and D2/F3 badges.' },
            { step: '2', title: 'Enter Normal Prompt', desc: 'Click Demo 1 (Safe query). Observe score 5/100 and immediate 🟢 ALLOW action.' },
            { step: '3', title: 'Upload Malicious PDF', desc: 'Upload sample_malicious_invoice.pdf or click Demo 7. Inspect raw text extraction.' },
            { step: '4', title: 'Detect Indirect Injection', desc: 'Observe firewall tag Indirect Prompt Injection with score 99/100 and 🔴 BLOCK.' },
            { step: '5', title: 'Inspect Quarantined Text', desc: 'See untrusted instructions removed and isolated in the Sanitizer & Agent Sandbox.' },
            { step: '6', title: 'Verify Live Audit Logs', desc: 'Switch to Security Logs tab to see timestamped event, source, and risk score.' },
            { step: '7', title: 'Review SOC Analytics', desc: 'Switch to SOC Analytics tab to see threat distribution across all 9 attack categories.' },
            { step: '8', title: 'Test Attack Simulator', desc: 'Jump to Attack Simulator. Select any of the 9 attack cards, tweak payload, and hit RUN ATTACK.' },
            { step: '9', title: 'Explain D2 + F3 Posture', desc: 'Summarize the core perimeter axiom: Untrusted content never becomes trusted instructions.' },
          ].map((item) => (
            <div key={item.step} className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 flex items-center justify-center font-mono font-bold text-[10px]">
                  {item.step}
                </span>
                <span className="font-bold text-slate-200">{item.title}</span>
              </div>
              <p className="text-[11px] text-slate-400 pl-7">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
