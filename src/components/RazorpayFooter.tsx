import React from 'react';
import { ShieldCheck, Sparkles, Lock, ArrowRight, ExternalLink } from 'lucide-react';

export const RazorpayFooter: React.FC = () => {
  return (
    <footer className="bg-[#0C2340] text-slate-400 text-xs mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Column 1: Store Brand */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2 select-none">
              <div className="w-7 h-7 rounded-md bg-[#0C6CF2] text-white flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold tracking-tight text-white text-2xl font-sans">
                Prestige
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Curated luxury business essentials, corporate gifting kits, and premium workspace accessories with autonomous AI Deal Room bargaining. Payments processed securely via Razorpay.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-slate-300">
              <span className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0C6CF2]" />
                PCI-DSS Level 1 via Razorpay
              </span>
              <span className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                100% Secure Checkout
              </span>
            </div>
          </div>

          {/* Column 2: Store Catalog */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Store Catalog
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li className="hover:text-white cursor-pointer transition-colors">Corporate Gift Boxes</li>
              <li className="hover:text-white cursor-pointer transition-colors">Executive Notebooks</li>
              <li className="hover:text-white cursor-pointer transition-colors">Premium Pen Sets</li>
              <li className="hover:text-white cursor-pointer transition-colors">Employee Welcome Kits</li>
              <li className="hover:text-white cursor-pointer transition-colors">Workspace Accessories</li>
            </ul>
          </div>

          {/* Column 3: AI Deal Room */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1">
              <span>AI Deal Room</span>
              <span className="bg-[#0C6CF2] text-white text-[9px] font-bold px-1 rounded">LIVE</span>
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li className="hover:text-white cursor-pointer transition-colors">Autonomous Bargaining</li>
              <li className="hover:text-white cursor-pointer transition-colors">Volume Tier Discounts</li>
              <li className="hover:text-white cursor-pointer transition-colors">Merchant Floor Defense</li>
              <li className="hover:text-white cursor-pointer transition-colors">Instant Deal Tickets</li>
              <li className="hover:text-white cursor-pointer transition-colors">Custom Packaging Add-ons</li>
            </ul>
          </div>

          {/* Column 4: Customer Care & Payments */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Customer Care
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li className="hover:text-white cursor-pointer transition-colors">Track Orders</li>
              <li className="hover:text-white cursor-pointer transition-colors">Bulk Corporate Inquiries</li>
              <li className="hover:text-white cursor-pointer transition-colors">GST Invoicing</li>
              <li className="hover:text-white cursor-pointer transition-colors">Shipping Policy</li>
              <li className="hover:text-white cursor-pointer transition-colors">Razorpay Payment Modes</li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© Prestige Corporate Store {new Date().getFullYear()}. All rights reserved. Secured by Razorpay.</p>
          <div className="flex flex-wrap items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms & Conditions</span>
            <span className="hover:text-slate-300 cursor-pointer">Security Standards</span>
            <span className="hover:text-slate-300 cursor-pointer">Responsible Disclosure</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
