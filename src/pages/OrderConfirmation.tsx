import React from 'react';
import {
  CheckCircle2,
  Package,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { Order } from '../types';

interface OrderConfirmationProps {
  order: Order;
  onViewOrders: () => void;
  onContinueShopping: () => void;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  order,
  onViewOrders,
  onContinueShopping,
}) => {
  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8 pb-16">
      {/* Success Badge Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-xs">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Payment Successful &bull; Razorpay Verified
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
          Order Confirmed
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Your order has been recorded and scheduled for expedited fulfillment.
        </p>

        {/* Essential Order Confirmation Key Data */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-left text-xs">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <span className="text-slate-500 text-[11px] block">Order ID</span>
            <strong className="font-mono font-bold text-slate-900 text-xs sm:text-sm truncate block mt-0.5">
              {order.orderNumber || order.id}
            </strong>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <span className="text-slate-500 text-[11px] block">Quantity</span>
            <strong className="font-bold text-slate-900 text-xs sm:text-sm block mt-0.5">
              {order.items.reduce((s, it) => s + it.quantity, 0)} units
            </strong>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <span className="text-slate-500 text-[11px] block">Final amount</span>
            <strong className="font-extrabold text-[#0C6CF2] text-xs sm:text-sm block mt-0.5">
              ₹{(order.total ?? 0).toLocaleString()}
            </strong>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
            <span className="text-emerald-700 text-[11px] block font-medium">Payment status</span>
            <strong className="font-bold text-emerald-700 text-xs sm:text-sm flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{order.paymentStatus || 'Successful'}</span>
            </strong>
          </div>
        </div>
      </div>

      {/* Order Details Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Product and Purchased Items List */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Product &amp; Quantity Details
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Payment Status:{' '}
              <strong className="text-emerald-700 font-bold">
                {order.paymentStatus || 'Successful'}
              </strong>
            </span>
          </div>

          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-slate-900">{item.productName}</span>
                      {item.isNegotiated && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md border border-emerald-200">
                          <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                          Negotiated Deal
                        </span>
                      )}
                    </div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      Quantity:{' '}
                      <strong className="text-slate-800 font-semibold">{item.quantity} units</strong>{' '}
                      &bull; Unit Price:{' '}
                      <strong className="text-slate-800">
                        ₹{(item.unitPrice ?? 0).toLocaleString()}
                      </strong>
                    </div>
                    {item.addOns && item.addOns.length > 0 && (
                      <span className="text-[10px] text-indigo-600 block mt-0.5">
                        +{item.addOns.map((a) => a.name).join(', ')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Subtotal</span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    ₹{(item.subtotal ?? 0).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">Estimated Delivery</h2>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
            In 2 - 3 Business Days
          </span>
        </div>

        {/* Destination */}
        <div className="text-xs text-slate-600 space-y-1">
          <span className="font-semibold text-slate-700 block">Shipping Address:</span>
          <p>{order.shippingAddress.fullName}</p>
          <p>{order.shippingAddress.street}</p>
          <p>
            {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
            {order.shippingAddress.pincode}
          </p>
          <p className="text-slate-500">Contact: {order.shippingAddress.phone}</p>
        </div>

        {/* Financial Summary */}
        <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{(order.subtotal ?? 0).toLocaleString()}</span>
          </div>

          {(order.discount ?? 0) > 0 && (
            <div className="flex justify-between text-emerald-700 font-semibold">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                AI Deal Savings
              </span>
              <span>- ₹{(order.discount ?? 0).toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="text-emerald-700 font-medium">FREE</span>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
            <span className="text-sm font-bold text-slate-900">Total Paid</span>
            <span className="text-xl font-extrabold text-indigo-600">
              ₹{(order.total ?? 0).toLocaleString()}
            </span>
          </div>

          {order.razorpayPaymentId && (
            <p className="text-[11px] text-slate-400 font-mono pt-1 text-right">
              Razorpay Ref: {order.razorpayPaymentId}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={onViewOrders}
            className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-3 px-4 rounded-xl transition-colors shadow-xs"
          >
            <Package className="w-4 h-4" />
            <span>View in My Orders</span>
          </button>

          <button
            onClick={onContinueShopping}
            className="flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold py-3 px-4 rounded-xl border border-indigo-200 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>
    </div>
  );
};
