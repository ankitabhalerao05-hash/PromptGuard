import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { LiveThreatTicker } from './components/LiveThreatTicker';
import { LandingPage } from './pages/LandingPage';
import { ScannerPage } from './pages/ScannerPage';
import { SimulatorPage } from './pages/SimulatorPage';
import { LogsPage } from './pages/LogsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { SettingsPage } from './pages/SettingsPage';
import { AttackMatrixTable } from './components/AttackMatrixTable';
import { Shield, Terminal } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');

  return (
    <div className="min-h-screen bg-[#05070c] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Real-Time SOC Telemetry Stream */}
      <LiveThreatTicker />

      {/* Top SOC Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'landing' && <LandingPage onNavigate={setActiveTab} />}
        {activeTab === 'scanner' && <ScannerPage />}
        {activeTab === 'simulator' && <SimulatorPage />}
        {activeTab === 'matrix' && (
          <div className="space-y-4 max-w-5xl mx-auto">
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
              <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-5 h-5 text-cyan-400" />
                Global Attack Signature Matrix
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Static and runtime classification rules enforcing continuous defense against all 9 prompt injection attack families.
              </p>
            </div>
            <AttackMatrixTable />
          </div>
        )}
        {activeTab === 'logs' && <LogsPage />}
        {activeTab === 'analytics' && <AnalyticsPage />}
        {activeTab === 'architecture' && <ArchitecturePage />}
        {activeTab === 'settings' && <SettingsPage />}
      </main>

      {/* SOC Operational Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070b14] py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-200">PromptGuard AI</span>
            <span>—</span>
            <span>Agentic Prompt Injection Firewall</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-slate-500 font-mono">ET AI Hackathon – Agentic Edition</span>
            <span className="text-slate-700">|</span>
            <span className="text-cyan-400 font-mono font-semibold">Targets: D2 & F3 (9 Categories Supported)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
