import React, { useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';

export const RazorpayTopBanner: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState('United Kingdom');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const countries = [
    { name: 'United Kingdom', flag: '🇬🇧', code: 'GBP' },
    { name: 'United States', flag: '🇺🇸', code: 'USD' },
    { name: 'United Arab Emirates', flag: '🇦🇪', code: 'AED' },
    { name: 'European Union', flag: '🇪🇺', code: 'EUR' },
    { name: 'Australia', flag: '🇦🇺', code: 'AUD' },
    { name: 'Singapore', flag: '🇸🇬', code: 'SGD' },
  ];

  const current = countries.find((c) => c.name === selectedCountry) || countries[0];

  return (
    <div className="relative bg-[#EDF5FF] border-b border-[#D8E8FC] overflow-hidden text-xs text-[#0C2340]">
      {/* Subtle world map SVG background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-25 flex items-center justify-center">
        <svg
          className="w-full h-full object-cover max-w-7xl"
          viewBox="0 0 1000 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M80,45 Q120,20 180,35 T300,50 T450,25 T600,40 T750,30 T900,45"
            stroke="#2B83EA"
            strokeWidth="1.2"
            strokeDasharray="4 6"
            opacity="0.3"
          />
          <path
            d="M50,75 Q150,60 280,80 T480,65 T680,85 T880,70"
            stroke="#2B83EA"
            strokeWidth="1"
            strokeDasharray="3 5"
            opacity="0.25"
          />
          {/* Subtle continent dots */}
          <circle cx="160" cy="35" r="3" fill="#2B83EA" opacity="0.4" />
          <circle cx="280" cy="50" r="2.5" fill="#2B83EA" opacity="0.4" />
          <circle cx="520" cy="40" r="3" fill="#2B83EA" opacity="0.4" />
          <circle cx="780" cy="45" r="3.5" fill="#2B83EA" opacity="0.4" />
          <circle cx="850" cy="65" r="2" fill="#2B83EA" opacity="0.3" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 relative z-10 flex flex-wrap items-center justify-between gap-2.5">
        {/* Left Side: International Payments message & country selector */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="font-bold text-[#0C2340] text-xs tracking-tight">
            Global Corporate Orders & Multi-Currency Checkout
          </span>

          {/* Country Pill Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-[#C5DCFA] hover:border-[#2B83EA] text-xs font-semibold text-[#0C2340] shadow-xs transition-all"
            >
              <span className="text-sm">{current.flag}</span>
              <span>{current.name}</span>
              <ChevronDown className={`w-3 h-3 text-[#536471] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Select Currency Region
                </div>
                {countries.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setSelectedCountry(c.name);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-slate-800 hover:bg-blue-50 transition-colors text-left"
                  >
                    <span className="flex items-center gap-2">
                      <span>{c.flag}</span>
                      <span>{c.name}</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 font-semibold">{c.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="text-xs text-[#536471] hidden md:inline">
            Global cards, Apple Pay, Google Pay at lower fee.
          </span>

          <button
            onClick={() => {
              // Smooth scroll to catalog or show info
              const el = document.getElementById('razorpay-products-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-[#0B132B] hover:bg-[#1A2542] text-white text-[11px] font-semibold px-2.5 py-1 rounded transition-colors shadow-xs"
          >
            Know More
          </button>
        </div>

        {/* Right Side: Currency circular badges matching screenshot (£ $ R ¥ A$) */}
        <div className="hidden sm:flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-[#3395FF] text-white flex items-center justify-center font-bold text-xs shadow-xs hover:scale-105 transition-transform cursor-default" title="British Pound">
            £
          </div>
          <div className="w-6 h-6 rounded-full bg-[#3395FF] text-white flex items-center justify-center font-bold text-xs shadow-xs hover:scale-105 transition-transform cursor-default" title="US Dollar">
            $
          </div>
          <div className="w-6 h-6 rounded-full bg-[#3395FF] text-white flex items-center justify-center font-bold text-xs shadow-xs hover:scale-105 transition-transform cursor-default" title="South African Rand">
            R
          </div>
          <div className="w-6 h-6 rounded-full bg-[#3395FF] text-white flex items-center justify-center font-bold text-xs shadow-xs hover:scale-105 transition-transform cursor-default" title="Japanese Yen">
            ¥
          </div>
          <div className="w-6 h-6 rounded-full bg-[#3395FF] text-white flex items-center justify-center font-bold text-[10px] shadow-xs hover:scale-105 transition-transform cursor-default" title="Australian Dollar">
            A$
          </div>
        </div>
      </div>
    </div>
  );
};
