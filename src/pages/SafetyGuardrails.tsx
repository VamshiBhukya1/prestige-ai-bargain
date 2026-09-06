import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Sliders,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCheck,
  Save,
  RotateCcw,
  Check,
} from 'lucide-react';
import { MerchantPolicy } from '../types';
import { api } from '../lib/api';

export const SafetyGuardrails: React.FC = () => {
  const [policy, setPolicy] = useState<MerchantPolicy | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [maxDiscountPercent, setMaxDiscountPercent] = useState<number>(8);
  const [minMarginRupees, setMinMarginRupees] = useState<number>(1000);
  const [maxRounds, setMaxRounds] = useState<number>(3);
  const [maxOrderValue, setMaxOrderValue] = useState<number>(100000);

  const loadPolicy = async () => {
    try {
      setLoading(true);
      const data = await api.getPolicy();
      setPolicy(data);
      setMaxDiscountPercent(data.maxDiscountPercent);
      setMinMarginRupees(data.minMarginAmount);
      setMaxRounds(data.maxNegotiationRounds);
      setMaxOrderValue(data.maxOrderValue);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPolicy();
  }, []);

  const handleSavePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const updated = await api.updatePolicy({
        maxDiscountPercent: Number(maxDiscountPercent),
        minMarginAmount: Number(minMarginRupees),
        maxNegotiationRounds: Number(maxRounds),
        maxOrderValue: Number(maxOrderValue),
      });
      setPolicy(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Financial Invariants & Autonomous Safety</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Safety, Guardrails & Policy Configuration
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
          The Policy Guard is a non-bypassable validation layer executed on the server before any deal can be presented
          or approved. Merchants set hard boundaries, preventing destructive discounts or rogue financial movements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Policy Configuration Form (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Merchant Deal Policy Parameters</h3>
            </div>
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Policy Updated & Enforced!</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSavePolicy} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Maximum Deal Discount Ceiling (%)
              </label>
              <p className="text-slate-500 mb-1.5 text-[11px]">
                The AI Merchant Agent is forbidden from proposing discounts higher than this percentage, even during counter-offers.
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="1"
                  value={maxDiscountPercent}
                  onChange={(e) => setMaxDiscountPercent(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
                <span className="w-12 text-right font-extrabold text-indigo-700 text-sm">
                  {maxDiscountPercent}%
                </span>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Minimum Merchant Margin Floor (₹)
              </label>
              <p className="text-slate-500 mb-1.5 text-[11px]">
                Deals where Total Offer - COGS drops below this absolute threshold are instantly rejected by Policy Guard rule POL-M-005.
              </p>
              <div className="relative">
                <span className="absolute left-3 top-2 font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  value={minMarginRupees}
                  onChange={(e) => setMinMarginRupees(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-1.5 border border-slate-300 rounded-lg font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Maximum Rounds</label>
                <p className="text-slate-500 mb-1.5 text-[11px]">Prevents infinite negotiation loops.</p>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={maxRounds}
                  onChange={(e) => setMaxRounds(Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-semibold text-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Max Order Value (₹)</label>
                <p className="text-slate-500 mb-1.5 text-[11px]">Single transaction velocity cap.</p>
                <input
                  type="number"
                  value={maxOrderValue}
                  onChange={(e) => setMaxOrderValue(Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-semibold text-slate-800 outline-none"
                />
              </div>
            </div>

            {/* Locked Gate Toggle */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-slate-700" />
                  <span className="font-bold text-slate-900">Require Explicit Human Buyer Approval</span>
                </div>
                <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2 py-0.5 rounded">
                  LOCKED ON
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                By platform architectural mandate, AI agents can never move funds autonomously. The checkout step always requires a real user button click.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                id="save-policy-btn"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5 text-amber-400" />
                <span>{saving ? 'Updating Invariants...' : 'Save & Enforce Policy'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Allowed vs Strictly Restricted (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100">
              Autonomous Action Matrix
            </h3>

            <div>
              <h4 className="text-xs font-bold text-emerald-800 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Allowed Autonomous Actions</span>
              </h4>
              <ul className="space-y-1.5 text-[11px] text-slate-600">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>Discover and assemble multi-product bundles from catalog</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>Suggest compatible add-ons (cards, custom packaging)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>Offer bounded discounts within merchant policy cap (&le;8%)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>Adjust shipping SLA to meet strict buyer budget deadlines</span>
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold text-rose-800 mb-2 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Strictly Forbidden Actions (Enforced by Policy Guard)</span>
              </h4>
              <ul className="space-y-1.5 text-[11px] text-slate-600">
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold">✗</span>
                  <span>Autonomous payment execution without human click</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold">✗</span>
                  <span>Selling below merchant cost or breaching margin floor (&lt;₹1,000)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold">✗</span>
                  <span>Hallucinating unverified inventory or fake products</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold">✗</span>
                  <span>Unbounded negotiation exceeding 3 conversation rounds</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold">✗</span>
                  <span>Blind retries or duplicate charges on failed transactions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
