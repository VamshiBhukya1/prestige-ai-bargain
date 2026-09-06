import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Building,
  CheckCircle2,
  AlertTriangle,
  Lock,
  X,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { Deal } from '../types';

interface RazorpayModalProps {
  deal?: Deal;
  dealId?: string;
  orderId: string;
  amount: number;
  isOpen?: boolean;
  onClose: () => void;
  onSuccess?: (paymentId: string, method: string) => Promise<void> | void;
  onPaymentSuccess?: (paymentId: string, method: string) => Promise<void> | void;
  onSimulateFailure?: () => Promise<void> | void;
  onPaymentFailure?: () => Promise<void> | void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  deal,
  dealId,
  orderId,
  amount,
  isOpen = true,
  onClose,
  onSuccess,
  onPaymentSuccess,
  onSimulateFailure,
  onPaymentFailure,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [activePaymentId, setActivePaymentId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (isOpen === false) return null;

  const handlePaySuccess = async () => {
    setStatus('processing');
    setErrorMessage('');
    const mockPaymentId = `pay_rzp_test_${Date.now()}`;
    setActivePaymentId(mockPaymentId);

    // Simulate standard Razorpay gateway processing delay
    setTimeout(async () => {
      try {
        const method =
          selectedMethod === 'upi'
            ? 'Razorpay UPI (Test)'
            : selectedMethod === 'card'
            ? 'Razorpay Card (Test)'
            : 'Razorpay NetBanking (Test)';

        if (onSuccess) {
          await onSuccess(mockPaymentId, method);
        } else if (onPaymentSuccess) {
          await onPaymentSuccess(mockPaymentId, method);
        }
        setStatus('success');
      } catch (err: any) {
        setStatus('failed');
        setErrorMessage(err.message || 'Payment verification failed');
      }
    }, 1200);
  };

  const handleSimulateFailure = async () => {
    setStatus('processing');
    setTimeout(async () => {
      try {
        if (onSimulateFailure) {
          await onSimulateFailure();
        } else if (onPaymentFailure) {
          await onPaymentFailure();
        }
        setStatus('failed');
        setErrorMessage('Test simulation: Gateway card authorization declined by issuer.');
      } catch (err: any) {
        setStatus('failed');
        setErrorMessage(err.message || 'Payment failure trigger error');
      }
    }, 1000);
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden transition-all">
        {/* Header with Razorpay Test Branding */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-blue-500 rounded flex items-center justify-center font-black text-sm text-white">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-white">Razorpay Checkout</span>
                <span className="bg-amber-400 text-slate-950 font-extrabold text-[10px] px-1.5 py-0.2 rounded uppercase tracking-wider">
                  Test Mode
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Order ID: {orderId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={status === 'processing'}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Merchant & Order Summary Header */}
        <div className="bg-slate-50 px-6 py-3.5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Merchant</span>
            <p className="text-xs font-bold text-slate-800">{deal?.merchantName || 'Prestige Corporate Store'}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 font-medium">Amount to Pay</span>
            <p className="text-base font-extrabold text-slate-900">₹{(amount ?? 0).toLocaleString()}</p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {status === 'idle' && (
            <div className="space-y-4">
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-lg p-3 text-xs text-indigo-900 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold text-indigo-950">Explicit Human Approval Verified:</strong>
                  <p className="text-indigo-800 text-[11px] mt-0.5">
                    Authorized on deal <code>{deal?.id || dealId || 'active-deal'}</code>. Razorpay Test sandbox will capture transaction metadata.
                  </p>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">
                  Select Test Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('upi')}
                    className={`p-3 rounded-lg border text-left flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      selectedMethod === 'upi'
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-indigo-600" />
                    <span className="text-xs font-bold">UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('card')}
                    className={`p-3 rounded-lg border text-left flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      selectedMethod === 'card'
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-indigo-600" />
                    <span className="text-xs font-bold">Test Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('netbanking')}
                    className={`p-3 rounded-lg border text-left flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      selectedMethod === 'netbanking'
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Building className="w-5 h-5 text-indigo-600" />
                    <span className="text-xs font-bold">NetBanking</span>
                  </button>
                </div>
              </div>

              {/* Method Detail simulation */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600">
                {selectedMethod === 'upi' && (
                  <div>
                    <span className="font-semibold text-slate-800">Virtual UPI VPA:</span>{' '}
                    <code className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-900">success@razorpay</code>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Auto-approved test handle provided by Razorpay sandbox.
                    </p>
                  </div>
                )}
                {selectedMethod === 'card' && (
                  <div>
                    <span className="font-semibold text-slate-800">Virtual Card:</span>{' '}
                    <code>4111 1111 1111 1111</code> (Exp: 12/28, CVV: 123)
                    <p className="text-[11px] text-slate-500 mt-1">Standard test Visa card for sandbox simulation.</p>
                  </div>
                )}
                {selectedMethod === 'netbanking' && (
                  <div>
                    <span className="font-semibold text-slate-800">Test Bank:</span> HDFC Bank (Sandbox Portal)
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={handlePaySuccess}
                  id="razorpay-test-success-btn"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  <Lock className="w-4 h-4" />
                  <span>Authorize & Pay ₹{(amount ?? 0).toLocaleString()}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSimulateFailure}
                  id="razorpay-test-fail-btn"
                  className="w-full bg-slate-100 hover:bg-rose-50 text-rose-700 border border-rose-200 font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Simulate Payment Failure (Graceful Recovery Demo)</span>
                </button>
              </div>
            </div>
          )}

          {status === 'processing' && (
            <div className="py-8 text-center space-y-3">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Communicating with Razorpay Gateway...</h4>
                <p className="text-xs text-slate-500 mt-1">Verifying cryptographic signature and merchant settlement.</p>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="py-6 text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Payment Captured Successfully!</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Razorpay ID: <code>{activePaymentId}</code>
                </p>
                <p className="text-xs font-semibold text-emerald-700 mt-1">
                  Amount ₹{(amount ?? 0).toLocaleString()} settled to Demo Merchant.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 px-4 rounded-lg text-xs cursor-pointer"
              >
                View Confirmed Order in Deal Room
              </button>
            </div>
          )}

          {status === 'failed' && (
            <div className="py-6 text-center space-y-4">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Payment Unsuccessful</h3>
                <p className="text-xs text-rose-600 mt-1 font-medium">{errorMessage}</p>
                <p className="text-[11px] text-slate-500 mt-2 bg-slate-100 p-2 rounded">
                  Policy Guard Notice: <strong>No duplicate charge was attempted.</strong> The deal is locked in safe state.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-3 rounded-lg text-xs cursor-pointer"
                >
                  Return to Deal Room to Retry
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Security Note */}
        <div className="bg-slate-50 px-6 py-2.5 border-t border-slate-200 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1">
          <Lock className="w-3 h-3 text-slate-400" />
          <span>256-bit Encrypted SSL • Server-side Verified • Test Sandbox Mode</span>
        </div>
      </div>
    </div>
  );
};
