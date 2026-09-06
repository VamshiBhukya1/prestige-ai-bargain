import React, { useState, useEffect } from 'react';
import {
  Sliders,
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Save,
  RotateCcw,
  Workflow,
  Check,
  Bot,
  Store,
  CreditCard,
  Layers,
} from 'lucide-react';
import { MerchantPolicy } from '../types';
import { api } from '../lib/api';

export const Policies: React.FC = () => {
  const [policy, setPolicy] = useState<MerchantPolicy | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states as requested in Section 8
  const [maxDiscountPercent, setMaxDiscountPercent] = useState<number>(8);
  const [minMarginRupees, setMinMarginRupees] = useState<number>(1000);
  const [maxRounds, setMaxRounds] = useState<number>(3);
  const [maxOrderValue, setMaxOrderValue] = useState<number>(50000);

  const loadPolicy = async () => {
    try {
      setLoading(true);
      const data = await api.getPolicy();
      setPolicy(data);
      setMaxDiscountPercent(data.maxDiscountPercent ?? 8);
      setMinMarginRupees(data.minMarginAmount ?? 1000);
      setMaxRounds(data.maxNegotiationRounds ?? 3);
      setMaxOrderValue(data.maxOrderValue ?? 50000);
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
        requireBuyerApproval: true, // Always locked ON
      });
      setPolicy(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save policy:', err);
    } finally {
      setSaving(false);
    }
  };

  // 8 Strict Safety Invariants
  const invariants = [
    {
      id: 'INV-01',
      title: 'Gross Margin Floor Protection',
      rule: 'Min Profit ≥ ₹1,000 per deal',
      desc: 'Ensures the merchant never sells at an accounting loss. AI offers are instantly blocked if margin breaches this floor.',
    },
    {
      id: 'INV-02',
      title: 'Discount Ceiling Bound',
      rule: 'Max Discount ≤ 8%',
      desc: 'Prevents race-to-the-bottom agent negotiations. Disallow excessive price-cutting.',
    },
    {
      id: 'INV-03',
      title: 'Non-Discountable Add-ons',
      rule: 'Add-on margin intact',
      desc: 'Express courier delivery and custom packaging fees cannot be discounted away during negotiations.',
    },
    {
      id: 'INV-04',
      title: 'Negotiation Circuit Breaker',
      rule: 'Max 3 Rounds',
      desc: 'Guards against infinite bargaining loops and API budget exhaustion.',
    },
    {
      id: 'INV-05',
      title: 'Inventory Reservation Locks',
      rule: 'Live catalog verification',
      desc: 'Checks inventory before proposing bundles to prevent out-of-stock commitments.',
    },
    {
      id: 'INV-06',
      title: 'Mandatory Human Approval Gate',
      rule: 'Human in the loop',
      desc: 'Autonomous agents prepare proposals, but human payment authorization is strictly required.',
    },
    {
      id: 'INV-07',
      title: 'Razorpay Cryptographic Binding',
      rule: 'Server-side order amount',
      desc: 'Client amounts are discarded. Razorpay order amount is calculated solely by backend from validated deals.',
    },
    {
      id: 'INV-08',
      title: 'Idempotency & Duplicate Prevention',
      rule: 'Single execution guarantee',
      desc: 'Ensures no duplicate payments can ever occur if network drops or failures are simulated.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Policies & Safety Guardrails</h1>
            <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded">
              8 Invariants Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure merchant business limits, discount floors, and inspect hard-coded architectural safety invariants.
          </p>
        </div>

        <button
          onClick={loadPolicy}
          className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset to Defaults</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Merchant policy updated successfully and enforced across active deal rooms.</span>
        </div>
      )}

      {/* SECTION 1: MERCHANT POLICY SETTINGS (Section 8) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Merchant Policy Parameters</h2>
            <p className="text-xs text-slate-500">
              The AI Merchant Agent is mathematically constrained to stay within these parameters.
            </p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Real-Time Enforcement
          </span>
        </div>

        <form onSubmit={handleSavePolicy} className="space-y-5 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Setting 1: Maximum Discount */}
            <div className="space-y-1.5 bg-slate-50 p-4 rounded-lg border border-slate-200/80">
              <div className="flex justify-between">
                <label className="font-bold text-slate-800">Maximum Discount</label>
                <span className="font-extrabold text-blue-600">{maxDiscountPercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="1"
                value={maxDiscountPercent}
                onChange={(e) => setMaxDiscountPercent(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">
                Current policy default: <strong>8%</strong>. AI cannot exceed this discount under any circumstance.
              </p>
            </div>

            {/* Setting 2: Minimum Margin */}
            <div className="space-y-1.5 bg-slate-50 p-4 rounded-lg border border-slate-200/80">
              <div className="flex justify-between">
                <label className="font-bold text-slate-800">Minimum Margin (₹)</label>
                <span className="font-extrabold text-emerald-600">₹{(minMarginRupees ?? 0).toLocaleString()}</span>
              </div>
              <input
                type="number"
                min="0"
                step="100"
                value={minMarginRupees}
                onChange={(e) => setMinMarginRupees(Number(e.target.value))}
                className="w-full p-2 border border-slate-200 bg-white rounded-lg outline-none font-bold text-slate-900"
              />
              <p className="text-[11px] text-slate-500">
                Guaranteed minimum merchant profit per transaction. Deals with lower margin are blocked.
              </p>
            </div>

            {/* Setting 3: Maximum Negotiation Rounds */}
            <div className="space-y-1.5 bg-slate-50 p-4 rounded-lg border border-slate-200/80">
              <div className="flex justify-between">
                <label className="font-bold text-slate-800">Maximum Negotiation Rounds</label>
                <span className="font-extrabold text-indigo-600">{maxRounds} Rounds</span>
              </div>
              <input
                type="number"
                min="1"
                max="10"
                value={maxRounds}
                onChange={(e) => setMaxRounds(Number(e.target.value))}
                className="w-full p-2 border border-slate-200 bg-white rounded-lg outline-none font-bold text-slate-900"
              />
              <p className="text-[11px] text-slate-500">
                Limits conversational turns between AI Buyer and AI Merchant to 3 rounds.
              </p>
            </div>

            {/* Setting 4: Maximum Order Value */}
            <div className="space-y-1.5 bg-slate-50 p-4 rounded-lg border border-slate-200/80">
              <div className="flex justify-between">
                <label className="font-bold text-slate-800">Maximum Order Value</label>
                <span className="font-extrabold text-slate-900">₹{(maxOrderValue ?? 0).toLocaleString()}</span>
              </div>
              <input
                type="number"
                min="5000"
                step="5000"
                value={maxOrderValue}
                onChange={(e) => setMaxOrderValue(Number(e.target.value))}
                className="w-full p-2 border border-slate-200 bg-white rounded-lg outline-none font-bold text-slate-900"
              />
              <p className="text-[11px] text-slate-500">
                Single transaction ceiling limit for standard agentic settlement flow (₹50,000).
              </p>
            </div>
          </div>

          {/* Setting 5: Buyer Approval Required (LOCKED ON) */}
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Buyer Approval Required</h3>
                <p className="text-[11px] text-slate-600">
                  AI must NEVER automatically trigger payments. Human buyer must explicitly approve the final deal.
                </p>
              </div>
            </div>
            <span className="bg-blue-600 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              LOCKED ON
            </span>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Update Policy Parameters'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 2: SAFETY INVARIANTS & GUARDRAILS (Embedded directly as requested) */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">System Safety Invariants</h2>
          <p className="text-xs text-slate-500">
            Immutable safety rules enforced by the backend orchestrator before any deal can reach settlement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {invariants.map((inv) => (
            <div
              key={inv.id}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2 hover:border-blue-200 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {inv.id}
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>Enforced</span>
                </span>
              </div>
              <h3 className="text-xs font-bold text-slate-900">{inv.title}</h3>
              <div className="text-[11px] font-semibold text-slate-800 bg-slate-50 p-1.5 rounded">
                Constraint: {inv.rule}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{inv.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: SYSTEM ARCHITECTURE (Embedded cleanly as requested) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Workflow className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900">End-to-End Agentic Architecture</h2>
        </div>
        <p className="text-xs text-slate-500">
          How autonomous intent extraction, dual-agent negotiation, policy verification, and Razorpay settlement interface securely:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs pt-2">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
            <span className="text-[10px] font-bold text-blue-600 block uppercase">1. Intent Extraction</span>
            <p className="font-bold text-slate-900">Natural Language</p>
            <p className="text-slate-500 text-[11px]">Extracts quantity, budget, delivery days, and category constraints.</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
            <span className="text-[10px] font-bold text-indigo-600 block uppercase">2. Deal Optimization</span>
            <p className="font-bold text-slate-900">Agent Negotiation</p>
            <p className="text-slate-500 text-[11px]">Evaluates bundles, packaging upgrades, and marginal revenue uplift.</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
            <span className="text-[10px] font-bold text-amber-600 block uppercase">3. Policy Invariants</span>
            <p className="font-bold text-slate-900">Backend Validation</p>
            <p className="text-slate-500 text-[11px]">Enforces minimum margin floor (₹1,000) and 8% discount limits.</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
            <span className="text-[10px] font-bold text-emerald-600 block uppercase">4. Human Approval</span>
            <p className="font-bold text-slate-900">Razorpay Test Mode</p>
            <p className="text-slate-500 text-[11px]">Explicit buyer click authorizes cryptographic order creation and settlement.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
