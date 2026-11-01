import React from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export default function ConfidenceBadge({ confidence }) {
  const score = typeof confidence === 'number' ? confidence : 0;
  const percentage = Math.round(score * 100);
  const isHigh = score >= 0.75;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border shadow-sm transition-all ${
        isHigh
          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-emerald-950/20'
          : 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-amber-950/20'
      }`}
      title={`TinyFish retrieval confidence score: ${(score * 100).toFixed(1)}%`}
    >
      {isHigh ? (
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
      ) : (
        <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
      )}
      <span className="font-mono font-bold">{percentage}%</span>
      <span className="text-[11px] font-normal opacity-90">
        {isHigh ? 'High Confidence' : 'Low Confidence (<75%)'}
      </span>
    </div>
  );
}
