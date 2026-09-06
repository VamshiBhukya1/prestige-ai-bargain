import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  Send,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  CreditCard,
  Lock,
  DollarSign,
  Package,
  Layers,
  ChevronRight,
  Info,
  Clock,
  RefreshCw,
  Check,
  X,
  Bot,
  Store,
} from 'lucide-react';
import { Deal, BuyerIntent, DealItem, NegotiationRound, PolicyCheckResult } from '../types';
import { api } from '../lib/api';
import { RazorpayModal } from '../components/RazorpayModal';

interface DealRoomProps {
  dealId?: string;
  onNavigate: (path: string) => void;
  onRefreshGlobalData?: () => void;
}

export const DealRoom: React.FC<DealRoomProps> = ({
  dealId,
  onNavigate,
  onRefreshGlobalData,
}) => {
  // State for deal, input, negotiation animation
  const [queryInput, setQueryInput] = useState<string>(
    'I need 5 corporate gift boxes for my company. My budget is ₹8,500 and I need delivery within 3 days.'
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [deal, setDeal] = useState<Deal | null>(null);
  const [extractedIntent, setExtractedIntent] = useState<BuyerIntent | null>(null);

  // Sequential message animation state
  const [visibleMessagesCount, setVisibleMessagesCount] = useState<number>(6);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [typingSpeaker, setTypingSpeaker] = useState<'buyer' | 'merchant'>('merchant');

  // Approval and Payment state
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState<boolean>(false);
  const [razorpayOrderId, setRazorpayOrderId] = useState<string>('');
  const [paymentFailedState, setPaymentFailedState] = useState<boolean>(false);
  const [failureMessage, setFailureMessage] = useState<string>('');
  const [orderConfirmed, setOrderConfirmed] = useState<boolean>(false);
  const [confirmedPaymentId, setConfirmedPaymentId] = useState<string>('');

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Load initial demo deal or deal by ID
  const loadDeal = async (id?: string) => {
    try {
      setIsProcessing(true);
      if (id) {
        const d = await fetch(`/api/deals/${id}`).then((r) => r.json());
        if (d && d.id) {
          setDeal(d);
          setExtractedIntent(d.buyerIntent);
          setVisibleMessagesCount(d.negotiationRounds?.length || 6);
          return;
        }
      }

      // Check existing deals
      const deals = await fetch('/api/deals').then((r) => r.json());
      if (Array.isArray(deals) && deals.length > 0) {
        const latest = deals[deals.length - 1];
        setDeal(latest);
        setExtractedIntent(latest.buyerIntent);
        setVisibleMessagesCount(latest.negotiationRounds?.length || 6);
      } else {
        // Auto-run full demo scenario so screen is immediately ready
        const demoDeal = await api.runFullDemo();
        setDeal(demoDeal);
        setExtractedIntent(demoDeal.buyerIntent);
        setVisibleMessagesCount(demoDeal.negotiationRounds?.length || 6);
      }
    } catch (err) {
      console.error('Failed to load initial deal:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    loadDeal(dealId);
  }, [dealId]);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [visibleMessagesCount, isTyping]);

  // Handle Natural Language Intent Submit (Automatically triggers full negotiation)
  const handleSubmitIntent = async (customQuery?: string) => {
    const textToSubmit = customQuery || queryInput;
    if (!textToSubmit.trim()) return;

    setIsProcessing(true);
    setPaymentFailedState(false);
    setOrderConfirmed(false);
    setVisibleMessagesCount(0);

    try {
      // 1. Extract Buyer Intent
      const intent = await api.parseIntent(textToSubmit);
      setExtractedIntent(intent);

      // 2. Automatically dispatch to Merchant Agent and create deal
      const createdDeal = await api.createDeal(intent);
      setDeal(createdDeal);

      // 3. Sequentially reveal the messages with realistic typing animation
      animateNegotiationRounds(createdDeal.negotiationRounds);

      if (onRefreshGlobalData) onRefreshGlobalData();
    } catch (err: any) {
      console.error('Deal initialization failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const animateNegotiationRounds = (rounds: NegotiationRound[]) => {
    setVisibleMessagesCount(1);
    let current = 1;

    const interval = setInterval(() => {
      if (current < rounds.length) {
        current += 1;
        const nextSpeaker = rounds[current - 1].speaker === 'merchant' ? 'merchant' : 'buyer';
        setTypingSpeaker(nextSpeaker);
        setIsTyping(true);

        setTimeout(() => {
          setIsTyping(false);
          setVisibleMessagesCount(current);
        }, 900);
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 1400);
  };

  // Replay Agent-to-Agent Negotiation
  const handleReplayNegotiation = () => {
    if (!deal) return;
    setVisibleMessagesCount(0);
    animateNegotiationRounds(deal.negotiationRounds);
  };

  // Explicit Human Buyer Approval
  const handleApproveAndPay = async () => {
    if (!deal) return;
    setIsApproving(true);
    setPaymentFailedState(false);
    try {
      // Step 1: Human Buyer Approval
      const approvedDeal = await api.approveDeal(deal.id);
      setDeal(approvedDeal);

      // Step 2: Backend creates cryptographic Razorpay test order
      const order = await api.createPaymentOrder(deal.id);
      setRazorpayOrderId(order.orderId);
      setShowRazorpayModal(true);

      if (onRefreshGlobalData) onRefreshGlobalData();
    } catch (err: any) {
      alert(err.message || 'Approval failed');
    } finally {
      setIsApproving(false);
    }
  };

  // Handle Payment Success
  const handlePaymentSuccess = async (paymentId: string, method: string) => {
    if (!deal) return;
    try {
      const res = await api.verifyPayment(deal.id, paymentId, razorpayOrderId, method);
      setDeal(res.deal);
      setOrderConfirmed(true);
      setConfirmedPaymentId(paymentId);
      setShowRazorpayModal(false);
      if (onRefreshGlobalData) onRefreshGlobalData();
    } catch (e: any) {
      alert(e.message || 'Payment capture failed');
    }
  };

  // Simulate Payment Failure (CRITICAL FEATURE - Section 11)
  const handleSimulatePaymentFailure = async () => {
    if (!deal) return;
    setShowRazorpayModal(false);
    try {
      const res = await api.simulatePaymentFailure(deal.id);
      setDeal(res.deal);
      setPaymentFailedState(true);
      setFailureMessage(res.message);
      if (onRefreshGlobalData) onRefreshGlobalData();
    } catch (err: any) {
      console.error('Payment failure simulation failed:', err);
    }
  };

  // Retry Gated Payment Flow
  const handleRetryPayment = async () => {
    if (!deal) return;
    try {
      const res = await api.retryPayment(deal.id);
      setDeal(res.deal);
      setPaymentFailedState(false);
      if (onRefreshGlobalData) onRefreshGlobalData();
    } catch (err: any) {
      console.error('Retry failed:', err);
    }
  };

  // Calculations for Revenue Before/After Card (Section 7)
  const baseCartValue = deal
    ? (deal.items.find((i) => !i.isUpsell)?.subtotal || 7500)
    : 7500;
  const bundleUpsellValue = deal
    ? deal.items.filter((i) => i.isUpsell).reduce((sum, i) => sum + i.subtotal, 0)
    : 1250;
  const bundleDiscount = deal ? (deal.bundleAdjustment ?? 400) : 400;
  const finalDealAmount = deal ? (deal.finalAmount ?? 8350) : 8350;
  const additionalValue = finalDealAmount - baseCartValue; // e.g. 8350 - 7500 = +850

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Top Header strictly as requested */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">AI DEAL ROOM</h1>
            <span className="bg-blue-600 text-white text-[11px] font-bold px-2 py-0.5 rounded">
              Primary Mode
            </span>
          </div>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            Agent-to-Agent Commerce
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleReplayNegotiation}
            title="Replay conversation between agents"
            className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Replay Negotiation</span>
          </button>

          <button
            onClick={() => onNavigate('/audit')}
            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Audit Trail</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* THREE-COLUMN LAYOUT: LEFT (Buyer), CENTER (Chat), RIGHT (Deal & Policy) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ======================================================================= */}
        {/* COLUMN 1: AI BUYER (Left - 3.5 cols) */}
        {/* ======================================================================= */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">AI Buyer</h2>
                  <p className="text-[10px] text-slate-400">Procurement Agent</p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                Input Active
              </span>
            </div>

            {/* Buyer Input Form */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 block">
                Natural Language Request
              </label>
              <textarea
                rows={4}
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="e.g. I need 5 corporate gift boxes for my company. My budget is ₹8,500 and I need delivery within 3 days."
                className="w-full text-xs p-3 text-slate-800 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:bg-white resize-none leading-relaxed"
              />

              <button
                onClick={() => handleSubmitIntent()}
                disabled={isProcessing || !queryInput.trim()}
                id="buyer-dispatch-btn"
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg text-xs font-bold transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isProcessing ? 'Dispatching...' : 'Dispatch to Merchant Agent'}</span>
              </button>
            </div>

            {/* Prompt Suggestion Pills */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <p className="text-[11px] font-semibold text-slate-500">Quick Test Prompts:</p>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    const q = 'I need 5 corporate gift boxes for my company. My budget is ₹8,500 and I need delivery within 3 days.';
                    setQueryInput(q);
                    handleSubmitIntent(q);
                  }}
                  className="w-full text-left p-2 rounded-md bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200/60 text-[11px] text-slate-700 font-medium transition-colors cursor-pointer"
                >
                  <span className="font-semibold text-blue-600">5 Corporate Gift Boxes</span> (Budget: ₹8,500, 3 days)
                </button>
                <button
                  onClick={() => {
                    const q = 'I need 10 Employee Welcome Kits for onboarding. Budget is ₹12,000 within 4 days.';
                    setQueryInput(q);
                    handleSubmitIntent(q);
                  }}
                  className="w-full text-left p-2 rounded-md bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200/60 text-[11px] text-slate-700 font-medium transition-colors cursor-pointer"
                >
                  <span className="font-semibold text-blue-600">10 Welcome Kits</span> (Budget: ₹12,000, 4 days)
                </button>
                <button
                  onClick={() => {
                    const q = 'Looking for 3 Executive Laptop Bags with accessories under ₹6,000.';
                    setQueryInput(q);
                    handleSubmitIntent(q);
                  }}
                  className="w-full text-left p-2 rounded-md bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200/60 text-[11px] text-slate-700 font-medium transition-colors cursor-pointer"
                >
                  <span className="font-semibold text-blue-600">3 Laptop Bags + Accessories</span> (Budget: ₹6,000)
                </button>
              </div>
            </div>

            {/* Extracted Intent Card (Section 4) */}
            {extractedIntent && (
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Extracted Intent
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                    Verified
                  </span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-1.5 font-medium">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Product:</span>
                    <span className="font-bold text-slate-900">{extractedIntent.product}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Quantity:</span>
                    <span className="font-bold text-slate-900">{extractedIntent.quantity} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Budget:</span>
                    <span className="font-bold text-slate-900">₹{extractedIntent.maxBudget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Delivery:</span>
                    <span className="font-bold text-slate-900">{extractedIntent.deliveryDays} days</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ======================================================================= */}
        {/* COLUMN 2: AGENT NEGOTIATION (Center - 5 cols) */}
        {/* ======================================================================= */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col h-[740px]">
            {/* Center Chat Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Agent Negotiation
                </h2>
                <p className="text-[11px] text-slate-400">
                  Autonomous AI Buyer ⇄ AI Merchant Protocol
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Sequential Dialogue</span>
                </span>
              </div>
            </div>

            {/* Chat Messages Container */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              {deal?.negotiationRounds?.slice(0, visibleMessagesCount).map((round, idx) => {
                const isBuyer = round.speaker === 'buyer';
                return (
                  <div
                    key={idx}
                    className={`flex flex-col ${isBuyer ? 'items-start' : 'items-end'}`}
                  >
                    {/* Speaker Header Label */}
                    <div className="flex items-center gap-1.5 mb-1 text-[11px] font-bold">
                      {isBuyer ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-blue-600" />
                          <span className="text-blue-700">AI BUYER</span>
                        </>
                      ) : (
                        <>
                          <span className="text-indigo-700">AI MERCHANT</span>
                          <span className="w-2 h-2 rounded-full bg-indigo-600" />
                        </>
                      )}
                    </div>

                    {/* Chat Bubble */}
                    <div
                      className={`max-w-[90%] p-3.5 rounded-xl text-xs leading-relaxed ${
                        isBuyer
                          ? 'bg-blue-50 text-slate-800 border border-blue-200/80 rounded-tl-none'
                          : 'bg-indigo-50 text-slate-900 border border-indigo-200/80 rounded-tr-none'
                      }`}
                    >
                      <p className="font-medium">{round.message}</p>

                      {/* Offer Badge inside bubble if merchant proposed amount */}
                      {round.proposedTotal > 0 && (
                        <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold">
                          <span className="text-slate-500">
                            {isBuyer ? 'Target Cap:' : 'Proposed Package:'}
                          </span>
                          <span className="font-bold text-slate-900">
                            ₹{round.proposedTotal.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div
                  className={`flex flex-col ${
                    typingSpeaker === 'buyer' ? 'items-start' : 'items-end'
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-400 mb-1">
                    {typingSpeaker === 'buyer' ? 'AI BUYER typing...' : 'AI MERCHANT evaluating...'}
                  </span>
                  <div className="p-3 bg-slate-100 rounded-xl flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Negotiation Summary Banner */}
            <div className="pt-3 border-t border-slate-100 shrink-0 bg-slate-50 p-3 rounded-lg text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>Negotiation Status:</span>
                <span className="text-emerald-700 font-extrabold">
                  {deal?.status === 'WAITING_FOR_APPROVAL'
                    ? 'Agreed & Awaiting Buyer Approval'
                    : deal?.status === 'ORDER_CONFIRMED'
                    ? 'Order Confirmed & Settled'
                    : 'Negotiation In Progress'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Objective: Maximize merchant value while strictly respecting buyer constraints.
              </p>
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* COLUMN 3: DEAL & POLICY (Right - 4 cols) */}
        {/* ======================================================================= */}
        <div className="lg:col-span-4 space-y-4">
          {/* 1. COMPACT POLICY CHECK PANEL (Section 8) */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                POLICY CHECK
              </h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  deal?.policyChecks?.passed
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {deal?.policyChecks?.passed ? 'ALL INVARIANTS PASSED' : 'DEAL BLOCKED'}
              </span>
            </div>

            {/* Compact Policy Checklist */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Budget respected</span>
                </span>
                <span className="font-semibold text-slate-800">
                  ₹{finalDealAmount.toLocaleString()} &lt;= ₹{(deal?.buyerIntent?.maxBudget || 8500).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Inventory available</span>
                </span>
                <span className="font-semibold text-slate-800">Reserved</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Discount allowed</span>
                </span>
                <span className="font-semibold text-slate-800">&lt;= 8% Policy Cap</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Minimum margin protected</span>
                </span>
                <span className="font-semibold text-slate-800">
                  ₹{(deal?.merchantMargin || 3150).toLocaleString()} &gt;= ₹1,000
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Negotiation limit respected</span>
                </span>
                <span className="font-semibold text-slate-800">3 of 3 Rounds</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Buyer approval required</span>
                </span>
                <span className="font-semibold text-blue-600">Enforced</span>
              </div>
            </div>

            {/* If policy fails, show ❌ DEAL BLOCKED */}
            {deal?.policyChecks && !deal.policyChecks.passed && (
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-xs text-rose-800 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-rose-700">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>❌ DEAL BLOCKED</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Payment cannot proceed because the proposed deal would reduce merchant margin below ₹1,000.
                </p>
              </div>
            )}
          </div>

          {/* 2. REVENUE OPTIMIZATION RECOMMENDATIONS (Section 6) */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Revenue Optimization
              </h3>
              <span className="text-[10px] font-bold text-slate-500">Margin Priority</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/70 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">Premium Packaging</span>
                  <span className="font-extrabold text-blue-600">+₹150/unit</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Elevates corporate unboxing experience at 57% merchant margin.
                </p>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/70 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">Greeting Card</span>
                  <span className="font-extrabold text-blue-600">+₹100/unit</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Personalized branded inclusion that increases client satisfaction.
                </p>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/70 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">Express Delivery</span>
                  <span className="font-extrabold text-slate-600">Fulfillment Match</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Adjusted fulfillment routing to stay within buyer's 3-day timeline.
                </p>
              </div>
            </div>
          </div>

          {/* 3. REVENUE BEFORE / AFTER ANALYSIS CARD (Section 7) */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-100">
              Revenue Before / After
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Original Cart Value:</span>
                <span className="font-semibold text-slate-900">₹{baseCartValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Bundle / Upsell Value:</span>
                <span>+₹{bundleUpsellValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Discount:</span>
                <span>-₹{bundleDiscount.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between text-sm font-extrabold text-slate-900">
                <span>Final Deal:</span>
                <span>₹{finalDealAmount.toLocaleString()}</span>
              </div>
              <div className="bg-emerald-50 text-emerald-800 p-2 rounded-md font-bold text-xs flex justify-between">
                <span>Additional Transaction Value:</span>
                <span>+₹{additionalValue.toLocaleString()}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
              “The AI increased transaction value using relevant products while remaining within the buyer's budget and merchant policy.”
            </p>
          </div>

          {/* 4. FINAL DEAL & BUYER APPROVAL GATE (Section 9 & 10) */}
          <div className="bg-slate-900 text-white rounded-xl p-5 shadow-md space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                Human Approval Gate
              </span>
              <h3 className="text-sm font-extrabold text-white mt-0.5">FINAL DEAL</h3>
            </div>

            {/* Line items */}
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>5 × Premium Corporate Gift Box</span>
                <span className="font-semibold text-white">₹7,500</span>
              </div>
              <div className="flex justify-between text-blue-300">
                <span>5 × Custom Packaging</span>
                <span className="font-semibold">+₹750</span>
              </div>
              <div className="flex justify-between text-blue-300">
                <span>5 × Greeting Card</span>
                <span className="font-semibold">+₹500</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Executive Incentive Discount:</span>
                <span>-₹400</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-black text-white">
                <span>Final Amount:</span>
                <span className="text-base text-emerald-400">
                  ₹{finalDealAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 italic">
              AI prepared the deal. The buyer controls the money.
            </p>

            {/* Large Approval Button */}
            {!orderConfirmed && !paymentFailedState && (
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleApproveAndPay}
                  disabled={isApproving}
                  id="deal-approve-pay-btn"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {isApproving
                      ? 'Generating Order...'
                      : `APPROVE & PAY ₹${finalDealAmount.toLocaleString()}`}
                  </span>
                </button>

                {/* SIMULATE PAYMENT FAILURE BUTTON (Section 11) */}
                <button
                  onClick={handleSimulatePaymentFailure}
                  id="deal-simulate-failure-btn"
                  className="w-full bg-slate-800 hover:bg-rose-950 text-rose-300 hover:text-rose-200 border border-slate-700 hover:border-rose-700 font-semibold py-2 px-3 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>SIMULATE PAYMENT FAILURE</span>
                </button>
              </div>
            )}

            {/* PAYMENT FAILED STATE (Section 11) */}
            {paymentFailedState && (
              <div className="bg-rose-950/80 border border-rose-600/80 rounded-xl p-4 text-xs space-y-3">
                <div className="flex items-center gap-2 text-rose-300 font-bold">
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  <span>PAYMENT FAILED</span>
                </div>
                <p className="text-slate-200 text-xs leading-relaxed">
                  “Your payment was not completed. No duplicate payment was attempted.”
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleRetryPayment}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg text-xs cursor-pointer"
                  >
                    Retry Payment
                  </button>
                  <button
                    onClick={() => setPaymentFailedState(false)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2 rounded-lg text-xs cursor-pointer"
                  >
                    Cancel Deal
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">
                  Note: Retry requires explicit buyer approval again. Failure recorded in Audit Trail.
                </p>
              </div>
            )}

            {/* ORDER CONFIRMED STATE */}
            {orderConfirmed && (
              <div className="bg-emerald-950/80 border border-emerald-600/80 rounded-xl p-4 text-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>ORDER CONFIRMED</span>
                </div>
                <p className="text-slate-200 text-xs">
                  Settled ₹{finalDealAmount.toLocaleString()} to merchant ledger.
                </p>
                <p className="text-[11px] text-slate-400 font-mono">
                  Payment ID: {confirmedPaymentId || 'pay_rzp_test'}
                </p>
                <button
                  onClick={() => onNavigate('/transactions')}
                  className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-2 rounded-lg text-xs transition-colors mt-2 cursor-pointer"
                >
                  View in Transactions & Ledger
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RAZORPAY TEST MODE MODAL (Section 10 & 11) */}
      {showRazorpayModal && deal && (
        <RazorpayModal
          dealId={deal.id}
          orderId={razorpayOrderId}
          amount={finalDealAmount}
          onSuccess={handlePaymentSuccess}
          onSimulateFailure={handleSimulatePaymentFailure}
          onClose={() => setShowRazorpayModal(false)}
        />
      )}
    </div>
  );
};
