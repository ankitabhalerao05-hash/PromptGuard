import React from 'react';
import { AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';

interface RiskGaugeProps {
  score: number;
  confidence: number;
  severity: string;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score, confidence, severity }) => {
  // Gauge color determination
  let color = '#10b981'; // emerald
  let glowColor = 'rgba(16, 185, 129, 0.3)';
  let label = 'SAFE';

  if (score >= 70) {
    color = '#f43f5e'; // rose/crimson
    glowColor = 'rgba(244, 63, 94, 0.4)';
    label = 'MALICIOUS / CRITICAL';
  } else if (score >= 30) {
    color = '#f59e0b'; // amber
    glowColor = 'rgba(245, 158, 11, 0.35)';
    label = 'SUSPICIOUS / REVIEW';
  }

  // Calculate arc stroke offset for SVG circle
  // Radius = 60, circumference = 2 * PI * 60 = ~377
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-900/60 rounded-xl border border-slate-800">
      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* SVG Circular Progress */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke="#1e293b"
            strokeWidth="10"
            fill="transparent"
          />
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke={color}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 0.8s ease-out, stroke 0.4s ease',
              filter: `drop-shadow(0 0 8px ${glowColor})`,
            }}
          />
        </svg>

        {/* Center Score & Title */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
            {score}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
            / 100 Risk
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="w-full mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-around text-xs">
        <div className="text-center">
          <span className="text-slate-400 block text-[10px] uppercase">Confidence</span>
          <span className="text-slate-200 font-mono font-bold">{Math.round(confidence * 100)}%</span>
        </div>
        <div className="h-6 w-px bg-slate-800" />
        <div className="text-center">
          <span className="text-slate-400 block text-[10px] uppercase">Severity</span>
          <span
            className="font-bold text-[11px] uppercase"
            style={{ color }}
          >
            {severity}
          </span>
        </div>
        <div className="h-6 w-px bg-slate-800" />
        <div className="text-center">
          <span className="text-slate-400 block text-[10px] uppercase">Posture</span>
          <span className="text-slate-200 font-bold text-[11px]">{label.split(' ')[0]}</span>
        </div>
      </div>
    </div>
  );
};
