import React from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle, XCircle, Info, Lock } from 'lucide-react';
import { PolicyCheckResult } from '../types';

interface PolicyGuardCardProps {
  policyChecks?: PolicyCheckResult;
  isCompact?: boolean;
}

export const PolicyGuardCard: React.FC<PolicyGuardCardProps> = ({
  policyChecks,
  isCompact = false,
}) => {
  if (!policyChecks) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
        <ShieldCheck className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
        <p className="text-xs text-slate-500 font-medium">
          Policy Guard will validate financial invariants when a deal is generated.
        </p>
      </div>
    );
  }

  const { passed, checks, statusText } = policyChecks;

  return (
    <div
      className={`rounded-xl border transition-all ${
        passed
          ? 'bg-emerald-50/40 border-emerald-200 text-slate-900'
          : 'bg-rose-50/40 border-rose-200 text-slate-900'
      } p-4`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-md flex items-center justify-center ${
              passed ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
            }`}
          >
            {passed ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <span>Policy Guard Safety Layer</span>
              <span className="text-[10px] font-semibold text-slate-500 lowercase">
                ({checks.filter((c) => c.passed).length}/{checks.length} passed)
              </span>
            </h4>
            <p className="text-[11px] font-medium text-slate-500">Autonomous Financial Guardrails</p>
          </div>
        </div>

        <span
          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
            passed
              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
              : 'bg-rose-100 text-rose-800 border-rose-300'
          }`}
        >
          {passed ? 'Gated & Approved' : 'Action Blocked'}
        </span>
      </div>

      {/* Checks list */}
      <div className="mt-3 space-y-2">
        {checks.map((check, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg border text-xs flex items-start gap-2.5 transition-colors ${
              check.passed
                ? 'bg-white/80 border-slate-200/80'
                : 'bg-rose-50 border-rose-200 text-rose-950'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {check.passed ? (
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">{check.rule}</span>
                <span className="text-[10px] text-slate-400 font-mono">{check.policyRef}</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{check.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Status banner */}
      <div
        className={`mt-3 p-2.5 rounded-lg border text-xs font-bold text-center flex items-center justify-center gap-2 ${
          passed
            ? 'bg-emerald-600 text-white border-emerald-700'
            : 'bg-rose-600 text-white border-rose-700'
        }`}
      >
        <Lock className="w-3.5 h-3.5" />
        <span>STATUS: {statusText}</span>
      </div>
    </div>
  );
};
