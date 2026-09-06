import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  ArrowRight,
  Send,
  Loader2,
  CheckCircle2,
  Calendar,
  IndianRupee,
  Layers,
  Sliders,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import { BuyerIntent } from '../types';
import { api } from '../lib/api';

interface BuyerAgentProps {
  onDealCreated: (dealId: string) => void;
  onNavigate: (path: string) => void;
}

export const BuyerAgent: React.FC<BuyerAgentProps> = ({ onDealCreated, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [isCreatingDeal, setIsCreatingDeal] = useState(false);
  const [extractedIntent, setExtractedIntent] = useState<BuyerIntent | null>(null);
  const [error, setError] = useState<string>('');

  const suggestedPrompts = [
    'I need 5 corporate gift boxes under ₹8,500.',
    'I need a laptop bag under ₹2,000.',
    'I want 10 employee welcome kits delivered within 3 days.',
    'I need 8 thermal water bottles under ₹4,500 for our wellness program.',
  ];

  const handleParse = async (textToParse?: string) => {
    const text = (textToParse || query).trim();
    if (!text) return;
    setIsParsing(true);
    setError('');
    setExtractedIntent(null);

    try {
      const intent = await api.parseIntent(text);
      setExtractedIntent(intent);
    } catch (err: any) {
      setError(err.message || 'Failed to extract structured intent');
    } finally {
      setIsParsing(false);
    }
  };

  const handleSendToMerchant = async () => {
    if (!extractedIntent) return;
    setIsCreatingDeal(true);
    setError('');

    try {
      const deal = await api.createDeal(extractedIntent);
      onDealCreated(deal.id);
      onNavigate('/deal-room');
    } catch (err: any) {
      setError(err.message || 'Failed to dispatch to Merchant Agent');
    } finally {
      setIsCreatingDeal(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
          <Bot className="w-3.5 h-3.5" />
          <span>Autonomous Procurement Proxy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">AI BUYER AGENT</h1>
        <p className="text-base sm:text-lg font-medium text-slate-600 mt-1">“Tell me what you want to buy.”</p>
        <p className="text-xs text-slate-500 max-w-lg mx-auto mt-2">
          State your requirements, quantity, budget ceiling, or delivery timeframe. The AI Buyer extracts structured
          intent and initiates agent-to-agent negotiation.
        </p>
      </div>

      {/* Main Conversational Interface */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Natural Language Buyer Request
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. I need 5 corporate gift boxes under ₹8,500 with custom packaging within 3 days..."
              className="w-full border border-slate-300 rounded-xl p-4 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleParse();
                }
              }}
            />
            <button
              type="button"
              onClick={() => handleParse()}
              disabled={isParsing || !query.trim()}
              id="buyer-parse-intent-btn"
              className="absolute bottom-3 right-3 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer shadow-xs"
            >
              {isParsing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Parsing Intent...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Extract Intent</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Suggested Prompts */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Suggested Hackathon Scenarios
          </span>
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setQuery(prompt);
                  handleParse(prompt);
                }}
                className="text-xs bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-900 px-3 py-1.5 rounded-lg text-left transition-colors cursor-pointer"
              >
                “{prompt}”
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
            {error}
          </div>
        )}

        {/* Extracted Intent Card */}
        {extractedIntent && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  STRUCTURED PURCHASE INTENT
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">ID: {extractedIntent.id}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Product</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{extractedIntent.product || 'Standard Product'}</p>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Quantity</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{extractedIntent.quantity ?? 1} units</p>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Maximum Budget</span>
                <p className="text-sm font-extrabold text-emerald-700 mt-0.5">
                  ₹{(extractedIntent.maxBudget ?? 0).toLocaleString()}
                </p>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Delivery Time</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">Within {extractedIntent.deliveryDays ?? 3} days</p>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1.5">
                Preferences & Attributes Detected
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(extractedIntent.preferences || []).map((pref, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-800 text-[11px] font-semibold rounded-md"
                  >
                    {pref}
                  </span>
                ))}
              </div>
            </div>

            {/* Action to dispatch to Deal Room */}
            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Strict budget ceiling will be defended by AI Buyer in Deal Room</span>
              </div>

              <button
                type="button"
                onClick={handleSendToMerchant}
                disabled={isCreatingDeal}
                id="send-to-merchant-btn"
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer shadow-md disabled:opacity-50"
              >
                {isCreatingDeal ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Contacting Merchant Agent...</span>
                  </>
                ) : (
                  <>
                    <span>Send to Merchant Agent</span>
                    <ArrowRight className="w-4 h-4 text-amber-300" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
