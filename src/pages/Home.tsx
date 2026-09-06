import React from 'react';
import {
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingDown,
  Gift,
  Package,
  Award,
  Clock,
  CreditCard,
  Building,
  CheckCircle2,
  Lock,
  Percent,
} from 'lucide-react';
import { Product } from '../types';
import { RazorpayHero } from '../components/RazorpayHero';

interface HomeProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onBargainWithAI: (product: Product) => void;
  onNavigateShop: () => void;
}

export const Home: React.FC<HomeProps> = ({
  products,
  onSelectProduct,
  onBargainWithAI,
  onNavigateShop,
}) => {
  const featured = products;

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Razorpay Festive Hero Banner */}
      <RazorpayHero
        onBargainWithAI={onBargainWithAI}
        onNavigateShop={onNavigateShop}
        featuredProduct={products[0]}
      />

      {/* 2. Trusted by 10,000,000+ Businesses Trust Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <p className="text-xs uppercase tracking-widest font-bold text-slate-400">
            Trusted by high-growth companies & enterprise teams across India
          </p>
        </div>

        {/* Corporate Brand Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
          <div className="flex items-center gap-1.5 font-black text-slate-700 text-lg tracking-tight">
            <span className="text-[#FC8019]">Swiggy</span>
          </div>
          <div className="flex items-center gap-1.5 font-black text-slate-700 text-lg tracking-tight">
            <span className="text-[#CB202D]">zomato</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-slate-800 text-lg tracking-tight font-serif">
            NYKAA
          </div>
          <div className="flex items-center gap-1.5 font-bold text-slate-700 text-lg tracking-tight">
            <span>Book</span><span className="text-[#C4242D]">My</span><span>Show</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-slate-700 text-lg tracking-tight">
            <span>ZERODHA</span>
          </div>
          <div className="flex items-center gap-1.5 font-black text-slate-800 text-lg tracking-widest">
            CRED
          </div>
          <div className="flex items-center gap-1.5 font-medium text-slate-700 text-sm tracking-wide">
            urban company
          </div>
        </div>

        {/* Key Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100 text-center">
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-black text-[#0C2340]">5,000+</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Corporate Kits Delivered</div>
          </div>
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-black text-[#0C6CF2]">100%</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Razorpay Secured Checkout</div>
          </div>
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">8%</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Max Dynamic Bulk Discount</div>
          </div>
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-black text-[#0C2340]">₹1,000</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Guaranteed Margin Floor</div>
          </div>
        </div>
      </section>

      {/* 3. Featured Products Section with Razorpay Clean Card Design */}
      <section id="razorpay-products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0C6CF2] text-xs font-bold mb-2">
              <Sparkles className="w-3 h-3" />
              Agentic Deal Room Enabled
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0C2340]">
              Corporate Essentials & Bulk Gifting
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Select items, request customized packaging, and bargain pricing directly with our autonomous AI merchant.
            </p>
          </div>
          <button
            onClick={onNavigateShop}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0C6CF2] hover:text-[#0957C3] transition-colors"
          >
            <span>View All Products ({products.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group"
            >
              {/* Image Banner */}
              <div
                onClick={() => onSelectProduct(product)}
                className="relative h-48 bg-slate-100 overflow-hidden cursor-pointer"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.badge && (
                  <span className="absolute top-3 left-3 bg-[#0C2340] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                    {product.badge}
                  </span>
                )}
                <span className="absolute bottom-3 right-3 bg-white/95 text-slate-800 text-[10px] font-semibold px-2 py-0.5 rounded shadow-xs">
                  {product.category}
                </span>
              </div>

              {/* Card Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    onClick={() => onSelectProduct(product)}
                    className="font-bold text-[#0C2340] text-sm hover:text-[#0C6CF2] transition-colors cursor-pointer line-clamp-1"
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {product.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-baseline justify-between mb-3">
                    <div>
                      <span className="text-base font-extrabold text-[#0C2340]">
                        ₹{product.price.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 ml-1">/ unit</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                      Stock: {product.inventory}
                    </span>
                  </div>

                  {/* Dual Actions: View / Bargain */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onSelectProduct(product)}
                      className="text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 py-2 rounded-md transition-colors text-center"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => onBargainWithAI(product)}
                      className="flex items-center justify-center gap-1 text-xs font-bold text-white bg-[#0C6CF2] hover:bg-[#0957C3] py-2 rounded-md transition-colors shadow-xs"
                    >
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>Bargain</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Razorpay Agentic Commerce Flow Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-6 sm:p-10">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 text-[#0C6CF2] text-xs font-bold mb-3">
              <Zap className="w-3.5 h-3.5 fill-[#0C6CF2]" />
              Razorpay Agentic Architecture
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0C2340]">
              How Agent-to-Agent Bargaining Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Experience the future of commerce: conversational bargaining guided by real merchant policies, progressive discount counteroffers, and instant Razorpay checkout.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#0C6CF2] flex items-center justify-center font-black text-sm mb-3">
                1
              </div>
              <h4 className="font-bold text-[#0C2340] text-sm mb-1">Pick Product & Quantity</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Choose any item from corporate gift boxes to executive accessories and set your target order quantity.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#0C6CF2] flex items-center justify-center font-black text-sm mb-3">
                2
              </div>
              <h4 className="font-bold text-[#0C2340] text-sm mb-1">Bargain Naturally</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Chat with the AI Sales Assistant. The agent makes progressive counteroffers while strictly respecting merchant policy guardrails.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-sm mb-3">
                3
              </div>
              <h4 className="font-bold text-[#0C2340] text-sm mb-1">Lock Deal & Add-ons</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Receive an official Deal Ticket with your negotiated unit price, total savings breakdown, and optional gift-wrap add-ons.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#0C6CF2] flex items-center justify-center font-black text-sm mb-3">
                4
              </div>
              <h4 className="font-bold text-[#0C2340] text-sm mb-1">Razorpay Checkout</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Add to cart and execute a 1-click test payment with UPI, QR code, Cards, or NetBanking with instant order confirmation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Razorpay Security & Compliance Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0C2340] text-white rounded-2xl p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <span className="bg-[#0C6CF2] text-white text-[11px] font-bold px-2.5 py-0.5 rounded">
                RBI AUTHORIZED
              </span>
              <span className="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded">
                PCI-DSS LEVEL 1
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              Enterprise Grade Security & Merchant Guardrails
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Every negotiation is bounded by cryptographic policy rules to prevent low-ball exploitation, while payments are secured through end-to-end tokenization.
            </p>
          </div>

          <button
            onClick={onNavigateShop}
            className="bg-[#0C6CF2] hover:bg-[#0957C3] text-white font-bold text-sm px-6 py-3 rounded-md shadow-md transition-all whitespace-nowrap"
          >
            Start Corporate Order
          </button>
        </div>
      </section>
    </div>
  );
};
