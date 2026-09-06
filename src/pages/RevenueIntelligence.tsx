import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Award,
  Zap,
  CheckCircle2,
  DollarSign,
  Layers,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { RevenueMetrics } from '../types';
import { api } from '../lib/api';

export const RevenueIntelligence: React.FC = () => {
  const [metrics, setMetrics] = useState<RevenueMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const data = await api.getRevenueMetrics();
      setMetrics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleApprove = async (id: string) => {
    await api.approveRecommendation(id);
    fetchMetrics();
  };

  if (loading || !metrics) {
    return (
      <div className="py-24 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
          Calculating Revenue Intelligence Models...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-2">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Algorithmic Yield Maximization</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Revenue Optimization Engine
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
          Unlike standard discount bots that destroy gross margins, the AI Merchant Agent calculates bundle margins,
          customer budget elasticity, and inventory velocity to maximize total transaction expected value.
        </p>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Revenue</span>
          <p className="text-xl font-extrabold text-slate-900 mt-1">₹{(metrics.totalRevenue ?? 0).toLocaleString()}</p>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 block">Live Settled</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Avg Order Value</span>
          <p className="text-xl font-extrabold text-indigo-700 mt-1">₹{(metrics.averageOrderValue ?? 0).toLocaleString()}</p>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 block">+32.9% Uplift</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Upsell Revenue</span>
          <p className="text-xl font-extrabold text-purple-700 mt-1">₹{(metrics.upsellRevenue ?? 0).toLocaleString()}</p>
          <span className="text-[10px] text-purple-600 font-bold mt-1 block">High-Margin Add-ons</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Cross-Sell</span>
          <p className="text-xl font-extrabold text-amber-700 mt-1">₹{(metrics.crossSellRevenue ?? 0).toLocaleString()}</p>
          <span className="text-[10px] text-amber-600 font-bold mt-1 block">Related Catalog Items</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Recovered Deals</span>
          <p className="text-xl font-extrabold text-teal-700 mt-1">₹{(metrics.recoveredRevenue ?? 0).toLocaleString()}</p>
          <span className="text-[10px] text-teal-600 font-bold mt-1 block">Saved from Bounce</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Conversion Rate</span>
          <p className="text-xl font-extrabold text-slate-900 mt-1">{metrics.conversionRate ?? 0}%</p>
          <span className="text-[10px] text-indigo-600 font-bold mt-1 block">Agentic Flow</span>
        </div>
      </div>

      {/* AI Recommendations Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">AI Revenue Recommendations</h3>
              <p className="text-xs text-slate-500">
                Machine-identified merchant bundle pairings that increase revenue without sacrificing policy constraints.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-500">Autonomous Model V2</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(metrics.opportunities || []).map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900 text-xs">{rec.title}</span>
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                    {rec.impact}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{rec.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">Status: {rec.status}</span>
                {rec.status === 'ACTIVE' ? (
                  <button
                    onClick={() => handleApprove(rec.id)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1 rounded-md text-xs transition-colors cursor-pointer shadow-xs"
                  >
                    Approve Recommendation
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Enforced</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Core Architectural Contrast: Why this engine wins */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Merchant Growth Doctrine</span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Why AI Deal Room Increases Merchant Revenue
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Standard ecommerce chatbots are destructive to bottom-line profitability. AI Deal Room replaces discount bots
            with revenue-maximizing optimization agents.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-4 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-900 text-indigo-300 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Intent-Driven Bundling</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Discovers what the buyer needs (e.g. corporate gifts for 5 recipients) and constructs higher-value packages
              (packaging + cards) instead of selling bare SKUs.
            </p>
          </div>

          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-4 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-900 text-indigo-300 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Zero Hallucination Guardrails</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Strict mathematical boundaries prevent selling below the merchant's margin floor (e.g. ₹1,000 min margin)
              or giving more than max allowed discount (e.g. 8%).
            </p>
          </div>

          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-4 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-900 text-indigo-300 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Counter-Offer Retention</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              When a buyer has a budget constraint (e.g. ₹8,500), the agent swaps variable costs (e.g. express shipping)
              rather than slashing product margins.
            </p>
          </div>

          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-4 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-900 text-indigo-300 flex items-center justify-center font-bold text-sm">
              4
            </div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Explicit Trust Gate</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Buyers convert with higher confidence because money is never moved autonomously. Explicit approval creates
              safety, reducing checkout abandonment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
