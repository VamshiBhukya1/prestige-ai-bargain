import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  ArrowLeft,
  Sparkles,
  Lock,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
} from 'lucide-react';
import { CartItem, ShippingAddress } from '../types';
import { RazorpayModal } from '../components/RazorpayModal';

interface CheckoutProps {
  cart: CartItem[];
  user: { name: string; email: string; phone?: string } | null;
  onBackToCart: () => void;
  onOrderSuccess: (order: any) => void;
}

export const Checkout: React.FC<CheckoutProps> = ({
  cart,
  user,
  onBackToCart,
  onOrderSuccess,
}) => {
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: user?.name || 'Aditi Sharma',
    email: user?.email || 'customer@demo.com',
    phone: user?.phone || '+91 98765 43210',
    street: '42, Cyber Hub, DLF Phase 2',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122002',
  });

  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [razorpayOrderId, setRazorpayOrderId] = useState('');
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const regularSubtotal = cart.reduce(
    (sum, it) => sum + it.regularUnitPrice * it.quantity,
    0
  );
  const finalTotal = cart.reduce((sum, it) => sum + it.subtotal, 0);
  const totalDiscount = Math.max(0, regularSubtotal - finalTotal);

  const handleInitiatePayment = async () => {
    if (!address.fullName || !address.street || !address.city || !address.pincode) {
      setErrorMsg('Please complete all shipping address fields.');
      return;
    }

    setLoadingPayment(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to initialize payment.');
      }

      const data = await res.json();
      setRazorpayOrderId(data.orderId);
      setIsRazorpayOpen(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error preparing checkout.');
    } finally {
      setLoadingPayment(false);
    }
  };

  const handlePaymentSuccess = async (paymentId: string, paymentMethod: string) => {
    try {
      const res = await fetch('/api/checkout/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: razorpayOrderId,
          paymentId,
          paymentMethod,
          shippingAddress: address,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsRazorpayOpen(false);
        onOrderSuccess(data.order);
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'Payment verification failed on server.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error during payment verification.');
    }
  };

  const handleSimulateFailure = async () => {
    try {
      await fetch('/api/checkout/simulate-failure', { method: 'POST' });
    } catch (err) {
      console.warn('Simulated failure notification:', err);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Back to Cart link */}
      <button
        onClick={onBackToCart}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Cart</span>
      </button>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Checkout</h1>
        <p className="text-sm text-slate-500 mt-1">
          Complete your delivery details and proceed to secure Razorpay payment.
        </p>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Shipping & Contact Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Details Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
              <User className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">Customer Contact</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={address.email}
                  onChange={(e) => setAddress({ ...address, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">Delivery Address</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Street / Building / Suite
                </label>
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Items Summary & Pay with Razorpay */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs sticky top-24">
            <h2 className="text-sm font-bold text-slate-900 pb-3 mb-4 border-b border-slate-100">
              Cart Items ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h2>

            {/* Micro items list */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1 text-xs">
              {cart.map((it) => (
                <div key={it.id} className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 line-clamp-1">{it.productName}</p>
                    <p className="text-[11px] text-slate-500">
                      {it.quantity} × ₹{(it.unitPrice ?? 0).toLocaleString()}
                      {it.isNegotiated && (
                        <span className="text-emerald-600 font-medium ml-1">(Negotiated)</span>
                      )}
                    </p>
                    {it.addOns && it.addOns.length > 0 && (
                      <p className="text-[10px] text-indigo-600">
                        +{it.addOns.map((a) => a.name).join(', ')}
                      </p>
                    )}
                  </div>
                  <span className="font-bold text-slate-900">
                    ₹{(it.subtotal ?? 0).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations breakdown */}
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{(regularSubtotal ?? 0).toLocaleString()}</span>
              </div>

              {totalDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Negotiated Discount
                  </span>
                  <span>- ₹{(totalDiscount ?? 0).toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-emerald-700 font-medium">FREE</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Total to Pay</span>
                <span className="text-xl font-extrabold text-[#0C6CF2]">
                  ₹{(finalTotal ?? 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Razorpay Trigger Button */}
            <button
              id="btn-pay-razorpay"
              onClick={handleInitiatePayment}
              disabled={loadingPayment}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-[#0C6CF2] hover:bg-[#0957C3] disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md hover:shadow-blue-500/20"
            >
              <CreditCard className="w-4 h-4" />
              <span>{loadingPayment ? 'Connecting Gateway...' : 'Pay with Razorpay'}</span>
            </button>

            <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-700 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Razorpay Test Mode (UPI, Cards, NetBanking)</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Safe sandbox environment with mock transactions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay Modal */}
      {isRazorpayOpen && (
        <RazorpayModal
          orderId={razorpayOrderId}
          amount={finalTotal}
          isOpen={isRazorpayOpen}
          onClose={() => setIsRazorpayOpen(false)}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentFailure={handleSimulateFailure}
        />
      )}
    </div>
  );
};
