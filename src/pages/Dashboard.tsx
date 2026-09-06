import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Info,
  Clock,
  Zap,
} from 'lucide-react';
import { RevenueMetrics } from '../types';
import { api } from '../lib/api';

interface DashboardProps {
  onNavigate: (path: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [metrics, setMetrics] = useState<RevenueMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [opportunitySuccess, setOpportunitySuccess] = useState<string | null>(null);

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

  const handleApproveOpportunity = async (id: string, title: string) => {
    try {
      await api.approveRecommendation(id);
      setOpportunitySuccess(`"${title}" approved and active in negotiation parameters.`);
      setTimeout(() => setOpportunitySuccess(null), 4000);
      fetchMetrics();
    } catch (e) {
      console.error(e);
    }
  };

  // Structured opportunities requested:
  // - Premium Bundle Opportunity (Potential additional value: ₹600)
  // - Upsell Opportunity (Potential additional value: ₹350)
  // - Cross-sell Opportunity (Potential additional value: ₹450)
  const opportunities = [
    {
      id: 'opp-bundle-1',
      title: 'Premium Bundle Opportunity',
      type: 'Bundle Optimization',
      value: 600,
      reason: 'Pair corporate gift boxes with custom satin packaging and branded cards to increase average basket size.',
      actionText: 'Activate in Deal Room',
    },
    {
      id: 'opp-upsell-2',
      title: 'Upsell Opportunity',
      type: 'Executive Tier',
      value: 350,
      reason: 'Offer executive metallic finish upgrades when buyer budget headroom exceeds base cart price.',
      actionText: 'Activate in Deal Room',
    },
    {
      id: 'opp-cross-3',
      title: 'Cross-sell Opportunity',
      type: 'Productivity Add-on',
      value: 450,
      reason: 'Recommend ergonomic dual-mode mice for laptop bag and onboarding kit procurement inquiries.',
      actionText: 'Activate in Deal Room',
    },
  ];

  if (loading && !metrics) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-medium">Loading Dashboard Data...</p>
      </div>
    );
  }

  // 4 Primary Metrics as strictly requested:
  // Total Revenue, AI-Assisted Revenue, Average Order Value, Upsell Revenue
  const totalRev = metrics?.totalRevenue ?? 34250;
  const aiRev = metrics?.aiAssistedRevenue ?? 26800;
  const aov = metrics?.averageOrderValue ?? 5700;
  const upsellRev = metrics?.upsellRevenue ?? 4950;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Merchant Dashboard</h1>
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-200">
              DEMO DATA
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time merchant revenue tracking, AI bundle uplift, and autonomous opportunity discovery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/deal-room')}
            id="dash-deal-room-cta"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Open AI Deal Room</span>
          </button>
        </div>
      </div>

      {opportunitySuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{opportunitySuccess}</span>
        </div>
      )}

      {/* 4 PRIMARY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Revenue */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-600">Total Revenue</span>
            <div className="p-1.5 bg-slate-100 rounded-md text-slate-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            ₹{totalRev.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">
            Cumulative store transaction volume
          </p>
        </div>

        {/* Metric 2: AI-Assisted Revenue */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-600">AI-Assisted Revenue</span>
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            ₹{aiRev.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">
            Revenue closed through agent negotiations
          </p>
        </div>

        {/* Metric 3: Average Order Value */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-600">Average Order Value (AOV)</span>
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            ₹{aov.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">
            Average transaction basket size
          </p>
        </div>

        {/* Metric 4: Upsell Revenue */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-600">Upsell Revenue</span>
            <div className="p-1.5 bg-purple-50 text-purple-600 rounded-md">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            ₹{upsellRev.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">
            Added value from bundles & accessories
          </p>
        </div>
      </div>

      {/* ONE CLEAN REVENUE CHART */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Transaction Revenue Over Time</h2>
            <p className="text-xs text-slate-500">
              Comparison of baseline cart value vs. optimized AI deal settlement.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-blue-600 inline-block"></span>
              <span className="text-slate-600">AI Optimized Settlement</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-slate-200 inline-block"></span>
              <span className="text-slate-600">Initial Cart Value</span>
            </div>
          </div>
        </div>

        {/* Clean Responsive SVG Chart */}
        <div className="h-48 w-full pt-4">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 600 140" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="0" y1="20" x2="600" y2="20" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="60" x2="600" y2="60" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="100" x2="600" y2="100" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="135" x2="600" y2="135" stroke="#e2e8f0" strokeWidth="1" />

            {/* Base cart area/line (Grey) */}
            <polygon
              points="20,110 110,105 200,95 290,100 380,85 470,90 560,75 560,135 20,135"
              fill="#f8fafc"
            />
            <polyline
              points="20,110 110,105 200,95 290,100 380,85 470,90 560,75"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* AI optimized revenue line (Blue) */}
            <polygon
              points="20,95 110,80 200,65 290,70 380,50 470,45 560,30 560,135 20,135"
              fill="url(#blueGradient)"
              opacity="0.25"
            />
            <polyline
              points="20,95 110,80 200,65 290,70 380,50 470,45 560,30"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2.5"
            />

            {/* Data points */}
            {[
              { x: 20, y: 95, val: '₹6.2k' },
              { x: 110, y: 80, val: '₹7.5k' },
              { x: 200, y: 65, val: '₹8.4k' },
              { x: 290, y: 70, val: '₹8.1k' },
              { x: 380, y: 50, val: '₹9.8k' },
              { x: 470, y: 45, val: '₹10.5k' },
              { x: 560, y: 30, val: '₹12.2k' },
            ].map((pt, i) => (
              <g key={i}>
                <circle cx={pt.x} cy={pt.y} r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                <text
                  x={pt.x}
                  y={pt.y - 10}
                  textAnchor="middle"
                  className="text-[9px] fill-slate-500 font-semibold"
                >
                  {pt.val}
                </text>
              </g>
            ))}

            <defs>
              <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="flex justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 font-medium">
          <span>Day 1</span>
          <span>Day 2</span>
          <span>Day 3</span>
          <span>Day 4</span>
          <span>Day 5</span>
          <span>Day 6</span>
          <span>Latest Deal</span>
        </div>
      </div>

      {/* SECTION: AI REVENUE OPPORTUNITIES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">AI REVENUE OPPORTUNITIES</h2>
            <p className="text-xs text-slate-500">
              High-margin opportunities discovered by the AI based on buyer inquiry patterns.
            </p>
          </div>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
            3 Active Opportunities
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-300 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {opp.type}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-600">
                    +₹{(opp.value ?? 0).toLocaleString()}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{opp.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{opp.reason}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500">
                  Potential Value: <strong className="text-slate-800">₹{opp.value}</strong>
                </span>
                <button
                  onClick={() => onNavigate('/deal-room')}
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  <span>Apply</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
