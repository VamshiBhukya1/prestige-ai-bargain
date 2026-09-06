import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  X,
  Send,
  Check,
  ShoppingBag,
  ArrowRight,
  Package,
  AlertCircle,
  Plus,
  Minus,
  CheckCircle2,
  TrendingDown,
  RefreshCw,
  Tag,
} from 'lucide-react';
import { Product, Deal } from '../types';
import { calculateBulkPricing, getAllBulkTiers } from '../utils/pricing';

interface BargainModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onDealAddedToCart: (deal: Deal) => void;
  onProceedToCheckout?: (deal: Deal) => void;
  initialDeal?: Deal | null;
}

export const BargainModal: React.FC<BargainModalProps> = ({
  product,
  isOpen,
  onClose,
  onDealAddedToCart,
  onProceedToCheckout,
  initialDeal,
}) => {
  const [deal, setDeal] = useState<Deal | null>(initialDeal || null);
  const [quantityInput, setQuantityInput] = useState<number>(
    initialDeal?.quantity || (product.inventory >= 50 ? 50 : Math.min(product.inventory, 10))
  );
  const [requestedPriceInput, setRequestedPriceInput] = useState<string>('');
  const [chatMessageInput, setChatMessageInput] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiEnabled, setAiEnabled] = useState<boolean | null>(null);
  const [addedToCartSuccess, setAddedToCartSuccess] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Initialize or load deal room for this product
  useEffect(() => {
    if (!isOpen) return;

    if (initialDeal && initialDeal.productId === product.id) {
      setDeal(initialDeal);
      setQuantityInput(initialDeal.quantity || 50);
      if (initialDeal.customerOfferPrice) {
        setRequestedPriceInput(initialDeal.customerOfferPrice.toString());
      }
      return;
    }

    const startBargain = async () => {
      setLoading(true);
      setError(null);
      try {
        const initialQty = product.inventory >= 50 ? 50 : Math.min(product.inventory, 10);
        setQuantityInput(initialQty);
        const defaultTierPrice = calculateBulkPricing(product, initialQty).unitPrice;
        setRequestedPriceInput(defaultTierPrice.toString());

        const res = await fetch('/api/bargain/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id, quantity: initialQty }),
        });
        if (!res.ok) {
          throw new Error('Failed to initialize AI Deal Room');
        }
        const data = await res.json();
        setDeal(data);
        // check AI status (whether Gemini will be used)
        try {
          const statusRes = await fetch('/api/ai/status');
          if (statusRes.ok) {
            const status = await statusRes.json();
            setAiEnabled(!!status.enabled);
          } else {
            setAiEnabled(false);
          }
        } catch (e) {
          setAiEnabled(false);
        }
      } catch (err: unknown) {
        console.error('Failed to start bargaining deal room:', err);
        setError('Unable to initialize AI Deal Room. Please check your connection and retry.');
      } finally {
        setLoading(false);
      }
    };

    startBargain();
  }, [isOpen, product.id, initialDeal]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [deal?.messages, loading]);

  if (!isOpen) return null;

  // Make an offer with Quantity and Requested Price
  const handleMakeOffer = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!deal || loading) return;

    const qty = Math.max(1, Math.min(product.inventory, Number(quantityInput) || 1));
    const rawParsed = parseFloat(requestedPriceInput.replace(/[^0-9.]/g, ''));
    const price = isNaN(rawParsed) || rawParsed <= 0 ? currentTier.unitPrice : rawParsed;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/bargain/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealId: deal.id,
          quantity: qty,
          requestedPrice: price,
          message: `I need ${qty} units. Can you give me ₹${price.toLocaleString()} each?`,
        }),
      });

      if (!res.ok) {
        throw new Error('AI negotiation service encountered an error.');
      }

      const updatedDeal: Deal = await res.json();
      setDeal(updatedDeal);
    } catch (err: unknown) {
      console.error('Error submitting offer:', err);
      setError('Failed to evaluate offer. Please click Retry.');
    } finally {
      setLoading(false);
    }
  };

  // Send a custom chat message (e.g. "Can you do ₹1,600?")
  const handleSendMessage = async (customText?: string) => {
    if (!deal || loading) return;
    const textToSend = (customText ?? chatMessageInput).trim();
    if (!textToSend) return;

    setLoading(true);
    setError(null);
    setChatMessageInput('');

    try {
      const res = await fetch('/api/bargain/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealId: deal.id,
          quantity: quantityInput,
          message: textToSend,
        }),
      });

      if (!res.ok) {
        throw new Error('AI negotiation service encountered an error.');
      }

      const updatedDeal: Deal = await res.json();
      setDeal(updatedDeal);
      if (updatedDeal.quantity) {
        setQuantityInput(updatedDeal.quantity);
      }
    } catch (err: unknown) {
      console.error('Error sending message:', err);
      setError('Failed to process message. Please click Retry.');
    } finally {
      setLoading(false);
    }
  };

  // Accept Deal
  const handleAcceptDeal = async () => {
    if (!deal || loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/bargain/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealId: deal.id,
          action: 'deal_accepted',
          message: 'Deal accepted! Proceeding to checkout.',
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to finalize deal acceptance.');
      }

      const updatedDeal: Deal = await res.json();
      setDeal(updatedDeal);
    } catch (err: unknown) {
      console.error('Error accepting deal:', err);
      setError('Unable to accept deal. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  // Proceed to Checkout
  const handleProceedToCheckout = () => {
    if (!deal) return;
    if (onProceedToCheckout) {
      onProceedToCheckout(deal);
    } else {
      onDealAddedToCart(deal);
      onClose();
    }
  };

  // Add Deal to Cart without closing immediately
  const handleAddDealToCart = () => {
    if (!deal) return;
    onDealAddedToCart(deal);
    setAddedToCartSuccess(true);
    setTimeout(() => {
      setAddedToCartSuccess(false);
    }, 2000);
  };

  // Quick suggestions for easy one-click testing
  const quickSuggestions = [
    `I need 50 units. Can you give me ₹1,500 each?`,
    `Can you do ₹1,600?`,
    `What is your best corporate price for 50 units?`,
  ];

  const basePrice = deal?.basePrice ?? product.price ?? 1850;
  const currentQuantity = deal?.quantity ?? quantityInput;
  const customerOffer = deal?.customerOfferPrice;
  const aiCounter = deal?.aiCounterPrice ?? (deal?.status === 'Offer Available' ? deal.unitPrice : undefined);
  const currentSavings = deal?.savings ?? (aiCounter ? Math.max(0, currentQuantity * (basePrice - aiCounter)) : 0);
  const isDealValidForAcceptance =
    deal &&
    (deal.status === 'Offer Available' || aiCounter !== undefined) &&
    deal.status !== 'Accepted' &&
    deal.status !== 'Rejected';

  const currentTier = calculateBulkPricing(product, quantityInput);
  const allBulkTiers = getAllBulkTiers(product);

  return (
    <div
      id="ai-deal-room-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl flex flex-col h-[92vh] max-h-[760px] overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0C6CF2] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#0C2340]">
                  AI Deal Room: {product.name}
                </h3>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    deal?.status === 'Accepted'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : deal?.status === 'Rejected'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-blue-50 text-[#0C6CF2] border-blue-100'
                  }`}
                >
                  {deal?.status || 'Negotiating'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Bulk Corporate Order Negotiation &bull; Powered by AI
              </p>
            </div>
          </div>

          <button
            id="close-deal-room-button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Status Banner */}
        {aiEnabled === false && (
          <div className="px-4 py-2 bg-yellow-50 border-b border-yellow-200 text-xs text-yellow-800 flex items-center justify-between">
            <div>
              Gemini AI is not enabled or `USE_GEMINI` is off — using deterministic replies to conserve credits.
            </div>
            <div className="text-xs text-slate-500">Enable `USE_GEMINI=true` and set `GEMINI_API_KEY` to use Gemini.</div>
          </div>
        )}

        {/* Product Snapshot Bar */}
        <div className="px-5 py-2.5 bg-slate-100/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <img
              src={product.image}
              alt={product.name}
              className="w-8 h-8 rounded object-cover border border-slate-200 shrink-0"
            />
            <span className="font-semibold text-slate-800">{product.name}</span>
            <span className="text-slate-400">|</span>
            <span className="font-medium text-slate-700">
              Price: <strong className="text-slate-900">₹{basePrice.toLocaleString()}</strong>/unit
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Available Stock: {product.inventory} units
            </span>
          </div>
        </div>

        {/* Clear Negotiation Status Grid */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[11px] font-medium">Original Price</span>
              <span className="font-bold text-slate-800 text-sm">₹{basePrice.toLocaleString()}</span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[11px] font-medium">Customer Offer</span>
              <span className="font-bold text-blue-600 text-sm">
                {customerOffer ? `₹${customerOffer.toLocaleString()}` : '—'}
              </span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[11px] font-medium">AI Counteroffer</span>
              <span className="font-bold text-indigo-600 text-sm">
                {aiCounter ? `₹${aiCounter.toLocaleString()}` : '—'}
              </span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[11px] font-medium">Quantity</span>
              <span className="font-bold text-slate-800 text-sm">{currentQuantity} units</span>
            </div>
            <div className="col-span-2 sm:col-span-1 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
              <span className="text-emerald-700 block text-[11px] font-medium flex items-center justify-center gap-1">
                <TrendingDown className="w-3 h-3" />
                Savings
              </span>
              <span className="font-extrabold text-emerald-700 text-sm">
                ₹{currentSavings.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Error Alert Banner */}
        {error && (
          <div className="px-4 py-2 bg-rose-50 border-b border-rose-200 flex items-center justify-between text-xs text-rose-700">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => handleMakeOffer()}
              className="font-bold underline hover:text-rose-900 ml-2"
            >
              Retry
            </button>
          </div>
        )}

        {/* Chat Messages & Negotiation History */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50">
          {/* Order Summary banner if deal is Accepted */}
          {deal?.status === 'Accepted' && deal.orderSummary && (
            <div
              id="deal-order-summary-card"
              className="bg-white border-2 border-emerald-500 rounded-2xl p-4 sm:p-5 shadow-md animate-in fade-in zoom-in-95 duration-200"
            >
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h4 className="font-bold text-sm sm:text-base">
                  Deal Accepted & Order Summary Ready!
                </h4>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block mb-0.5">Final Negotiated Price</span>
                  <span className="text-base font-bold text-slate-900">
                    ₹{deal.orderSummary.finalPricePerUnit.toLocaleString()}
                    <span className="text-xs font-normal text-slate-500">/unit</span>
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block mb-0.5">Order Quantity</span>
                  <span className="text-base font-bold text-slate-900">
                    {deal.orderSummary.quantity} units
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block mb-0.5">Total Amount</span>
                  <span className="text-base font-extrabold text-[#0C6CF2]">
                    ₹{deal.orderSummary.totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                  <span className="text-emerald-700 block mb-0.5 font-medium">Total Savings</span>
                  <span className="text-base font-extrabold text-emerald-700">
                    ₹{deal.orderSummary.totalSavings.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                <button
                  id="proceed-to-checkout-button"
                  onClick={handleProceedToCheckout}
                  className="w-full sm:flex-1 bg-[#0C6CF2] hover:bg-[#0957C3] text-white font-bold py-2.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  id="add-deal-to-cart-button"
                  onClick={handleAddDealToCart}
                  className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2.5 px-4 rounded-xl text-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  {addedToCartSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          {deal?.messages.map((msg) => {
            const isAI = msg.sender === 'ai';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isAI ? 'items-start' : 'items-end'} space-y-1.5`}
              >
                <div className="flex items-center gap-1.5 px-1 text-[11px] text-slate-400">
                  <span>{isAI ? 'Prestige AI Assistant' : 'You (Customer)'}</span>
                </div>
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    isAI
                      ? 'bg-white border border-slate-200 text-slate-800 shadow-xs'
                      : 'bg-[#0C6CF2] text-white shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {isAI && msg.offerCard && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs">
                      <div className="flex items-center justify-between font-semibold text-slate-800 mb-1.5">
                        <span className="text-[11px] font-semibold text-indigo-700 flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {msg.offerCard.bulkTier?.tierName || 'Bulk Pricing Tier Offer'}
                        </span>
                        {msg.offerCard.savings > 0 && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                            Save ₹{msg.offerCard.savings.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-200/80">
                        <div>
                          <span className="text-slate-500 block text-[10px]">Quantity</span>
                          <strong className="text-slate-800">{msg.offerCard.quantity} units</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Price/unit</span>
                          <strong className="text-slate-900">₹{msg.offerCard.unitPrice.toLocaleString()}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Discount</span>
                          <strong className="text-emerald-700">
                            {msg.offerCard.savings > 0
                              ? `₹${Math.round(msg.offerCard.savings / msg.offerCard.quantity).toLocaleString()}/unit`
                              : 'Normal'}
                          </strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Total Price</span>
                          <strong className="text-[#0C6CF2]">₹{msg.offerCard.negotiatedPrice.toLocaleString()}</strong>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-600 italic bg-white border border-slate-200 rounded-xl px-4 py-2.5 w-fit shadow-xs">
              <RefreshCw className="w-3.5 h-3.5 text-[#0C6CF2] animate-spin" />
              <span>AI is evaluating offer against merchant policy & inventory limits...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* "Deal Accepted" Action Bar - Visible only when valid deal is reached */}
        {isDealValidForAcceptance && (
          <div className="px-4 py-2.5 bg-emerald-50/90 border-t border-emerald-200 flex items-center justify-between gap-3">
            <div className="text-xs text-emerald-900">
              <span className="font-bold">Deal available:</span> ₹
              {(aiCounter || deal.unitPrice).toLocaleString()}/unit for {currentQuantity} units
              (Total: ₹{deal.negotiatedPrice.toLocaleString()})
            </div>
            <button
              id="deal-accepted-button"
              onClick={handleAcceptDeal}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors shrink-0 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>Deal Accepted</span>
            </button>
          </div>
        )}

        {/* Quick Suggestion Chips */}
        {deal?.status !== 'Accepted' && (
          <div className="px-4 py-1.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[11px] text-slate-400 whitespace-nowrap">Try:</span>
            {quickSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (suggestion.includes('1,500')) {
                    setQuantityInput(50);
                    setRequestedPriceInput('1500');
                  } else if (suggestion.includes('1,600')) {
                    setRequestedPriceInput('1600');
                  }
                  handleSendMessage(suggestion);
                }}
                className="text-xs bg-slate-100 hover:bg-blue-50 hover:text-[#0C6CF2] text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap border border-slate-200 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Negotiation Controls: Quantity, Requested Price, and "Make Offer" Button */}
        {deal?.status !== 'Accepted' && (
          <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200">
            <form onSubmit={handleMakeOffer} className="space-y-3">
              {/* Bulk Pricing Tier Ladder & Live Quantity-Based Details */}
              <div className="bg-white rounded-xl border border-slate-200 p-2.5 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#0C6CF2]" />
                    <span>Bulk Pricing Tiers</span>
                  </span>
                  <span className="text-[11px] font-medium text-slate-500">
                    Active: <strong className="text-[#0C6CF2] font-bold">{currentTier.tierName}</strong>
                  </span>
                </div>

                {/* Tier Selection Buttons */}
                <div className="grid grid-cols-4 gap-1.5 text-center text-[11px]">
                  {allBulkTiers.map((t) => {
                    const isActive = currentTier.tierRange === t.tierRange;
                    return (
                      <button
                        key={t.tierRange}
                        type="button"
                        onClick={() => {
                          const minQty =
                            t.tierRange === '1-9'
                              ? 1
                              : t.tierRange === '10-24'
                              ? 10
                              : t.tierRange === '25-49'
                              ? 25
                              : 50;
                          setQuantityInput(minQty);
                          setRequestedPriceInput(t.unitPrice.toString());
                        }}
                        className={`py-1.5 px-1 rounded-lg border transition-all ${
                          isActive
                            ? 'bg-blue-50 border-[#0C6CF2] text-[#0C2340] font-bold shadow-2xs ring-1 ring-[#0C6CF2]'
                            : 'bg-slate-50/80 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <div className="font-bold">{t.tierRange} units</div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {t.tierRange === '1-9'
                            ? 'Normal price'
                            : t.tierRange === '10-24'
                            ? 'Small bulk'
                            : t.tierRange === '25-49'
                            ? 'Medium bulk'
                            : 'Max bulk'}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Live Dynamic Output when quantity changes: Quantity, Price per unit, Discount, Total price */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1.5 border-t border-slate-100 text-xs">
                  <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                    <span className="text-slate-500 text-[10px] block font-medium">Quantity</span>
                    <span className="font-bold text-slate-900">{quantityInput} units</span>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                    <span className="text-slate-500 text-[10px] block font-medium">Price per unit</span>
                    <span className="font-bold text-slate-900">₹{currentTier.unitPrice.toLocaleString()}</span>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                    <span className="text-slate-500 text-[10px] block font-medium">Discount</span>
                    <span className={`font-bold ${currentTier.discountPerUnit > 0 ? 'text-emerald-700' : 'text-slate-700'}`}>
                      {currentTier.discountPerUnit > 0
                        ? `₹${currentTier.discountPerUnit.toLocaleString()}/unit (${currentTier.discountPercent}%)`
                        : 'Normal price'}
                    </span>
                  </div>
                  <div className="bg-blue-50/70 p-1.5 rounded-lg border border-blue-100">
                    <span className="text-slate-500 text-[10px] block font-medium">Total price</span>
                    <span className="font-extrabold text-[#0C6CF2]">₹{currentTier.totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                {/* Quantity Selector */}
                <div className="sm:col-span-4">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Quantity (Units)
                  </label>
                  <div className="flex items-center bg-white border border-slate-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#0C6CF2] focus-within:border-transparent">
                    <button
                      type="button"
                      onClick={() => setQuantityInput((prev) => Math.max(1, prev - 10))}
                      disabled={quantityInput <= 1 || loading}
                      className="px-2.5 py-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors disabled:opacity-30"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      id="quantity-input"
                      type="number"
                      min={1}
                      max={product.inventory}
                      value={quantityInput}
                      onChange={(e) => setQuantityInput(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      disabled={loading}
                      className="w-full text-center py-2 text-sm font-bold text-slate-900 focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setQuantityInput((prev) => Math.min(product.inventory, prev + 10))
                      }
                      disabled={quantityInput >= product.inventory || loading}
                      className="px-2.5 py-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors disabled:opacity-30"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Requested Price */}
                <div className="sm:col-span-5">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Requested Price (₹/unit)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                      ₹
                    </span>
                    <input
                      id="requested-price-input"
                      type="number"
                      placeholder="e.g. 1500"
                      value={requestedPriceInput}
                      onChange={(e) => setRequestedPriceInput(e.target.value)}
                      disabled={loading}
                      className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0C6CF2] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* "Make Offer" Button */}
                <div className="sm:col-span-3">
                  <button
                    id="make-offer-button"
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#0C6CF2] hover:bg-[#0957C3] disabled:opacity-50 text-white py-2 px-3 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 transition-colors shadow-xs h-[38px]"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Make Offer</span>
                  </button>
                </div>
              </div>

              {/* Chat Input Bar for follow-up negotiation (e.g. "Can you do ₹1,600?") */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-200">
                <input
                  id="chat-message-input"
                  type="text"
                  value={chatMessageInput}
                  onChange={(e) => setChatMessageInput(e.target.value)}
                  placeholder="Or message the AI directly (e.g. 'Can you do ₹1,600?')..."
                  disabled={loading}
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0C6CF2] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={loading || !chatMessageInput.trim()}
                  className="bg-slate-800 hover:bg-slate-900 disabled:opacity-40 text-white px-3 py-1.5 rounded-xl font-medium text-xs flex items-center gap-1 transition-colors shrink-0"
                >
                  <span>Send</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
