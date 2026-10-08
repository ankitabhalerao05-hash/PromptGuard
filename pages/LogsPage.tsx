import React, { useState, useEffect } from 'react';
import { Database, Search, Filter, Download, RefreshCw, Eye, ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';
import { SecurityLogEntry } from '../types';
import { fetchLogs } from '../services/api';

export const LogsPage: React.FC = () => {
  const [logs, setLogs] = useState<SecurityLogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterAction, setFilterAction] = useState<string>('ALL');
  const [selectedEntry, setSelectedEntry] = useState<SecurityLogEntry | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const data = await fetchLogs(100);
      setLogs(data);
    } catch (err) {
      console.error('Failed to load logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.attack_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.input_snippet.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterAction === 'ALL' || log.action === filterAction;
    return matchesSearch && matchesFilter;
  });

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `promptguard_audit_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Live Security Event Audit Trail
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 font-mono">
              {logs.length} Recorded Events
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time perimeter telemetry capturing all intercepted prompt injection attempts, risk scores, and decisions.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={loadLogs}
            disabled={isLoading}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer border border-slate-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={exportJSON}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 text-xs cursor-pointer border border-cyan-800"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit Logs</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-slate-800 bg-slate-900/60">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search events by source, attack type, snippet, or reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <div className="flex rounded-lg bg-slate-950 p-0.5 border border-slate-800 text-xs">
            {['ALL', 'BLOCK', 'SANITIZE / REVIEW', 'ALLOW'].map((act) => (
              <button
                key={act}
                onClick={() => setFilterAction(act)}
                className={`px-2.5 py-1 rounded cursor-pointer font-medium ${
                  filterAction === act
                    ? 'bg-slate-800 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {act}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Security Event Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-[11px] uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Attack Type</th>
                <th className="py-3 px-4 text-center">Risk Score</th>
                <th className="py-3 px-4 text-center">Action</th>
                <th className="py-3 px-4 text-center">Status / Severity</th>
                <th className="py-3 px-4">Snippet Preview</th>
                <th className="py-3 px-4 text-center">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredLogs.map((entry) => {
                let badgeClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
                if (entry.action === 'BLOCK') {
                  badgeClass = 'bg-rose-500/15 text-rose-400 border-rose-500/40';
                } else if (entry.action === 'SANITIZE / REVIEW') {
                  badgeClass = 'bg-amber-500/15 text-amber-400 border-amber-500/40';
                }

                return (
                  <tr key={entry.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {entry.timestamp}
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                        {entry.source}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-200">
                      {entry.attack_type}
                    </td>
                    <td className="py-3 px-4 text-center font-bold">
                      <span
                        className={
                          entry.risk_score >= 70
                            ? 'text-rose-400'
                            : entry.risk_score >= 30
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }
                      >
                        {entry.risk_score}/100
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${badgeClass}`}
                      >
                        {entry.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[11px] font-bold uppercase ${
                          entry.severity === 'Critical'
                            ? 'text-rose-400'
                            : entry.severity === 'High'
                            ? 'text-amber-400'
                            : 'text-slate-400'
                        }`}
                      >
                        {entry.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-400 max-w-xs truncate text-[11px]">
                      {entry.input_snippet}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedEntry(entry)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-cyan-200 cursor-pointer"
                        title="Inspect Forensics"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 font-sans text-xs">
                    No security events matched the current search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forensics Inspection Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Event Forensics: {selectedEntry.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="text-slate-400 hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Source Ingestion</span>
                  <span className="text-white font-bold">{selectedEntry.source}</span>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Risk / Action</span>
                  <span className="text-rose-400 font-bold">
                    {selectedEntry.risk_score}/100 ({selectedEntry.action})
                  </span>
                </div>
              </div>

              <div className="p-3 rounded bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase mb-1">
                  SOC Threat Attribution & Reason
                </span>
                <p className="text-slate-300 font-sans text-xs leading-relaxed">
                  {selectedEntry.reason}
                </p>
              </div>

              <div className="p-3 rounded bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase mb-1">
                  Input Payload Snippet
                </span>
                <p className="text-slate-200 text-xs whitespace-pre-wrap">
                  {selectedEntry.input_snippet}
                </p>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedEntry(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Close Forensics
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
