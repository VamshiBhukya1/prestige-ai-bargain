import React from 'react';
import {
  Package,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Calendar,
  ExternalLink,
  ShoppingBag,
} from 'lucide-react';
import { Order } from '../types';

interface MyOrdersProps {
  orders: Order[];
  onNavigateShop: () => void;
}

export const MyOrders: React.FC<MyOrdersProps> = ({ orders, onNavigateShop }) => {
  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Order History</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track confirmed purchases and view Razorpay transaction details.
          </p>
        </div>
        <button
          onClick={onNavigateShop}
          className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3.5 py-2 rounded-xl border border-indigo-100 transition-colors w-fit"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Continue Shopping</span>
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No past orders found</h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Once you complete a purchase through Razorpay Test Checkout, your order summary and invoice will appear here.
          </p>
          <button
            onClick={onNavigateShop}
            className="mt-5 inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-xs"
          >
            <span>Explore Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow"
            >
              {/* Order Header Bar */}
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-4 flex-wrap">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      Order Placed
                    </span>
                    <span className="font-semibold text-slate-800">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="hidden sm:block h-6 w-px bg-slate-200" />

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      Order Reference
                    </span>
                    <span className="font-mono font-bold text-indigo-600">
                      {order.orderNumber}
                    </span>
                  </div>

                  <div className="hidden sm:block h-6 w-px bg-slate-200" />

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      Payment Status
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      {order.paymentStatus} ({order.paymentMethod})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-[10px] uppercase font-semibold">
                    Order Status:
                  </span>
                  <span className="text-xs font-bold text-slate-800 bg-slate-200/80 px-2.5 py-0.5 rounded-full">
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              {/* Order Items List */}
              <div className="p-6 space-y-4">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{item.productName}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Quantity: <strong className="text-slate-800">{item.quantity}</strong>{' '}
                          &bull; Unit Price: ₹{(item.unitPrice ?? 0).toLocaleString()}
                          {item.isNegotiated && (
                            <span className="text-emerald-600 font-semibold ml-1.5">
                              (Negotiated Deal)
                            </span>
                          )}
                        </p>
                        {item.addOns && item.addOns.length > 0 && (
                          <p className="text-[11px] text-indigo-600 mt-0.5">
                            + {item.addOns.map((a) => `${a.quantity}× ${a.name}`).join(', ')}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right sm:self-center">
                      <div className="text-sm font-bold text-slate-900">
                        ₹{(item.subtotal ?? 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer: Shipping Destination & Grand Total */}
              <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600">
                <div>
                  <span className="font-semibold text-slate-700">Delivering to: </span>
                  <span>
                    {order.shippingAddress?.fullName || 'Customer'}, {order.shippingAddress?.street || ''},{' '}
                    {order.shippingAddress?.city || ''}, {order.shippingAddress?.pincode || ''}
                  </span>
                  {order.razorpayPaymentId && (
                    <span className="block text-[11px] text-slate-400 font-mono mt-0.5">
                      Razorpay Gateway ID: {order.razorpayPaymentId}
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 mr-2">Grand Total:</span>
                  <span className="text-lg font-extrabold text-slate-900">
                    ₹{(order.total ?? 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
