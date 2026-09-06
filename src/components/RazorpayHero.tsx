import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  CreditCard,
  RefreshCw,
  Building2,
  Coins,
  Users,
  HelpCircle,
  CheckCircle2,
  ShoppingBag,
  Zap,
} from 'lucide-react';
import { Product } from '../types';

interface RazorpayHeroProps {
  onBargainWithAI: (product?: Product) => void;
  onNavigateShop: () => void;
  featuredProduct?: Product;
}

export const RazorpayHero: React.FC<RazorpayHeroProps> = ({
  onBargainWithAI,
  onNavigateShop,
  featuredProduct,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const productPills = [
    { label: 'Corporate Gifts', icon: ShoppingBag, action: () => onNavigateShop() },
    { label: 'Stationery & Pens', icon: Building2, action: () => onNavigateShop() },
    { label: 'Executive Tech', icon: Zap, action: () => onNavigateShop() },
    { label: 'Welcome Kits', icon: Users, action: () => onNavigateShop() },
    {
      label: 'AI Deal Room',
      icon: Sparkles,
      highlight: true,
      action: () => onBargainWithAI(featuredProduct),
    },
    { label: 'Browse All', icon: ArrowRight, action: () => onNavigateShop() },
  ];

  return (
    <div className="relative bg-white pt-6 pb-20 overflow-hidden border-b border-slate-100">
      {/* Background soft ambient gradient */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-blue-50/70 via-transparent to-transparent pointer-events-none" />

      {/* Carousel navigation arrows */}
      <button
        onClick={() => setActiveSlide((prev) => (prev === 0 ? 1 : 0))}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-400 flex items-center justify-center shadow-sm transition-all"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={() => setActiveSlide((prev) => (prev === 0 ? 1 : 0))}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-400 flex items-center justify-center shadow-sm transition-all"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          {/* Left Column: Razorpay Festive Typography */}
          <div className="lg:col-span-6 z-10 space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#0C6CF2] border border-blue-200 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#0C6CF2]" />
                <span>Next-Gen Agentic Commerce</span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black text-[#0C2340] leading-tight tracking-tight">
                Executive Corporate Store <br />
                <span className="text-[#0C6CF2]">with Real-Time AI Deals</span>
              </h1>
            </div>

            <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
              Curated luxury business essentials, corporate gifting kits, and premium workspace accessories. Negotiate volume orders directly with our autonomous AI Deal Room within merchant guardrails.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                id="hero-signup-btn"
                onClick={onNavigateShop}
                className="bg-[#0C6CF2] hover:bg-[#0957C3] text-white font-bold text-sm px-7 py-3.5 rounded-md shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Shop Catalog</span>
              </button>

              {featuredProduct && (
                <button
                  id="hero-ai-bargain-btn"
                  onClick={() => onBargainWithAI(featuredProduct)}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-sm shadow-xs transition-all"
                >
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Bargain with AI</span>
                </button>
              )}

              <button
                onClick={() => {
                  const el = document.getElementById('razorpay-products-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-[#0C6CF2] hover:text-[#0957C3] font-semibold text-sm px-3 py-3.5 flex items-center gap-1.5 transition-colors"
              >
                <span>View Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Micro badges below CTA */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-4 text-xs text-slate-500 border-t border-slate-100">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#0C6CF2]" />
                Live AI Counteroffers
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#0C6CF2]" />
                Merchant Margin Protected
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#0C6CF2]" />
                Secured by Razorpay Checkout
              </span>
            </div>
          </div>

          {/* Right Column: Exact Merchant Hero Visual with 3D Geometric Banner and Gold Seal */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-tr from-blue-50 to-white p-2 sm:p-4">
              {/* Main Photo of Indian Entrepreneur packing corporate gift boxes */}
              <div className="relative rounded-xl overflow-hidden shadow-xl aspect-16/10 bg-slate-100">
                <img
                  src="/src/assets/images/razorpay_merchant_hero_1788630039168.jpg"
                  alt="Razorpay Merchant packing corporate boxes"
                  className="w-full h-full object-cover object-center"
                />

                {/* 3D Angled Electric Blue Geometric Banner: "ZERO* PLATFORM FEES FOR 90 DAYS" */}
                <div className="absolute top-0 right-0 z-20 pointer-events-none drop-shadow-xl">
                  <div
                    className="bg-[#0C6CF2] text-white px-5 sm:px-7 py-4 sm:py-5 shadow-2xl relative"
                    style={{
                      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 15% 100%)',
                    }}
                  >
                    <div className="text-right pr-1 space-y-0.5">
                      <div className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-white">
                        ZERO<span className="text-sm font-bold align-top">*</span>
                      </div>
                      <div className="text-lg sm:text-xl font-black tracking-wider leading-none text-white">
                        PLATFORM
                      </div>
                      <div className="text-xl sm:text-2xl font-black tracking-wider leading-none text-white">
                        FEES
                      </div>
                      <div className="text-[10px] sm:text-xs font-bold tracking-widest text-blue-100 uppercase pt-1">
                        FOR 90 DAYS
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metallic Gold Seal Sticker: "LIMITED PERIOD OFFER" */}
                <div className="absolute bottom-6 right-8 z-20 transform -rotate-12 hover:rotate-0 transition-transform cursor-pointer drop-shadow-lg">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#E2B755] via-[#FCE38A] to-[#B8860B] p-1 flex items-center justify-center text-center shadow-lg border-2 border-dashed border-[#8A6405]">
                    <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#F3E5AB] flex flex-col items-center justify-center p-1 text-[#4A3B05]">
                      <span className="text-[8px] sm:text-[9px] font-mono tracking-tighter uppercase font-semibold text-[#665005]">
                        // LIMITED PERIOD //
                      </span>
                      <span className="text-[11px] sm:text-[13px] font-black tracking-tight leading-tight uppercase font-serif">
                        LIMITED
                      </span>
                      <span className="text-[11px] sm:text-[13px] font-black tracking-tight leading-tight uppercase font-serif">
                        PERIOD
                      </span>
                      <span className="text-[11px] sm:text-[13px] font-black tracking-tight leading-tight uppercase font-serif">
                        OFFER
                      </span>
                      <span className="text-[7px] sm:text-[8px] font-mono tracking-tighter uppercase text-[#665005]">
                        // OFFER //
                      </span>
                    </div>
                  </div>
                </div>

                {/* Terms and conditions fine print */}
                <div className="absolute bottom-1 right-2 z-10 text-[10px] sm:text-[11px] text-slate-500 italic font-medium bg-white/70 px-1.5 py-0.5 rounded">
                  *T&C apply
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Floating Product Dock (Exact match from screenshot!) */}
        <div className="mt-10 sm:mt-14 relative z-30">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-3 sm:p-4 max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
            {/* Dock Header */}
            <div className="flex items-center gap-2 px-2 text-sm font-bold text-[#0C2340]">
              <div className="w-6 h-6 rounded-md bg-blue-100 text-[#0C6CF2] flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 fill-[#0C6CF2]" />
              </div>
              <span>Looking for a product?</span>
            </div>

            {/* Product Pill Actions */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              {productPills.map((pill, idx) => {
                const IconComponent = pill.icon;
                return (
                  <button
                    key={idx}
                    onClick={pill.action}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border shadow-xs ${
                      pill.highlight
                        ? 'bg-blue-50 text-[#0C6CF2] border-[#2B83EA] hover:bg-blue-100 scale-105'
                        : 'bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#0C6CF2] border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5 text-[#0C6CF2]" />
                    <span>{pill.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
