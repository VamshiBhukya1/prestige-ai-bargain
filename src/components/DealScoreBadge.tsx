import React from 'react';
import { Award, TrendingUp, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';

interface DealScoreBadgeProps {
  score?: number;
  reasons?: string[];
  merchantMargin?: number;
}

export const DealScoreBadge: React.FC<DealScoreBadgeProps> = ({
  score = 0,
  reasons = [],
  merchantMargin = 0,
}) => {
  const safeMargin = merchantMargin ?? 0;
  const safeScore = score ?? 0;
  const safeReasons = Array.isArray(reasons) ? reasons : [];
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-4">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
        Revenue Insights
      </h3>

      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-slate-500 font-medium">Deal Score</span>
          <span className="font-bold text-blue-600">{safeScore}/100</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, safeScore))}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <p className="text-[10px] text-slate-500 uppercase font-semibold">Extra Rev</p>
          <p className="text-sm font-bold text-emerald-600">+₹850</p>
        </div>
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <p className="text-[10px] text-slate-500 uppercase font-semibold">Margin</p>
          <p className="text-sm font-bold text-slate-900">
            ₹{safeMargin.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Explainable Decision Drivers */}
      <div className="space-y-1.5 pt-1 border-t border-slate-100">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
          Decision Drivers:
        </span>
        {safeReasons.slice(0, 3).map((r, i) => {
          const isPositive = r.startsWith('+');
          return (
            <div key={i} className="flex items-start gap-1.5 text-xs">
              {isPositive ? (
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <span className={`text-[11px] leading-snug ${isPositive ? 'text-slate-700' : 'text-amber-800'}`}>
                {r.replace(/^[+-]\s*/, '')}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

