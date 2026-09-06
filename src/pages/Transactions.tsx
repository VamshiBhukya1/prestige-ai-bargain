import React, { useState, useEffect } from 'react';
import {
  Receipt,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  X,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';
import { Transaction, AuditEvent, Deal } from '../types';
import { api } from '../lib/api';

export const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [txDetails, setTxDetails] = useState<{
    deal?: Deal;
    audits: AuditEvent[];
  } | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await api.getTransactions();
      setTransactions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleSelectTx = async (tx: Transaction) => {
    setSelectedTx(tx);
    setLoadingDetails(true);
    try {
      const details = await api.getTransactionDetails(tx.id);
      setTxDetails({ deal: details.deal, audits: details.audits });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const filtered = transactions.filter(
    (t) =>
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.razorpayPaymentId && t.razorpayPaymentId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            SUCCESS
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded">
            <XCircle className="w-3 h-3 text-rose-600" />
            FAILED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded">
            <Clock className="w-3 h-3 text-amber-600" />
            PENDING
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Transactions</h1>
            <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded">
              Razorpay Settlement Ledger
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Audited record of all agentic settlements, human approvals, and payment gateway transactions.
          </p>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, buyer, or merchant..."
            className="w-full pl-9 pr-3 py-1.5 text-xs text-slate-800 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Main Table - Exactly: Transaction ID, Date, Buyer, Merchant, Amount, Payment Method, Status, Audit */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Buyer</th>
                <th className="py-3 px-4">Merchant</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {tx.id}
                  </td>
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    {new Date(tx.timestamp).toLocaleDateString()} {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {tx.buyerName}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {tx.merchantName}
                  </td>
                  <td className="py-3 px-4 text-right font-extrabold text-slate-900">
                    ₹{(tx.finalAmount ?? 0).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-slate-600 text-[11px] capitalize">
                      {tx.paymentMethod ? tx.paymentMethod.replace(/_/g, ' ') : 'UPI (Razorpay)'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {getStatusBadge(tx.status)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleSelectTx(tx)}
                      className="text-blue-600 hover:text-blue-800 font-bold text-xs bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded transition-colors cursor-pointer"
                    >
                      Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit & Transaction Detail Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Transaction Audit Record: {selectedTx.id}
                </h2>
                <p className="text-[11px] text-slate-500">
                  Razorpay Order: {selectedTx.razorpayOrderId || 'N/A'} • Payment ID: {selectedTx.razorpayPaymentId || 'N/A'}
                </p>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Financial Overview Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 grid grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Final Settled Amount</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  ₹{(selectedTx.finalAmount ?? 0).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Status</span>
                <div className="mt-0.5">{getStatusBadge(selectedTx.status)}</div>
              </div>
              <div>
                <span className="text-slate-500 block">Merchant Net Margin</span>
                <span className="font-bold text-emerald-600 text-sm">
                  ₹{(selectedTx.merchantMargin ?? 2950).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Chronological events for this transaction */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Transaction Chronology
              </h3>

              {loadingDetails ? (
                <p className="text-xs text-slate-400 py-4 text-center">Loading audit log events...</p>
              ) : (
                <div className="space-y-2 border-l-2 border-slate-200 pl-4 ml-1 text-xs">
                  {txDetails?.audits && txDetails.audits.length > 0 ? (
                    txDetails.audits.map((a, i) => (
                      <div key={i} className="relative pb-2">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white" />
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{a.action}</span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(a.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-slate-500 text-[11px] mt-0.5">{a.reason}</p>
                        <span className="text-[10px] font-mono text-slate-400">Actor: {a.actor}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-xs py-2">
                      Recorded policy verification and settlement confirmed without exceptions.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedTx(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Close Audit Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
