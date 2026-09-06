import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ShoppingBag,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Plus,
  Minus,
  Tag,
} from 'lucide-react';
import { Product } from '../types';
import { calculateBulkPricing, getAllBulkTiers } from '../utils/pricing';

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBargainWithAI: (product: Product, quantity: number) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onBargainWithAI,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!isOpen || !product) return null;

  const currentPrice = product.price + (product.variants[selectedVariant]?.priceDelta || 0);
  const bulkTier = calculateBulkPricing(product, quantity);

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row">
        {/* Left Column: Product Photography */}
        <div className="md:w-1/2 bg-slate-100 relative min-h-[260px] md:min-h-[420px] flex items-center justify-center p-6">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full max-h-[360px] object-cover rounded-xl shadow-xs"
          />
          {product.badge && (
            <span className="absolute top-4 left-4 bg-slate-900/85 text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs">
              {product.badge}
            </span>
          )}
          <button
            onClick={onClose}
            className="md:hidden absolute top-4 right-4 p-2 bg-white/80 rounded-full text-slate-700 hover:bg-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Right Column: Details & Actions */}
        <div className="md:w-1/2 p-6 overflow-y-auto flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-indigo-600">
                {product.category}
              </span>
              <button
                onClick={onClose}
                className="hidden md:block text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-xl font-bold text-slate-900 mt-1">{product.name}</h2>

            <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
              <div className="flex items-center text-amber-500">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-semibold ml-1 text-slate-800">4.8</span>
                <span className="text-slate-400 ml-1">(42 reviews)</span>
              </div>
              <span>&bull;</span>
              <span className="text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                In Stock ({product.inventory} available)
              </span>
            </div>

            <div className="mt-4 pb-4 border-b border-slate-100">
              <div className="text-2xl font-extrabold text-slate-900">
                ₹{currentPrice.toLocaleString()}
                <span className="text-xs font-normal text-slate-500 ml-2">
                  (incl. all taxes)
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mt-3">
              {product.description}
            </p>

            {/* Variants if any */}
            {product.variants && product.variants.length > 0 && (
              <div className="mt-4">
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Select Style / Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedVariant(i)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                        selectedVariant === i
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 font-medium'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {v.name} {v.priceDelta > 0 && `(+₹${v.priceDelta})`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Key Specifications */}
            {product.attributes && Object.keys(product.attributes).length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-semibold text-slate-800 mb-2">Specifications</h4>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  {Object.entries(product.attributes).map(([k, v]) => (
                    <div key={k} className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="font-medium text-slate-700 capitalize">{k}: </span>
                      <span>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Area */}
          <div className="mt-6 pt-4 border-t border-slate-200 space-y-3">
            {/* Quantity Selector & Bulk Tiers */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Quantity:</span>
                <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 py-1.5 text-xs font-bold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))}
                    className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Bulk Tier Buttons */}
              <div className="grid grid-cols-4 gap-1.5 text-center text-[11px]">
                {getAllBulkTiers(product).map((t) => {
                  const isActive = bulkTier.tierRange === t.tierRange;
                  return (
                    <button
                      key={t.tierRange}
                      type="button"
                      onClick={() => {
                        const minQty =
                          t.tierRange === '1-9'
                            ? 1
                            : t.tierRange === '10-24'
                            ? 10
                            : t.tierRange === '25-49'
                            ? 25
                            : 50;
                        setQuantity(minQty);
                      }}
                      className={`py-1.5 px-1 rounded-lg border transition-all ${
                        isActive
                          ? 'bg-blue-50 border-[#0C6CF2] text-[#0C2340] font-bold shadow-2xs ring-1 ring-[#0C6CF2]'
                          : 'bg-slate-50/80 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-bold">{t.tierRange} units</div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {t.tierRange === '1-9'
                          ? 'Normal price'
                          : t.tierRange === '10-24'
                          ? 'Small bulk'
                          : t.tierRange === '25-49'
                          ? 'Medium bulk'
                          : 'Max bulk'}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Live Bulk Pricing Calculation: Quantity, Price per unit, Discount, Total price */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 text-xs">
                <div className="flex items-center justify-between text-[11px] mb-1.5 pb-1 border-b border-slate-200/60">
                  <span className="text-slate-600 font-medium flex items-center gap-1">
                    <Tag className="w-3 h-3 text-[#0C6CF2]" />
                    Bulk Tier:
                  </span>
                  <span className={`font-bold ${bulkTier.discountPercent > 0 ? 'text-[#0C6CF2]' : 'text-slate-700'}`}>
                    {bulkTier.tierName} ({bulkTier.tierRange} units)
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-slate-600">
                  <div>
                    <span className="text-slate-400">Quantity:</span>{' '}
                    <strong className="text-slate-800">{quantity} units</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Price/unit:</span>{' '}
                    <strong className="text-slate-900">₹{bulkTier.unitPrice.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Discount:</span>{' '}
                    <strong className={bulkTier.discountPerUnit > 0 ? 'text-emerald-700' : 'text-slate-700'}>
                      {bulkTier.discountPerUnit > 0 ? `₹${bulkTier.discountPerUnit}/unit (${bulkTier.discountPercent}%)` : 'Normal Price'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Total:</span>{' '}
                    <strong className="text-[#0C6CF2]">₹{bulkTier.totalPrice.toLocaleString()}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons: Add to Cart & Bargain with AI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                id="btn-add-to-cart-details"
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-3 px-4 rounded-xl transition-colors shadow-xs"
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart (₹{bulkTier.totalPrice.toLocaleString()})</span>
                  </>
                )}
              </button>

              <button
                id="btn-bargain-with-ai"
                onClick={() => {
                  onClose();
                  onBargainWithAI(product, quantity);
                }}
                className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs font-bold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-indigo-500/20"
              >
                <Sparkles className="w-4 h-4" />
                <span>Bargain with AI</span>
              </button>
            </div>

            <div className="flex items-center justify-around pt-1 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-indigo-600" /> Free Dispatch
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Authentic Goods
              </span>
              <span className="flex items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5 text-slate-600" /> 7-Day Returns
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
