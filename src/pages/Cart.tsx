import React from 'react';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
  onNavigateShop: () => void;
}

export const Cart: React.FC<CartProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onNavigateShop,
}) => {
  const regularSubtotal = items.reduce(
    (sum, it) => sum + it.regularUnitPrice * it.quantity,
    0
  );

  const finalTotal = items.reduce((sum, it) => sum + it.subtotal, 0);
  const totalSavings = Math.max(0, regularSubtotal - finalTotal);

  if (items.length === 0) {
    return (
      <div className="py-16 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          Looks like you haven't added any items or negotiated deals to your cart yet.
        </p>
        <button
          onClick={onNavigateShop}
          className="mt-6 inline-flex items-center gap-2 bg-[#0C6CF2] hover:bg-[#0957C3] text-white text-xs font-semibold px-5 py-3 rounded-xl transition-colors shadow-xs"
        >
          <span>Browse Executive Store</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Shopping Cart</h1>
        <p className="text-sm text-slate-500 mt-1">
          Review your items, negotiated deals, and add-on packaging.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              {/* Product Info */}
              <div className="flex items-center gap-4 flex-1">
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-900 text-sm">{item.productName}</h3>
                    {item.isNegotiated ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        Negotiated Deal
                      </span>
                    ) : item.savingsPerUnit && item.savingsPerUnit > 0 ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-blue-100 text-[#0C2340] px-2 py-0.5 rounded-full border border-blue-200">
                        <Tag className="w-3 h-3 text-[#0C6CF2]" />
                        {item.quantity >= 50
                          ? 'Maximum Bulk Discount'
                          : item.quantity >= 25
                          ? 'Medium Bulk Discount'
                          : 'Small Bulk Discount'}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-1 text-xs text-slate-500 space-y-0.5">
                    <div>
                      Price per unit:{' '}
                      <strong className="text-slate-800">
                        ₹{(item.unitPrice ?? 0).toLocaleString()}
                      </strong>
                      {item.savingsPerUnit && item.savingsPerUnit > 0 && (
                        <span className="text-emerald-600 ml-1.5 text-[11px] font-medium">
                          (Save ₹{item.savingsPerUnit.toLocaleString()}/unit)
                        </span>
                      )}
                    </div>
                    {item.savingsPerUnit && item.savingsPerUnit > 0 && (
                      <div className="text-[11px] text-slate-500">
                        Discount:{' '}
                        <span className="text-emerald-700 font-semibold">
                          ₹{(item.savingsPerUnit * item.quantity).toLocaleString()} total savings
                        </span>
                      </div>
                    )}

                    {/* Add-ons list */}
                    {item.addOns && item.addOns.length > 0 && (
                      <div className="pt-1 text-[11px] text-indigo-700 bg-indigo-50/70 px-2 py-1 rounded-md mt-1 w-fit">
                        {item.addOns.map((a, i) => (
                          <span key={i}>
                            + {a.quantity} × {a.name} (₹{(((a.price ?? 0) * (a.quantity ?? 1))).toLocaleString()})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quantity & Price Controls */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                {/* Quantity adjuster */}
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 py-1 text-xs font-semibold text-slate-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <div className="text-base font-bold text-slate-900">
                    ₹{(item.subtotal ?? 0).toLocaleString()}
                  </div>
                  {item.isNegotiated && (
                    <span className="text-[10px] text-emerald-600 font-medium">Deal Applied</span>
                  )}
                </div>

                {/* Remove button */}
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Checkout Card (1 col) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs sticky top-24">
            <h2 className="text-base font-bold text-slate-900 pb-4 border-b border-slate-100">
              Order Summary
            </h2>

            <div className="py-4 space-y-3 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Regular Cart Value</span>
                <span className="font-medium text-slate-800">
                  ₹{(regularSubtotal ?? 0).toLocaleString()}
                </span>
              </div>

              {totalSavings > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Bulk & Negotiated Savings
                  </span>
                  <span>- ₹{(totalSavings ?? 0).toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Standard Express Shipping</span>
                <span className="text-emerald-700 font-medium">FREE</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Final Total</span>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-[#0C6CF2]">
                    ₹{(finalTotal ?? 0).toLocaleString()}
                  </span>
                  <p className="text-[10px] text-slate-400">Includes all GST & charges</p>
                </div>
              </div>
            </div>

            <button
              id="btn-proceed-checkout"
              onClick={onProceedToCheckout}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-[#0C6CF2] hover:bg-[#0957C3] text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md hover:shadow-blue-500/20"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Razorpay Verified Test Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
