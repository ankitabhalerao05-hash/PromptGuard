import React from 'react';
import {
  Shield,
  Activity,
  Zap,
  Terminal,
  Sliders,
  Database,
  BarChart3,
  Layers,
  Sparkles,
  Home,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'landing', label: 'Overview & Showcase', icon: Home },
    { id: 'scanner', label: 'Firewall & Scanner', icon: Shield },
    { id: 'simulator', label: 'Attack Simulator', icon: Zap },
    { id: 'matrix', label: 'Attack Matrix', icon: Terminal },
    { id: 'logs', label: 'Security Logs', icon: Database },
    { id: 'analytics', label: 'SOC Analytics', icon: BarChart3 },
    { id: 'architecture', label: 'Architecture & D2/F3', icon: Layers },
    { id: 'settings', label: 'Firewall Settings', icon: Sliders },
  ];

  return (
    <header className="border-b border-slate-800/80 bg-[#070b14]/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between py-3 border-b border-slate-800/60">
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab('landing')}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5 text-slate-950 font-bold" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  PromptGuard <span className="gradient-text-cyan">AI</span>
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                  v1.0 SOC
                </span>
              </div>
              <p className="text-xs text-slate-400">Agentic Prompt Injection Firewall</p>
            </div>
          </div>

          {/* Status & Hackathon Badges */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-400 text-xs font-semibold shadow-inner">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>Firewall Active</span>
            </div>

            <div className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-cyan-300 text-xs font-semibold shadow-inner">
              <span className="text-cyan-400 font-bold">🎯 D2</span>
              <span className="text-slate-500">|</span>
              <span className="text-emerald-400 font-bold">🛡️ F3</span>
              <span className="hidden lg:inline text-slate-400 font-normal ml-1">
                (9 Categories)
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 py-2 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
