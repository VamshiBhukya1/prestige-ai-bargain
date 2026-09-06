import React, { useState, useEffect } from 'react';
import { RazorpayTopBanner } from './components/RazorpayTopBanner';
import { Navbar } from './components/Navbar';
import { RazorpayFooter } from './components/RazorpayFooter';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { MyDeals } from './pages/MyDeals';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { MyOrders } from './pages/MyOrders';
import { Profile } from './pages/Profile';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { BargainModal } from './components/BargainModal';
import { AuthModal } from './components/AuthModal';
import { PrestigeAssistant } from './components/PrestigeAssistant';
import { api } from './lib/api';
import { Product, Deal, CartItem, Order } from './types';
import { CheckCircle2, ShieldCheck, Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; phone?: string } | null>(null);

  // Modal & Protected Route States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [bargainProduct, setBargainProduct] = useState<Product | null>(null);
  const [bargainInitialDeal, setBargainInitialDeal] = useState<Deal | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  // Load initial app data & user profile from /api/auth/me
  const loadData = async () => {
    try {
      const [cat, dl, crt, ord, me] = await Promise.all([
        api.getCatalog(),
        api.getDeals(),
        api.getCart(),
        api.getOrders(),
        api.getMe(),
      ]);
      setProducts(cat);
      setDeals(dl);
      setCart(crt);
      setOrders(ord);
      if (me?.user) {
        setCurrentUser(me.user);
      } else {
        setCurrentUser(null);
      }
    } catch (err) {
      console.warn('Data loading error:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleNavigateTab = (tab: string) => {
    // Protected routes requiring authentication
    if (!currentUser && (tab === 'checkout' || tab === 'orders' || tab === 'profile')) {
      setPendingTab(tab);
      setAuthMode('login');
      setShowAuthModal(true);
      showToast('Please sign in to access this page.');
      return;
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart Operations
  const handleAddToCart = async (product: Product, quantity: number = 1) => {
    try {
      const updatedCart = await api.addToCart(product.id, quantity);
      setCart(updatedCart);
      showToast(`Added ${quantity} × ${product.name} to cart`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDealAddedToCart = async (deal: Deal) => {
    try {
      const updatedCart = await api.addToCart(deal.productId, deal.quantity, deal.id);
      setCart(updatedCart);
      const updatedDeals = await api.getDeals();
      setDeals(updatedDeals);
      showToast(`Added negotiated deal for ${deal.productName} to cart!`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleProceedToCheckoutFromDeal = async (deal: Deal) => {
    try {
      const updatedCart = await api.addToCart(deal.productId, deal.quantity, deal.id);
      setCart(updatedCart);
      const updatedDeals = await api.getDeals();
      setDeals(updatedDeals);
      setBargainProduct(null);
      setBargainInitialDeal(null);
      setActiveTab('checkout');
      showToast(`Deal accepted! Proceeding to checkout.`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateCartQuantity = async (id: string, qty: number) => {
    try {
      const updated = await api.updateCartItem(id, qty);
      setCart(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveFromCart = async (id: string) => {
    try {
      const updated = await api.removeFromCart(id);
      setCart(updated);
      showToast('Item removed from cart');
    } catch (err) {
      console.error(err);
    }
  };

  // Bargain Trigger
  const handleOpenBargain = (product: Product, initialDeal?: Deal) => {
    setBargainProduct(product);
    setBargainInitialDeal(initialDeal || null);
  };

  // Checkout Success
  const handleOrderSuccess = (order: Order) => {
    setCompletedOrder(order);
    setCart([]);
    api.getOrders().then(setOrders);
    api.getDeals().then(setDeals);
    setActiveTab('order-confirmation');
  };

  // Auth Operations
  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
    showToast('Logged out successfully');
    setActiveTab('home');
  };

  const handleResetDemo = async () => {
    await api.resetDemo();
    await loadData();
    showToast('Store reset to clean default state');
  };

  return (
    <div className="min-h-screen bg-white text-[#0C2340] flex flex-col font-sans">
      {/* Top Customer Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleNavigateTab}
        cartCount={cart.reduce((sum, it) => sum + it.quantity, 0)}
        dealsCount={deals.filter((d) => d.status === 'Accepted' || d.status === 'Offer Available').length}
        ordersCount={orders.length}
        user={currentUser}
        onOpenAuth={(mode) => handleOpenAuth(mode)}
        onLogout={handleLogout}
      />

      {/* Floating Toast Feedback */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0C2340] text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Main View Router */}
      <main className={`flex-1 w-full ${activeTab === 'home' ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8'}`}>
        {activeTab === 'home' && (
          <Home
            products={products}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onBargainWithAI={(p) => handleOpenBargain(p)}
            onNavigateShop={() => setActiveTab('shop')}
          />
        )}

        {activeTab === 'shop' && (
          <Shop
            products={products}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onAddToCart={handleAddToCart}
            onBargainWithAI={(p) => handleOpenBargain(p)}
          />
        )}

        {activeTab === 'deals' && (
          <MyDeals
            deals={deals}
            products={products}
            onOpenDealRoom={(p, d) => handleOpenBargain(p, d)}
            onAddToCart={handleDealAddedToCart}
            onNavigateShop={() => setActiveTab('shop')}
          />
        )}

        {activeTab === 'cart' && (
          <Cart
            items={cart}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveFromCart}
            onProceedToCheckout={() => setActiveTab('checkout')}
            onNavigateShop={() => setActiveTab('shop')}
          />
        )}

        {activeTab === 'checkout' && (
          <Checkout
            cart={cart}
            user={currentUser}
            onBackToCart={() => setActiveTab('cart')}
            onOrderSuccess={handleOrderSuccess}
          />
        )}

        {activeTab === 'orders' && (
          <MyOrders
            orders={orders}
            onNavigateShop={() => setActiveTab('shop')}
          />
        )}

        {activeTab === 'profile' && (
          <Profile
            user={currentUser}
            deals={deals}
            orders={orders}
            onLogout={handleLogout}
            onResetDemo={handleResetDemo}
          />
        )}

        {activeTab === 'order-confirmation' && completedOrder && (
          <OrderConfirmation
            order={completedOrder}
            onViewOrders={() => setActiveTab('orders')}
            onContinueShopping={() => setActiveTab('shop')}
          />
        )}
      </main>

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onBargainWithAI={(p) => handleOpenBargain(p)}
        />
      )}

      {/* Bargain with AI Chatbot / Deal Room Modal */}
      {bargainProduct && (
        <BargainModal
          product={bargainProduct}
          isOpen={!!bargainProduct}
          onClose={() => {
            setBargainProduct(null);
            setBargainInitialDeal(null);
          }}
          onDealAddedToCart={handleDealAddedToCart}
          onProceedToCheckout={handleProceedToCheckoutFromDeal}
          initialDeal={bargainInitialDeal}
        />
      )}

      {/* Authentication Modal */}
      {showAuthModal && (
        <AuthModal
          user={currentUser}
          initialMode={authMode}
          onClose={() => {
            setShowAuthModal(false);
            setPendingTab(null);
          }}
          onAuthSuccess={(u) => {
            setCurrentUser(u);
            showToast(`Welcome, ${u.name || u.full_name}!`);
            loadData();
            if (pendingTab) {
              setActiveTab(pendingTab);
              setPendingTab(null);
            }
          }}
          onLogoutSuccess={() => {
            setCurrentUser(null);
            showToast('Logged out');
          }}
        />
      )}

      {/* Prestige AI Assistant Floating Chatbot */}
      <PrestigeAssistant
        products={products}
        onBargainWithAI={(p, q) => handleOpenBargain(p)}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onNavigateShop={() => setActiveTab('shop')}
      />

      {/* Razorpay Enterprise Footer */}
      <RazorpayFooter />
    </div>
  );
}
