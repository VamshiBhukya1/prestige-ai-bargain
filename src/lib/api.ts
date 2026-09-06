import {
  Product,
  Deal,
  CartItem,
  Order,
  MerchantPolicy,
  BuyerIntent,
  Transaction,
  AuditEvent,
  RevenueMetrics,
} from '../types';

export const api = {
  // Health
  async getHealth() {
    const res = await fetch('/api/health');
    return res.json();
  },

  // Catalog
  async getCatalog(): Promise<Product[]> {
    const res = await fetch('/api/catalog');
    if (!res.ok) throw new Error('Failed to load catalog');
    return res.json();
  },

  async getProduct(id: string): Promise<Product> {
    const res = await fetch(`/api/catalog/${id}`);
    if (!res.ok) throw new Error('Product not found');
    return res.json();
  },

  async addProduct(product: Partial<Product>): Promise<Product> {
    const res = await fetch('/api/catalog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    return res.json();
  },

  // Deals
  async getDeals(): Promise<Deal[]> {
    const res = await fetch('/api/deals');
    if (!res.ok) return [];
    return res.json();
  },

  async getDeal(id: string): Promise<Deal> {
    const res = await fetch(`/api/deals/${id}`);
    if (!res.ok) throw new Error('Deal not found');
    return res.json();
  },

  async createDeal(intent: any): Promise<Deal> {
    const res = await fetch('/api/deal/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ intent }),
    });
    return res.json();
  },

  async approveDeal(dealId: string): Promise<Deal> {
    const res = await fetch(`/api/deal/${dealId}/approve`, { method: 'POST' });
    return res.json();
  },

  // Intent parsing
  async parseIntent(query: string): Promise<BuyerIntent> {
    const res = await fetch('/api/buyer/intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) throw new Error('Failed to parse intent');
    return res.json();
  },

  // Policy
  async getPolicy(): Promise<MerchantPolicy> {
    const res = await fetch('/api/policy');
    return res.json();
  },

  async updatePolicy(policy: Partial<MerchantPolicy>): Promise<MerchantPolicy> {
    const res = await fetch('/api/policy', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(policy),
    });
    return res.json();
  },

  // Cart
  async getCart(): Promise<CartItem[]> {
    const res = await fetch('/api/cart');
    if (!res.ok) return [];
    return res.json();
  },

  async addToCart(productId: string, quantity: number = 1, dealId?: string): Promise<CartItem[]> {
    const res = await fetch('/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity, dealId }),
    });
    if (!res.ok) throw new Error('Failed to add to cart');
    return res.json();
  },

  async updateCartItem(id: string, quantity: number): Promise<CartItem[]> {
    const res = await fetch(`/api/cart/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });
    if (!res.ok) throw new Error('Failed to update cart');
    return res.json();
  },

  async removeFromCart(id: string): Promise<CartItem[]> {
    const res = await fetch(`/api/cart/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to remove cart item');
    return res.json();
  },

  async clearCart(): Promise<CartItem[]> {
    const res = await fetch('/api/cart', {
      method: 'DELETE',
    });
    return res.json();
  },

  // Orders & Payment
  async getOrders(): Promise<Order[]> {
    const res = await fetch('/api/orders');
    if (!res.ok) return [];
    return res.json();
  },

  async getOrder(id: string): Promise<Order> {
    const res = await fetch(`/api/orders/${id}`);
    if (!res.ok) throw new Error('Order not found');
    return res.json();
  },

  async createPaymentOrder(dealId?: string, amount?: number) {
    const res = await fetch('/api/checkout/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dealId, amount }),
    });
    return res.json();
  },

  async verifyPayment(orderId: string, paymentId: string, signature?: string, method?: string) {
    const res = await fetch('/api/checkout/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, paymentId, signature, paymentMethod: method }),
    });
    return res.json();
  },

  async simulatePaymentFailure(orderId?: string) {
    const res = await fetch('/api/checkout/simulate-failure', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    });
    return res.json();
  },

  async retryPayment(orderId: string) {
    const res = await fetch('/api/checkout/retry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    });
    return res.json();
  },

  // Revenue & Transactions & Audit
  async getRevenueMetrics(): Promise<RevenueMetrics> {
    const res = await fetch('/api/revenue/metrics');
    return res.json();
  },

  async approveRecommendation(recommendationId: string) {
    const res = await fetch(`/api/revenue/recommendation/${recommendationId}/approve`, {
      method: 'POST',
    });
    return res.json();
  },

  async getTransactions(): Promise<Transaction[]> {
    const res = await fetch('/api/transactions');
    return res.json();
  },

  async getTransactionDetails(id: string): Promise<Transaction> {
    const res = await fetch(`/api/transactions/${id}`);
    return res.json();
  },

  async getAuditLogs(): Promise<AuditEvent[]> {
    const res = await fetch('/api/audit');
    return res.json();
  },

  async runFullDemo() {
    const res = await fetch('/api/demo/run', { method: 'POST' });
    return res.json();
  },

  // Auth
  async getMe() {
    const res = await fetch('/api/auth/me');
    if (!res.ok) return { user: null };
    return res.json();
  },

  async login(payload: { email: string; password?: string }) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed.');
    }
    return data;
  },

  async register(payload: { fullName?: string; name?: string; email: string; password?: string }) {
    const nameVal = (payload.fullName || payload.name || '').trim();
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
        fullName: nameVal,
        name: nameVal,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed.');
    }
    return data;
  },

  async logout() {
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    return res.json();
  },

  // Demo Reset
  async resetDemo() {
    const res = await fetch('/api/demo/reset', { method: 'POST' });
    return res.json();
  },
};
