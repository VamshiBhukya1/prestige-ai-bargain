import React, { useState } from 'react';
import {
  X,
  CreditCard,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Server,
  Key,
} from 'lucide-react';
import { api } from '../lib/api';

interface SettingsModalProps {
  onClose: () => void;
  onResetComplete: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  onResetComplete,
}) => {
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = async () => {
    setResetting(true);
    try {
      await api.resetDemo();
      setResetSuccess(true);
      setTimeout(() => {
        setResetSuccess(false);
        onResetComplete();
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900">Application Settings</h2>
            <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
              v1.0
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Razorpay Test Mode Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span>Razorpay Test Mode</span>
            </span>
            <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold text-[10px]">
              Active
            </span>
          </div>
          <p className="text-slate-500 leading-relaxed">
            Razorpay Test Key ID is bound safely in the backend. In accordance with security requirements, the Razorpay Secret Key is <strong>never exposed</strong> in frontend code.
          </p>
          <div className="font-mono text-[11px] bg-white p-2 border border-slate-200 rounded text-slate-700">
            Key ID: rzp_test_demo_ai_dealroom (Server-Proxied)
          </div>
        </div>

        {/* Persistence & Database Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Server className="w-4 h-4 text-indigo-600" />
              <span>Database Persistence</span>
            </span>
            <span className="text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded font-bold text-[10px]">
              Active
            </span>
          </div>
          <p className="text-slate-500 leading-relaxed">
            Persistence layer stores users, deals, catalog items, and audit logs. Password hashing uses <code>bcryptjs</code>.
          </p>
        </div>

        {/* Reset Demo State Button */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-800">Reset Demo Data</p>
            <p className="text-[11px] text-slate-500">Restore default demo deals and initial state.</p>
          </div>

          <button
            onClick={handleReset}
            disabled={resetting}
            id="settings-reset-demo-btn"
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-300 hover:border-rose-300 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{resetting ? 'Resetting...' : resetSuccess ? 'Reset!' : 'Reset Demo'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
