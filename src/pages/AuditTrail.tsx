import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { AuditEvent } from '../types';
import { api } from '../lib/api';

export const AuditTrail: React.FC = () => {
  const [logs, setLogs] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedActor, setSelectedActor] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await api.getAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const actors = [
    'All',
    'AI_BUYER',
    'AI_MERCHANT',
    'POLICY_GUARD',
    'BUYER_HUMAN',
    'RAZORPAY_GATEWAY',
    'ORDER_SERVICE',
  ];

  const filteredLogs = logs.filter((log) => {
    const matchesActor = selectedActor === 'All' || log.actor === selectedActor;
    const matchesSearch =
      !searchQuery.trim() ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.dealId && log.dealId.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesActor && matchesSearch;
  });

  const getActorBadge = (actor: string) => {
    switch (actor) {
      case 'AI_BUYER':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'AI_MERCHANT':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'POLICY_GUARD':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'BUYER_HUMAN':
        return 'bg-slate-900 text-white border-slate-900';
      case 'RAZORPAY_GATEWAY':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getResultBadge = (result: string) => {
    switch (result) {
      case 'APPROVED':
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            {result}
          </span>
        );
      case 'REJECTED':
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[10px] font-bold">
            <XCircle className="w-3 h-3 text-rose-600" />
            {result}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold">
            <Clock className="w-3 h-3 text-slate-500" />
            {result}
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
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Audit Trail</h1>
            <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded">
              Tamper-Evident Ledger
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Chronological, immutable event timeline of agent interactions, policy validations, and payment settlements.
          </p>
        </div>

        <button
          onClick={loadLogs}
          className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Refresh Events</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter audit events by action, reason, or deal ID..."
            className="w-full pl-9 pr-3 py-1.5 text-xs text-slate-800 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {actors.map((act) => (
            <button
              key={act}
              onClick={() => setSelectedActor(act)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedActor === act
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {act.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* CHRONOLOGICAL TIMELINE TABLE AS REQUESTED IN SECTION 13:
          Timestamp | Actor | Action | Reason | Result */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Reason & Justification</th>
                <th className="py-3 px-4 text-center">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Loading audit events...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No audit events matched your filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                      {new Date(log.timestamp).toLocaleTimeString()} ({new Date(log.timestamp).toLocaleDateString()})
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getActorBadge(
                          log.actor
                        )}`}
                      >
                        {log.actor.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {log.action}
                    </td>
                    <td className="py-3.5 px-4 max-w-md text-slate-600 leading-relaxed text-[11px]">
                      {log.reason}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {getResultBadge(log.result)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
