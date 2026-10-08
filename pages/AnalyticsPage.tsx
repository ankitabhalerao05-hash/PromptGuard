import React, { useState, useEffect } from 'react';
import { BarChart3, ShieldCheck, AlertTriangle, ShieldAlert, TrendingUp, Layers, PieChart } from 'lucide-react';
import { AnalyticsSummary } from '../types';
import { fetchAnalytics } from '../services/api';

export const AnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);

  useEffect(() => {
    fetchAnalytics()
      .then((data) => setAnalytics(data))
      .catch((err) => console.error('Failed to load analytics:', err));
  }, []);

  if (!analytics) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-xs">
        Loading Perimeter Telemetry Analytics...
      </div>
    );
  }

  // Calculate percentages
  const safePercent = analytics.total_scans > 0 ? Math.round((analytics.safe_inputs / analytics.total_scans) * 100) : 0;
  const suspPercent = analytics.total_scans > 0 ? Math.round((analytics.suspicious_inputs / analytics.total_scans) * 100) : 0;
  const blockPercent = analytics.total_scans > 0 ? Math.round((analytics.blocked_inputs / analytics.total_scans) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Perimeter Defense Analytics & Telemetry
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time statistical synthesis of prompt injection attempts, attack frequencies, and threat distribution.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-slate-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <span>Active Monitor:</span>
          <span className="text-emerald-400 font-bold">100% Perimeter Guarded</span>
        </div>
      </div>

      {/* 4 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Scans */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/70 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Ingestions
            </span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{analytics.total_scans}</div>
          <div className="text-[11px] text-slate-400 mt-1">Across all 6 input pipelines</div>
        </div>

        {/* Blocked Inputs */}
        <div className="p-4 rounded-xl border border-rose-900/60 bg-rose-950/20 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-rose-300 uppercase tracking-wider">
              Neutralized / Blocked
            </span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-rose-400 font-mono">
            {analytics.blocked_inputs}{' '}
            <span className="text-xs text-rose-300 font-normal">({blockPercent}%)</span>
          </div>
          <div className="text-[11px] text-rose-300/80 mt-1">0 Malicious payloads executed</div>
        </div>

        {/* Suspicious Sanitized */}
        <div className="p-4 rounded-xl border border-amber-900/60 bg-amber-950/20 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
              Sanitized / Review
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400 font-mono">
            {analytics.suspicious_inputs}{' '}
            <span className="text-xs text-amber-300 font-normal">({suspPercent}%)</span>
          </div>
          <div className="text-[11px] text-amber-300/80 mt-1">Instructions stripped, data kept</div>
        </div>

        {/* Safe Inputs */}
        <div className="p-4 rounded-xl border border-emerald-900/60 bg-emerald-950/20 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
              Verified Benign
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">
            {analytics.safe_inputs}{' '}
            <span className="text-xs text-emerald-300 font-normal">({safePercent}%)</span>
          </div>
          <div className="text-[11px] text-emerald-300/80 mt-1">Direct pass-through to agent</div>
        </div>
      </div>

      {/* Middle Row: Attack Category Distribution & Posture Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Attack Category Breakdown (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-cyan-400" />
              Attack Category Distribution (All 9 Monitored)
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              Top: <strong className="text-rose-400">{analytics.most_common_attack}</strong>
            </span>
          </div>

          <div className="space-y-3">
            {Object.entries(analytics.attack_distribution).map(([cat, count]) => {
              const pct = analytics.total_scans > 0 ? Math.round((count / analytics.total_scans) * 100) : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-200">{cat}</span>
                    <span className="text-slate-400 font-mono">
                      {count} incidents ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-500"
                      style={{ width: `${Math.max(5, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Input Pipeline Distribution & Posture (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Input Pipeline Breakdown
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              Avg Threat: {analytics.avg_risk_score}/100
            </span>
          </div>

          <div className="space-y-3">
            {Object.entries(analytics.source_distribution).map(([source, count]) => {
              const pct = analytics.total_scans > 0 ? Math.round((count / analytics.total_scans) * 100) : 0;
              return (
                <div key={source} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-200">{source}</span>
                    <span className="text-slate-400 font-mono">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-400"
                      style={{ width: `${Math.max(5, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Threat Summary Box */}
          <div className="mt-4 p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
            <span className="font-bold text-cyan-400 block text-[11px] uppercase">
              Firewall Defense Summary
            </span>
            <p className="text-[11px] leading-relaxed text-slate-400">
              The PromptGuard AI firewall has quarantined all high-risk instruction injection vectors across user inputs, third-party PDFs, OCR vision text, and web endpoints. Zero unauthorized tool or shell executions recorded.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
