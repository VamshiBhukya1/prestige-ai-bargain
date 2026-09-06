import React, { useState, useEffect } from 'react';
import {
  Store,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Percent,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Layers,
  BarChart3,
  Sliders,
  Award,
} from 'lucide-react';
import { RevenueMetrics } from '../types';
import { api } from '../lib/api';

interface MerchantDashboardProps {
  onNavigate: (path: string) => void;
}

export const MerchantDashboard: React.FC<MerchantDashboardProps> = ({ onNavigate }) => {
  const [metrics, setMetrics] = useState<RevenueMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const data = await api.getRevenueMetrics();
      setMetrics(data);
    } catch (err) {
      console.error('Failed to load metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleApproveOpportunity = async (id: string) => {
    try {
      await api.approveRecommendation(id);
      fetchMetrics();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !metrics) {
    return (
      <div className="py-24 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
          Loading Merchant Financial Intelligence...
        </p>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Revenue',
      value: `₹${(metrics.totalRevenue ?? 0).toLocaleString()}`,
      sub: '+18.4% vs last period',
      icon: DollarSign,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      label: 'AI-Assisted Revenue',
      value: `₹${(metrics.aiAssistedRevenue ?? 0).toLocaleString()}`,
      sub: `${Math.round(((metrics.aiAssistedRevenue || 0) / (metrics.totalRevenue || 1)) * 100)}% of store revenue`,
      icon: Sparkles,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      label: 'Average Order Value (AOV)',
      value: `₹${(metrics.averageOrderValue ?? 0).toLocaleString()}`,
      sub: 'Base: ₹4,100 → AI: ₹5,450',
      icon: TrendingUp,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      label: 'Upsell Revenue Added',
      value: `₹${(metrics.upsellRevenue ?? 0).toLocaleString()}`,
      sub: 'Generated through AI bundles',
      icon: Layers,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      label: 'Cross-Sell Revenue',
      value: `₹${(metrics.crossSellRevenue ?? 0).toLocaleString()}`,
      sub: 'Compatible catalog add-ons',
      icon: ShoppingBag,
      color: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      label: 'Deals Completed',
      value: (metrics.dealsCompleted ?? 0).toString(),
      sub: 'Agentic negotiations finalized',
      icon: CheckCircle2,
      color: 'bg-slate-50 text-slate-800 border-slate-200',
    },
    {
      label: 'Conversion Rate',
      value: `${metrics.conversionRate ?? 0}%`,
      sub: 'Industry baseline is 12%',
      icon: Percent,
      color: 'bg-teal-50 text-teal-700 border-teal-200',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Merchant Dashboard</h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Demo Merchant Storefront
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time revenue optimization, agentic conversion telemetry, and merchant policy enforcement.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('/safety')}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span>Configure Deal Policy</span>
          </button>

          <button
            onClick={() => onNavigate('/revenue')}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Deep Revenue Intel</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{stat.label}</span>
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{stat.value}</p>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">{stat.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Two Column Section: Revenue Impact Comparison + Active AI Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Traditional vs AI Deal Room Performance */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Revenue Transformation Impact</h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              +32.9% Value Increase
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            By shifting from passive checkout to active agentic bundles, the Merchant Agent captures customer willingness-to-pay while strictly preserving minimum gross margins.
          </p>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-slate-600">
                <span>Traditional Single-Item Checkout (Avg ₹4,100)</span>
                <span>Baseline</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-slate-400 h-3 rounded-full" style={{ width: '60%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-indigo-900">
                <span>AI Deal Room Optimized Bundles (Avg ₹5,450)</span>
                <span className="font-extrabold text-indigo-700">+32.9% AOV</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-3 rounded-full" style={{ width: '88%' }} />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Recovered Abandoned Deals</span>
              <span className="text-base font-bold text-slate-800">₹{(metrics.recoveredRevenue ?? 0).toLocaleString()}</span>
              <p className="text-[10px] text-slate-500 mt-0.5">Through safe budget-matching rounds</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Merchant Policy Guard</span>
              <span className="text-base font-bold text-emerald-700">100% Invariants Kept</span>
              <p className="text-[10px] text-slate-500 mt-0.5">Zero negative-margin sales</p>
            </div>
          </div>
        </div>

        {/* Right: AI Revenue Opportunities */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Active AI Revenue Opportunities</h3>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Auto-Discovered from Intent Logs</span>
          </div>

          <div className="space-y-3">
            {(metrics.opportunities || []).map((opp) => (
              <div
                key={opp.id}
                className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{opp.title}</span>
                    <span
                      className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                        opp.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : opp.status === 'APPLIED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {opp.status}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{opp.description}</p>
                  <div className="text-emerald-700 font-bold text-[11px]">
                    Impact: {opp.impact}
                  </div>
                </div>

                <div className="shrink-0 pt-1">
                  {opp.status === 'ACTIVE' ? (
                    <button
                      onClick={() => handleApproveOpportunity(opp.id)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-2.5 py-1 rounded text-[11px] transition-colors cursor-pointer shadow-xs"
                    >
                      Approve
                    </button>
                  ) : (
                    <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Applied</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
