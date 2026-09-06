import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  LogOut,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Package,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { Deal, Order } from '../types';

interface ProfileProps {
  user: { name: string; email: string; phone?: string } | null;
  deals: Deal[];
  orders: Order[];
  onLogout: () => void;
  onResetDemo: () => void;
}

export const Profile: React.FC<ProfileProps> = ({
  user,
  deals,
  orders,
  onLogout,
  onResetDemo,
}) => {
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const totalSavedAcrossOrders = orders.reduce((sum, o) => sum + o.discount, 0);

  const handleReset = async () => {
    setResetting(true);
    try {
      await onResetDemo();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 2000);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Title */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Customer Profile</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your account credentials, shipping defaults, and view deal analytics.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-sm">
              {user?.name ? user.name.charAt(0) : 'A'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  {user?.name || 'Aditi Sharma'}
                </h2>
                <span className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100">
                  Verified Customer
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Prestige Corporate Member since 2024
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 px-4 py-2.5 rounded-xl border border-rose-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 text-xs">
          <div className="flex items-start gap-3">
            <Mail className="w-4 h-4 text-slate-400 mt-0.5" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                Email Address
              </span>
              <span className="font-medium text-slate-800">
                {user?.email || 'customer@demo.com'}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                Contact Phone
              </span>
              <span className="font-medium text-slate-800">
                {user?.phone || '+91 98765 43210'}
              </span>
            </div>
          </div>

          <div className="sm:col-span-2 flex items-start gap-3 pt-2">
            <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                Default Corporate Delivery Address
              </span>
              <span className="font-medium text-slate-800">
                42, Cyber Hub, DLF Phase 2, Gurugram, Haryana - 122002
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Deals Negotiated</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{deals.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">Via AI Sales Assistant</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Orders Completed</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{orders.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">Settled on Razorpay</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Savings</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600">
            ₹{totalSavedAcrossOrders.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Saved from regular catalog price</p>
        </div>
      </div>

      {/* Hackathon Demo Management Panel */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Hackathon Evaluation Demo Tool</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Reset the local store database to initial state (clean 8-product catalog, default demo user, and fresh cart).
            </p>
          </div>

          <button
            onClick={handleReset}
            disabled={resetting}
            className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 disabled:opacity-50 px-4 py-2.5 rounded-xl border border-slate-300 shadow-xs transition-colors shrink-0"
          >
            {resetSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Demo Reset Done</span>
              </>
            ) : (
              <>
                <RotateCcw className={`w-4 h-4 ${resetting ? 'animate-spin' : ''}`} />
                <span>Reset Demo Database</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
