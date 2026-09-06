import React, { useState } from 'react';
import {
  ShoppingBag,
  Sparkles,
  Tag,
  Package,
  User,
  LogOut,
  LogIn,
  Headphones,
  ChevronDown,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  dealsCount: number;
  ordersCount: number;
  user: { name: string; email: string } | null;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  dealsCount,
  ordersCount,
  user,
  onOpenAuth,
  onLogout,
}) => {
  const [showSupportModal, setShowSupportModal] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Store Brand Logo with Razorpay UI Styling */}
          <div className="flex items-center gap-6 lg:gap-8">
            <div
              id="brand-logo"
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2 cursor-pointer group select-none"
            >
              {/* Sleek electric blue lightning bolt badge */}
              <div className="w-8 h-8 rounded-lg bg-[#0C6CF2] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-baseline">
                <span className="font-extrabold tracking-tight text-[#0C2340] text-2xl font-sans">
                  Prestige
                </span>
                <span className="ml-2 hidden sm:inline-flex items-center gap-1 text-[11px] font-bold bg-blue-50 text-[#0C6CF2] px-2 py-0.5 rounded-full border border-blue-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0C6CF2] animate-pulse" />
                  AI Deal Room
                </span>
              </div>
            </div>

            {/* Desktop Navigation Menu (Razorpay UI styling with active blue indicator) */}
            <nav className="hidden lg:flex items-center gap-6 text-[13px] font-semibold text-[#0C2340]">
              <button
                id="nav-home"
                onClick={() => setActiveTab('home')}
                className={`transition-colors py-1 ${
                  activeTab === 'home'
                    ? 'text-[#0C6CF2] border-b-2 border-[#0C6CF2]'
                    : 'text-[#0C2340] hover:text-[#0C6CF2]'
                }`}
              >
                Home
              </button>

              <button
                id="nav-shop"
                onClick={() => setActiveTab('shop')}
                className={`transition-colors py-1 ${
                  activeTab === 'shop'
                    ? 'text-[#0C6CF2] border-b-2 border-[#0C6CF2]'
                    : 'text-[#0C2340] hover:text-[#0C6CF2]'
                }`}
              >
                Catalog & Shop
              </button>

              <button
                id="nav-deals"
                onClick={() => setActiveTab('deals')}
                className={`transition-colors py-1 flex items-center gap-1.5 ${
                  activeTab === 'deals'
                    ? 'text-[#0C6CF2] border-b-2 border-[#0C6CF2]'
                    : 'text-[#0C2340] hover:text-[#0C6CF2]'
                }`}
              >
                <span>AI Deal Room</span>
                {dealsCount > 0 ? (
                  <span className="bg-[#0C6CF2] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {dealsCount}
                  </span>
                ) : (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    Live
                  </span>
                )}
              </button>

              <button
                id="nav-orders"
                onClick={() => setActiveTab('orders')}
                className={`transition-colors py-1 flex items-center gap-1.5 ${
                  activeTab === 'orders'
                    ? 'text-[#0C6CF2] border-b-2 border-[#0C6CF2]'
                    : 'text-[#0C2340] hover:text-[#0C6CF2]'
                }`}
              >
                <span>Orders</span>
                {ordersCount > 0 && (
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {ordersCount}
                  </span>
                )}
              </button>

              <span className="hidden xl:inline-flex items-center gap-1 text-[11px] text-slate-400 font-normal pl-2 border-l border-slate-200">
                <span>Secured by</span>
                <strong className="text-[#0C6CF2] font-bold">Razorpay</strong>
              </span>
            </nav>
          </div>

          {/* Right Action Icons & Buttons (Exact Razorpay right side) */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Support / Headphone Icon */}
            <button
              onClick={() => setShowSupportModal(!showSupportModal)}
              className="p-1.5 text-[#536471] hover:text-[#0C2340] transition-colors rounded-md hover:bg-slate-50"
              title="Razorpay Support & Docs"
            >
              <Headphones className="w-5 h-5" />
            </button>

            {/* Country Selector: India 🇮🇳 */}
            <div className="hidden sm:flex items-center gap-1 text-xs font-semibold text-[#0C2340] cursor-pointer hover:opacity-80 transition-opacity">
              <span className="text-base">🇮🇳</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#536471]" />
            </div>

            {/* Shopping Cart Button */}
            <button
              id="nav-cart"
              onClick={() => setActiveTab('cart')}
              className="relative p-2 text-[#0C2340] hover:text-[#0C6CF2] hover:bg-blue-50/50 rounded-md transition-colors"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#0C6CF2] text-white text-[11px] font-bold rounded-full flex items-center justify-center px-1 shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Login / Auth Button or User Dropdown */}
            {user ? (
              <div className="flex items-center gap-2">
                <div
                  id="user-profile-badge"
                  onClick={() => setActiveTab('profile')}
                  className="flex items-center gap-2 cursor-pointer py-1.5 px-2.5 rounded-md hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-[#0C6CF2] flex items-center justify-center text-xs font-extrabold">
                    {(user.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-extrabold text-[#0C2340] hidden sm:inline max-w-[120px] truncate">
                    {user.name}
                  </span>
                </div>

                <button
                  id="btn-logout"
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="btn-login"
                onClick={() => onOpenAuth('login')}
                className="border border-[#3395FF] hover:border-[#0C6CF2] text-[#0C6CF2] hover:bg-blue-50 font-bold text-xs sm:text-sm px-3.5 py-1.5 sm:px-4 sm:py-1.5 rounded-md transition-all shadow-xs"
              >
                Sign In
              </button>
            )}

            {/* Prestige Primary Action / Create Account Button */}
            <button
              id="btn-signup"
              onClick={() => {
                if (user) {
                  setActiveTab('shop');
                } else {
                  onOpenAuth('register');
                }
              }}
              className="bg-[#0C6CF2] hover:bg-[#0957C3] text-white font-bold text-xs sm:text-sm px-4 py-1.5 sm:px-4 sm:py-2 rounded-md shadow-xs hover:shadow-md transition-all flex items-center gap-1.5"
            >
              <span>{user ? 'Explore' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Secondary Sub-navigation for Medium/Small Screens */}
        <div className="flex xl:hidden overflow-x-auto py-2 border-t border-slate-100 gap-2 no-scrollbar text-xs">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'home'
                ? 'bg-blue-50 text-[#0C6CF2] font-semibold'
                : 'text-slate-600'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('shop')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'shop'
                ? 'bg-blue-50 text-[#0C6CF2] font-semibold'
                : 'text-slate-600'
            }`}
          >
            Payments & Catalog
          </button>
          <button
            onClick={() => setActiveTab('deals')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium flex items-center gap-1 ${
              activeTab === 'deals'
                ? 'bg-blue-50 text-[#0C6CF2] font-semibold'
                : 'text-slate-600'
            }`}
          >
            <Tag className="w-3.5 h-3.5 text-emerald-600" />
            Agentic Deals {dealsCount > 0 && `(${dealsCount})`}
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'orders'
                ? 'bg-blue-50 text-[#0C6CF2] font-semibold'
                : 'text-slate-600'
            }`}
          >
            Orders {ordersCount > 0 && `(${ordersCount})`}
          </button>
        </div>
      </div>

      {/* Support Popover */}
      {showSupportModal && (
        <div className="absolute top-16 right-10 sm:right-28 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95">
          <div className="text-xs font-bold text-[#0C2340] mb-2 flex items-center justify-between">
            <span>Razorpay 24x7 Merchant Support</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Have questions about payment gateways, agentic AI negotiation limits, or bulk corporate billing?
          </p>
          <div className="space-y-2 text-xs">
            <div className="p-2 rounded-lg bg-slate-50 text-slate-700">
              <span className="font-semibold text-[#0C2340]">Merchant Hotline:</span> +91 80 6902 0000
            </div>
            <div className="p-2 rounded-lg bg-slate-50 text-slate-700">
              <span className="font-semibold text-[#0C2340]">Email:</span> support@razorpay.com
            </div>
          </div>
          <button
            onClick={() => setShowSupportModal(false)}
            className="mt-3 w-full text-center text-xs text-[#0C6CF2] font-semibold hover:underline"
          >
            Close
          </button>
        </div>
      )}
    </header>
  );
};

