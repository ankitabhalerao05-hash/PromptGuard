import React, { useState } from 'react';
import { Sliders, Shield, Save, Check, RefreshCw, Key, AlertTriangle } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [reviewThreshold, setReviewThreshold] = useState<number>(30);
  const [blockThreshold, setBlockThreshold] = useState<number>(70);
  const [defenseMode, setDefenseMode] = useState<string>('balanced');
  const [safeToolSimulation, setSafeToolSimulation] = useState<boolean>(true);
  const [saved, setSaved] = useState<boolean>(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePreset = (mode: string) => {
    setDefenseMode(mode);
    if (mode === 'strict') {
      setReviewThreshold(20);
      setBlockThreshold(55);
    } else if (mode === 'paranoid') {
      setReviewThreshold(10);
      setBlockThreshold(40);
    } else {
      setReviewThreshold(30);
      setBlockThreshold(70);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Firewall Risk Engine & Security Configuration
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure risk classification boundaries, perimeter policies, and downstream agent guardrails.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs cursor-pointer shadow-md shadow-cyan-600/20"
        >
          {saved ? <Check className="w-4 h-4 text-slate-950 font-bold" /> : <Save className="w-4 h-4" />}
          <span>{saved ? 'Saved!' : 'Save Policy'}</span>
        </button>
      </div>

      {/* Threshold Sliders */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 pb-2 border-b border-slate-800">
          Risk Score Action Thresholds (0 – 100)
        </h3>

        {/* Preset Modes */}
        <div className="space-y-2">
          <span className="text-xs text-slate-400 block font-semibold">Firewall Posture Presets:</span>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'balanced', label: 'Balanced SOC (Default)', desc: 'Review ≥ 30, Block ≥ 70' },
              { id: 'strict', label: 'Strict Enterprise', desc: 'Review ≥ 20, Block ≥ 55' },
              { id: 'paranoid', label: 'Zero-Trust Airgap', desc: 'Review ≥ 10, Block ≥ 40' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePreset(p.id)}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                  defenseMode === p.id
                    ? 'bg-cyan-950/40 border-cyan-500 text-cyan-200 ring-1 ring-cyan-500'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-xs font-bold block">{p.label}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">{p.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-amber-400">
                🟡 Sanitize / Review Threshold: {reviewThreshold}
              </span>
              <span className="text-slate-400 font-mono">0 – {reviewThreshold - 1}: Safe (ALLOW)</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              value={reviewThreshold}
              onChange={(e) => setReviewThreshold(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-rose-400">
                🔴 Malicious / Block Threshold: {blockThreshold}
              </span>
              <span className="text-slate-400 font-mono">
                {reviewThreshold} – {blockThreshold - 1}: Suspicious (SANITIZE / REVIEW)
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              value={blockThreshold}
              onChange={(e) => setBlockThreshold(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Safe Tool Simulation & Agent Policy */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
            <div>
              <span className="text-xs font-bold text-white block">
                Safe Tool Abuse Perimeter Interception
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Simulate and intercept destructive commands (rm -rf, delete files) safely without executing.
              </span>
            </div>
            <input
              type="checkbox"
              checked={safeToolSimulation}
              onChange={(e) => setSafeToolSimulation(e.target.checked)}
              className="h-4 w-4 accent-cyan-500 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
