import React, { useState } from 'react';
import {
  Tag,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  Clock,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Deal, Product } from '../types';

interface MyDealsProps {
  deals: Deal[];
  products: Product[];
  onOpenDealRoom: (product: Product, deal: Deal) => void;
  onAddToCart: (deal: Deal) => void;
  onNavigateShop: () => void;
}

export const MyDeals: React.FC<MyDealsProps> = ({
  deals,
  products,
  onOpenDealRoom,
  onAddToCart,
  onNavigateShop,
}) => {
  const [expandedWhyId, setExpandedWhyId] = useState<string | null>(null);
  const [addedDealIds, setAddedDealIds] = useState<Record<string, boolean>>({});

  const handleAddDeal = (deal: Deal) => {
    onAddToCart(deal);
    setAddedDealIds((prev) => ({ ...prev, [deal.id]: true }));
    setTimeout(() => {
      setAddedDealIds((prev) => ({ ...prev, [deal.id]: false }));
    }, 1200);
  };

  const getStatusBadge = (status: Deal['status']) => {
    switch (status) {
      case 'Accepted':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            Accepted
          </span>
        );
      case 'Offer Available':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold bg-blue-50 text-[#0C6CF2] px-2.5 py-0.5 rounded-full border border-blue-200">
            <Sparkles className="w-3 h-3 text-[#0C6CF2]" />
            Offer Ready
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
            <Clock className="w-3 h-3" />
            Negotiating
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            My Negotiated Deals
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review your dynamic pricing quotes secured with the Merchant AI Sales Assistant.
          </p>
        </div>
        <button
          onClick={onNavigateShop}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#0C6CF2] hover:text-[#0957C3] bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl border border-blue-200 transition-colors w-fit"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#0C6CF2]" />
          <span>Bargain on Another Product</span>
        </button>
      </div>

      {/* Deals List */}
      {deals.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0C6CF2] flex items-center justify-center mx-auto mb-4">
            <Tag className="w-6 h-6 text-[#0C6CF2]" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No active deals yet</h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Head to our shop and click <strong>"Bargain with AI"</strong> on any product to unlock
            personalized volume discounts!
          </p>
          <button
            onClick={onNavigateShop}
            className="mt-5 inline-flex items-center gap-1.5 bg-[#0C6CF2] hover:bg-[#0957C3] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-xs"
          >
            <span>Explore Shop</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {deals.map((deal) => {
            const product = products.find((p) => p.id === deal.productId) || products[0];
            const isAdded = addedDealIds[deal.id];
            const isWhyOpen = expandedWhyId === deal.id;
            const quantity = deal.quantity || 5;
            const regularPrice = deal.regularPrice ?? (product ? product.price * quantity : 0);
            const negotiatedPrice = deal.negotiatedPrice ?? regularPrice;
            const savings = deal.savings ?? Math.max(0, regularPrice - negotiatedPrice);

            return (
              <div
                key={deal.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Status and Date */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                    {getStatusBadge(deal.status)}
                    <span className="text-[11px] text-slate-400">
                      {new Date(deal.updatedAt || Date.now()).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* Product Details Row */}
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={deal.productImage || product?.image}
                      alt={deal.productName || product?.name || 'Product'}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">
                        {deal.productName || product?.name || 'Corporate Item'}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Quantity: <strong className="text-slate-800">{quantity} units</strong>
                      </p>
                      {deal.addOns && deal.addOns.length > 0 && (
                        <p className="text-[11px] text-indigo-600 font-medium mt-0.5">
                          + Includes {deal.addOns.map((a) => `${a.name}`).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Pricing Comparison Box */}
                  <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 mb-3 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Regular Catalog Value:</span>
                      <span className="line-through">₹{regularPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200">
                      <span>Negotiated Package Deal:</span>
                      <span className="text-indigo-600 text-sm">
                        ₹{negotiatedPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-emerald-700 font-semibold text-[11px]">
                      <span>Your Total Savings:</span>
                      <span>₹{savings.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Why this offer? (Expandable) */}
                  <div className="mb-4">
                    <button
                      onClick={() => setExpandedWhyId(isWhyOpen ? null : deal.id)}
                      className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Why this offer?</span>
                      {isWhyOpen ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </button>
                    {isWhyOpen && (
                      <div className="mt-2 p-2.5 bg-indigo-50/50 rounded-lg border border-indigo-100 text-[11px] text-slate-600 leading-relaxed animate-in fade-in">
                        {deal.whyThisOffer ||
                          'Your quantity qualifies for a bulk-price adjustment. The offer stays within the store’s allowed pricing range.'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => product && onOpenDealRoom(product, deal)}
                    className="flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                    <span>View Deal Room</span>
                  </button>

                  <button
                    onClick={() => handleAddDeal(deal)}
                    className="flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{isAdded ? 'Added to Cart!' : 'Add Deal to Cart'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
