import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  Tag,
  Code,
  Sparkles,
  X,
  Loader2,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { Product } from '../types';
import { api } from '../lib/api';

export const Catalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'ai-json'>('table');

  // New product form
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Corporate Gifts');
  const [newProdPrice, setNewProdPrice] = useState('1500');
  const [newProdCost, setNewProdCost] = useState('900');
  const [newProdInventory, setNewProdInventory] = useState('50');
  const [newProdDesc, setNewProdDesc] = useState('');

  const loadCatalog = async () => {
    try {
      setLoading(true);
      const data = await api.getCatalog();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) return;

    const price = Number(newProdPrice) || 1000;
    const cost = Number(newProdCost) || 600;
    const margin = price - cost;

    await api.addProduct({
      name: newProdName,
      category: newProdCategory,
      price,
      cost,
      margin,
      inventory: Number(newProdInventory) || 20,
      description: newProdDesc || `${newProdName} for AI Deal Room catalog`,
      variants: [{ name: 'Standard Edition', priceDelta: 0 }],
      attributes: { tier: 'Corporate', quality: 'Executive' },
      addOns: ['prod-pkg-premium', 'prod-greeting-card'],
      bundleCompatibility: ['prod-corp-gift'],
      deliveryTimeDays: 3,
      shippingCost: 150,
      discountEligible: true,
      maxDiscountPercent: 8,
      purchaseRestrictions: ['Subject to standard merchant floor'],
    });

    setShowAddModal(false);
    setNewProdName('');
    setNewProdDesc('');
    loadCatalog();
  };

  // Pre-mapped AI Recommendation strategies for requested sample products
  const getAiRecommendation = (prod: Product) => {
    if (prod.id.includes('pkg')) {
      return 'Primary Bundle Add-on: +₹150/unit at 57% merchant gross margin';
    }
    if (prod.id.includes('card')) {
      return 'High-Satisfaction Cross-sell: Personalized greeting at 75% margin';
    }
    if (prod.name.includes('Gift Box')) {
      return 'Anchor Product: Pair with Satin Packaging & Greeting Cards for ₹8,350+ basket';
    }
    if (prod.name.includes('Welcome Kit')) {
      return 'Onboarding Anchor: Pair with Wireless Mouse & Insulated Bottle';
    }
    if (prod.name.includes('Bag')) {
      return 'Executive Upsell: Bundle with Wireless Mouse (78% affinity match)';
    }
    if (prod.name.includes('Mouse')) {
      return 'Cross-sell Candidate: Compatible with Laptop Bags and Welcome Kits';
    }
    if (prod.name.includes('Organizer')) {
      return 'High-Margin Desk Upgrade: 15W wireless charger bundle addition';
    }
    if (prod.name.includes('Bottle')) {
      return 'Wellness Add-on: High-volume branded merchandise companion';
    }
    if (prod.name.includes('Notebook')) {
      return 'Stationery Essential: Non-discountable premium corporate inclusion';
    }
    return 'Algorithmic dynamic bundle candidate within merchant floor margin';
  };

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Product Catalog</h1>
            <span className="bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded">
              AI-Readable Knowledge Base
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Machine-readable inventory with live pricing, margins, and autonomous bundle recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex rounded-lg border border-slate-200 p-0.5 bg-slate-100 text-xs">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode('ai-json')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'ai-json' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>AI Schema</span>
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            id="add-product-btn"
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search catalog by name, category, or SKU..."
            className="w-full pl-9 pr-3 py-1.5 text-xs text-slate-800 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main View Area */}
      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-semibold">Loading Catalog Items...</p>
        </div>
      ) : viewMode === 'table' ? (
        /* CLEAN PRODUCT TABLE AS REQUESTED IN SECTION 14:
           Product | Category | Price | Inventory | Margin | AI Recommendations */
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4 text-center">Inventory</th>
                  <th className="py-3 px-4 text-right">Margin</th>
                  <th className="py-3 px-4">AI Recommendations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filtered.map((prod) => {
                  const marginPct = prod.price > 0 ? Math.round(((prod.margin ?? 0) / prod.price) * 100) : 0;
                  return (
                    <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Product Name & SKU */}
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div>
                          <span>{prod.name}</span>
                          <span className="block text-[10px] font-mono text-slate-400 font-normal">
                            SKU: {prod.id}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="bg-slate-100 text-slate-700 text-[11px] px-2 py-0.5 rounded font-semibold">
                          {prod.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                        ₹{(prod.price ?? 0).toLocaleString()}
                      </td>

                      {/* Inventory */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                            (prod.inventory ?? 0) > 30
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {(prod.inventory ?? 0)} units
                        </span>
                      </td>

                      {/* Margin */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-extrabold text-slate-900">
                          ₹{(prod.margin ?? 0).toLocaleString()}
                        </span>
                        <span className="block text-[10px] text-emerald-600 font-semibold">
                          {marginPct}% margin
                        </span>
                      </td>

                      {/* AI Recommendations */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="flex items-start gap-1.5 text-[11px] text-slate-600">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">{getAiRecommendation(prod)}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* AI JSON Schema View */
        <div className="bg-slate-950 text-slate-200 p-5 rounded-xl font-mono text-xs overflow-x-auto shadow-inner border border-slate-800">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-slate-400">
            <span>Machine-Readable Knowledge Representation</span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">JSON</span>
          </div>
          <pre>{JSON.stringify(filtered, null, 2)}</pre>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">Add Product to AI Catalog</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Standard Corporate Gift Box"
                  className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Cost (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProdCost}
                    onChange={(e) => setNewProdCost(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Inventory Qty</label>
                  <input
                    type="number"
                    value={newProdInventory}
                    onChange={(e) => setNewProdInventory(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  placeholder="Product description for AI semantic matching..."
                  className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg cursor-pointer"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
