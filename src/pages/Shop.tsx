import React, { useState } from 'react';
import {
  Sparkles,
  ShoppingBag,
  Star,
  Search,
  Check,
  Plus,
  Minus,
  Tag,
} from 'lucide-react';
import { Product } from '../types';
import { calculateBulkPricing } from '../utils/pricing';

interface ShopProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBargainWithAI: (product: Product, quantity: number) => void;
}

export const Shop: React.FC<ShopProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onBargainWithAI,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  const categories = ['All', 'Corporate Gifts', 'Stationery', 'Bags & Luggage', 'Tech Accessories', 'Drinkware', 'Desk Accessories'];

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const getQty = (id: string) => quantities[id] || 1;

  const setQty = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta),
    }));
  };

  const handleQuickAdd = (product: Product) => {
    const qty = getQty(product.id);
    onAddToCart(product, qty);
    setAddedItemIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-[#0C2340] text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Executive Corporate Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Corporate Executive Shop</h1>
          <p className="mt-2 text-slate-300 text-xs sm:text-sm leading-relaxed">
            Order single units or negotiate dynamic bulk pricing on premium corporate essentials.
            Click <strong className="text-white">Bargain with AI</strong> on any item to open the live deal room.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3.5 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#0C6CF2] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0C6CF2] focus:border-transparent shadow-xs"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((product) => {
          const qty = getQty(product.id);
          const isAdded = addedItemIds[product.id];
          const tier = calculateBulkPricing(product, qty);

          return (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group"
            >
              {/* Product Visual */}
              <div>
                <div
                  onClick={() => onSelectProduct(product)}
                  className="relative h-52 bg-slate-100 overflow-hidden cursor-pointer"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.badge && (
                    <span className="absolute top-3 left-3 bg-slate-900/90 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                      {product.badge}
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 bg-white/90 text-slate-800 text-[11px] font-medium px-2 py-0.5 rounded-md shadow-xs">
                    {product.category}
                  </span>
                </div>

                {/* Details */}
                <div className="p-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <div className="flex items-center text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span className="ml-1 text-slate-700 font-medium">4.8</span>
                    </div>
                    <span className="text-emerald-700 font-medium bg-emerald-50 px-2 py-0.2 rounded-full">
                      In Stock ({product.inventory})
                    </span>
                  </div>

                  <h3
                    onClick={() => onSelectProduct(product)}
                    className="font-bold text-slate-900 text-sm hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1"
                  >
                    {product.name}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Price & Action Bottom Area */}
              <div className="p-4 pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between mb-3">
                  <div>
                    <div className="text-lg font-bold text-slate-900">
                      ₹{product.price.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-slate-400">Regular Unit Price</span>
                  </div>

                  {/* Quantity selector */}
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden text-xs">
                    <button
                      onClick={() => setQty(product.id, -1)}
                      className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2.5 py-1 font-semibold text-slate-800">{qty}</span>
                    <button
                      onClick={() => setQty(product.id, 1)}
                      className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Bulk Pricing Tier & Live Dynamic Details */}
                <div className="mb-3 bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 text-xs">
                  <div className="flex items-center justify-between text-[11px] mb-1.5 pb-1 border-b border-slate-200/60">
                    <span className="text-slate-600 font-medium flex items-center gap-1">
                      <Tag className="w-3 h-3 text-[#0C6CF2]" />
                      Bulk Tier:
                    </span>
                    <span className={`font-bold ${tier.discountPercent > 0 ? 'text-[#0C6CF2]' : 'text-slate-700'}`}>
                      {tier.tierName} ({tier.tierRange} units)
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-slate-600">
                    <div>
                      <span className="text-slate-400">Quantity:</span>{' '}
                      <strong className="text-slate-800">{qty} units</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Price/unit:</span>{' '}
                      <strong className="text-slate-900">₹{tier.unitPrice.toLocaleString()}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Discount:</span>{' '}
                      <strong className={tier.discountPerUnit > 0 ? 'text-emerald-700' : 'text-slate-700'}>
                        {tier.discountPerUnit > 0 ? `₹${tier.discountPerUnit}/unit (${tier.discountPercent}%)` : 'Normal Price'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Total:</span>{' '}
                      <strong className="text-[#0C6CF2]">₹{tier.totalPrice.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>

                {/* Main Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    id={`btn-cart-${product.id}`}
                    onClick={() => handleQuickAdd(product)}
                    className="flex items-center justify-center gap-1 text-xs font-semibold py-2 px-2 rounded-lg border border-slate-300 text-slate-800 hover:bg-slate-50 transition-colors"
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Added!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5 text-slate-600" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  <button
                    id={`btn-bargain-${product.id}`}
                    onClick={() => onBargainWithAI(product, qty)}
                    className="flex items-center justify-center gap-1 text-xs font-bold py-2 px-2 rounded-lg bg-[#0C6CF2] hover:bg-[#0957C3] text-white transition-all shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Bargain with AI</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
