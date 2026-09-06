import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { sqliteDb, initSqliteDatabase } from './sqlite';
import {
  Product,
  MerchantPolicy,
  Deal,
  CartItem,
  Order,
  Transaction,
  AuditEvent,
  RevenueMetrics,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_MERCHANT_POLICY,
  INITIAL_REVENUE_METRICS,
} from '../data/initialData';
import { calculateBulkPricing } from '../utils/pricing';

export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'CUSTOMER';
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  createdAt: string;
}

export interface DatabaseState {
  users: UserRecord[];
  products: Product[];
  policy: MerchantPolicy;
  deals: Record<string, Deal>;
  cart: Record<string, CartItem[]>; // userId -> CartItem[]
  orders: Order[];
  transactions: Transaction[];
  auditLogs: AuditEvent[];
  revenueMetrics: RevenueMetrics;
  sessions: Record<string, string>; // sessionToken -> userId
}

const DB_FILE = path.join(process.cwd(), 'dealroom_db.json');

function createInitialState(): DatabaseState {
  const customerPasswordHash = bcrypt.hashSync('password123', 10);

  const defaultUsers: UserRecord[] = [
    {
      id: 'user_customer_1',
      email: 'customer@demo.com',
      passwordHash: customerPasswordHash,
      name: 'Aditi Sharma',
      role: 'CUSTOMER',
      phone: '+91 98765 43210',
      address: {
        street: '42, Cyber Hub, DLF Phase 2',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122002',
      },
      createdAt: new Date().toISOString(),
    },
  ];

  // Pre-seed 1 realistic past order for the customer
  const initialOrders: Order[] = [
    {
      id: 'ord_1042',
      orderNumber: 'ORD-1042',
      items: [
        {
          id: 'ci_demo_1',
          productId: 'prod-1',
          productName: 'Premium Corporate Gift Box',
          productImage: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80',
          quantity: 5,
          regularUnitPrice: 1850,
          unitPrice: 1700,
          isNegotiated: true,
          dealId: 'deal_demo_1',
          savingsPerUnit: 150,
          addOns: [
            { name: 'Custom Satin Ribbon Packaging', price: 100, quantity: 5 },
          ],
          subtotal: 9000,
        },
      ],
      subtotal: 9750,
      discount: 750,
      total: 9000,
      shippingAddress: {
        fullName: 'Aditi Sharma',
        email: 'customer@demo.com',
        phone: '+91 98765 43210',
        street: '42, Cyber Hub, DLF Phase 2',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122002',
      },
      paymentMethod: 'Razorpay UPI (Test)',
      paymentStatus: 'Successful',
      orderStatus: 'Confirmed',
      razorpayOrderId: 'order_rzp_test_1042',
      razorpayPaymentId: 'pay_rzp_test_9941',
      dealIds: ['deal_demo_1'],
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ];

  // Pre-seed 1 accepted deal for the customer in My Deals
  const initialDeals: Record<string, Deal> = {
    deal_demo_1: {
      id: 'deal_demo_1',
      productId: 'prod-1',
      productName: 'Premium Corporate Gift Box',
      productImage: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80',
      quantity: 5,
      regularPrice: 9250,
      negotiatedPrice: 8500,
      unitPrice: 1700,
      savings: 750,
      addOns: [
        { name: 'Custom Satin Ribbon Packaging', price: 100, quantity: 5 },
      ],
      status: 'Accepted',
      whyThisOffer: 'Your order of 5 units qualified for our wholesale volume tier. The offer protects standard store safety limits.',
      messages: [
        {
          id: 'm1',
          sender: 'ai',
          text: 'Hi Aditi! I can help you get a better deal on the Premium Corporate Gift Box. How many would you like to order today?',
          timestamp: new Date(Date.now() - 86400000 * 2 - 300000).toISOString(),
        },
        {
          id: 'm2',
          sender: 'customer',
          text: 'I need 5 boxes for our executive clients. Can you give me a better price?',
          timestamp: new Date(Date.now() - 86400000 * 2 - 250000).toISOString(),
        },
        {
          id: 'm3',
          sender: 'ai',
          text: 'For 5 units, I can offer ₹1,700 each instead of the regular ₹1,850. That brings your total to ₹8,500 (You save ₹750).',
          timestamp: new Date(Date.now() - 86400000 * 2 - 200000).toISOString(),
          offerCard: {
            productName: 'Premium Corporate Gift Box',
            quantity: 5,
            regularPrice: 9250,
            negotiatedPrice: 8500,
            unitPrice: 1700,
            savings: 750,
          },
        },
        {
          id: 'm4',
          sender: 'ai',
          text: "Since you're ordering 5 boxes, would you also like Custom Satin Ribbon Packaging for ₹100 each to elevate the unboxing experience?",
          timestamp: new Date(Date.now() - 86400000 * 2 - 150000).toISOString(),
          upsellOffer: {
            id: 'pkg-premium',
            name: 'Custom Satin Ribbon Packaging',
            pricePerUnit: 100,
            description: 'Matte executive packaging with hot-stamp branding and velvet tissue interior.',
          },
        },
        {
          id: 'm5',
          sender: 'customer',
          text: 'Yes, please add the custom packaging. I accept this deal!',
          timestamp: new Date(Date.now() - 86400000 * 2 - 100000).toISOString(),
        },
        {
          id: 'm6',
          sender: 'ai',
          text: 'Wonderful! Your customized deal is locked: 5 × Premium Corporate Gift Box (₹8,500) + 5 × Satin Packaging (₹500) = ₹9,000 Total. You saved ₹750!',
          timestamp: new Date(Date.now() - 86400000 * 2 - 50000).toISOString(),
          offerCard: {
            productName: 'Premium Corporate Gift Box',
            quantity: 5,
            regularPrice: 9750,
            negotiatedPrice: 9000,
            unitPrice: 1700,
            savings: 750,
            addOns: [{ name: 'Custom Satin Ribbon Packaging', price: 100, quantity: 5 }],
          },
        },
      ],
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  };

  return {
    users: defaultUsers,
    products: [...INITIAL_PRODUCTS],
    policy: { ...INITIAL_MERCHANT_POLICY },
    deals: initialDeals,
    cart: {
      user_customer_1: [],
    },
    orders: initialOrders,
    transactions: [],
    auditLogs: [],
    revenueMetrics: { ...INITIAL_REVENUE_METRICS },
    sessions: {},
  };
}

class DatabaseManager {
  private state: DatabaseState;

  constructor() {
    this.state = this.load();
  }

  private load(): DatabaseState {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure products are strictly our 8 clean products
        parsed.products = [...INITIAL_PRODUCTS];
        if (!parsed.cart || typeof parsed.cart !== 'object') parsed.cart = {};

        // Ensure default customer user exists
        if (!parsed.users || !Array.isArray(parsed.users)) {
          parsed.users = createInitialState().users;
        } else {
          const hasCustomer = parsed.users.some((u: any) => u.email === 'customer@demo.com');
          if (!hasCustomer) {
            parsed.users.push(...createInitialState().users);
          }
        }

        // Ensure orders exist and are sanitized
        if (!parsed.orders || !Array.isArray(parsed.orders) || parsed.orders.length === 0) {
          parsed.orders = createInitialState().orders;
        } else {
          parsed.orders = parsed.orders.map((o: any) => ({
            ...o,
            subtotal: Number(o.subtotal ?? 0),
            discount: Number(o.discount ?? 0),
            total: Number(o.total ?? 0),
            items: Array.isArray(o.items)
              ? o.items.map((it: any) => ({
                  ...it,
                  unitPrice: Number(it.unitPrice ?? 0),
                  regularUnitPrice: Number(it.regularUnitPrice ?? it.unitPrice ?? 0),
                  subtotal: Number(it.subtotal ?? (it.unitPrice ?? 0) * (it.quantity ?? 1)),
                  quantity: Number(it.quantity ?? 1),
                }))
              : [],
            shippingAddress: o.shippingAddress || {
              fullName: 'Aditi Sharma',
              email: 'customer@demo.com',
              phone: '+91 98765 43210',
              street: '42, Cyber Hub, DLF Phase 2',
              city: 'Gurugram',
              state: 'Haryana',
              pincode: '122002',
            },
          }));
        }

        // Migrate and sanitize deals to guarantee all required fields exist
        if (!parsed.deals || typeof parsed.deals !== 'object' || Object.keys(parsed.deals).length === 0) {
          parsed.deals = createInitialState().deals;
        } else {
          for (const [key, deal] of Object.entries(parsed.deals as Record<string, any>)) {
            if (!deal || typeof deal !== 'object') {
              delete parsed.deals[key];
              continue;
            }
            const matchedProd =
              INITIAL_PRODUCTS.find(
                (p) => p.name === deal.buyerIntent?.product || p.id === deal.productId
              ) || INITIAL_PRODUCTS[0];
            const qty = Number(
              deal.quantity || deal.buyerIntent?.quantity || (deal.items && deal.items[0]?.quantity) || 5
            );
            const regPrice = Number(deal.regularPrice ?? deal.baseValue ?? matchedProd.price * qty);
            const negPrice = Number(deal.negotiatedPrice ?? deal.finalAmount ?? Math.round(regPrice * 0.92));
            const unitPrice = Number(deal.unitPrice ?? Math.round(negPrice / qty));
            const savings = Number(deal.savings ?? Math.max(0, regPrice - negPrice));

            deal.id = deal.id || key;
            deal.productId = deal.productId || matchedProd.id;
            deal.productName = deal.productName || matchedProd.name;
            deal.productImage = deal.productImage || matchedProd.image;
            deal.quantity = qty;
            deal.regularPrice = regPrice;
            deal.negotiatedPrice = negPrice;
            deal.unitPrice = unitPrice;
            deal.savings = savings;
            deal.addOns = Array.isArray(deal.addOns) ? deal.addOns : [];
            deal.status =
              deal.status === 'WAITING_FOR_APPROVAL'
                ? 'Offer Available'
                : deal.status || 'Offer Available';
            deal.messages = Array.isArray(deal.messages) ? deal.messages : [];
            deal.whyThisOffer =
              deal.whyThisOffer ||
              'Discounts depend on requested quantity and merchant discount policy limits.';
            deal.createdAt = deal.createdAt || new Date().toISOString();
            deal.updatedAt = deal.updatedAt || new Date().toISOString();
          }
        }

        this.saveState(parsed);
        return parsed;
      }
    } catch (err) {
      console.warn('Failed to load database file, resetting to clean initial state:', err);
    }
    const initial = createInitialState();
    this.saveState(initial);
    return initial;
  }

  private saveState(state: DatabaseState) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  private persist() {
    this.saveState(this.state);
  }

  // --- Users & Sessions (SQLite backed) ---
  findUserByEmail(email: string): UserRecord | undefined {
    const sUser = sqliteDb.findUserByEmail(email);
    if (sUser) {
      return {
        id: sUser.id,
        email: sUser.email,
        passwordHash: sUser.password_hash,
        name: sUser.full_name,
        role: sUser.role as 'CUSTOMER',
        createdAt: sUser.created_at || new Date().toISOString(),
      };
    }
    const clean = email.trim().toLowerCase();
    return this.state.users.find((u) => u.email.toLowerCase() === clean);
  }

  findUserById(id: string): UserRecord | undefined {
    const sUser = sqliteDb.findUserById(id);
    if (sUser) {
      return {
        id: sUser.id,
        email: sUser.email,
        passwordHash: sUser.password_hash,
        name: sUser.full_name,
        role: sUser.role as 'CUSTOMER',
        createdAt: sUser.created_at || new Date().toISOString(),
      };
    }
    return this.state.users.find((u) => u.id === id);
  }

  createUser(email: string, password: string, name: string, phone?: string): UserRecord {
    const cleanEmail = email.trim().toLowerCase();
    if (this.findUserByEmail(cleanEmail)) {
      throw new Error('An account with this email address already exists.');
    }
    const passwordHash = bcrypt.hashSync(password, 12);
    const sUser = sqliteDb.createUser(name, cleanEmail, passwordHash, 'CUSTOMER');

    const newUser: UserRecord = {
      id: sUser.id,
      email: sUser.email,
      passwordHash: sUser.password_hash,
      name: sUser.full_name,
      role: 'CUSTOMER',
      phone,
      createdAt: sUser.created_at || new Date().toISOString(),
    };
    if (!this.state.users.some((u) => u.id === newUser.id)) {
      this.state.users.push(newUser);
      this.persist();
    }
    return newUser;
  }

  createSession(userId: string): string {
    const token = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    this.state.sessions[token] = userId;
    this.persist();
    return token;
  }

  getUserBySession(token: string): UserRecord | undefined {
    const userId = this.state.sessions[token];
    if (!userId) return undefined;
    return this.findUserById(userId);
  }

  removeSession(token: string) {
    delete this.state.sessions[token];
    this.persist();
  }

  // --- Products ---
  getProducts(): Product[] {
    return this.state.products;
  }

  findProductById(id: string): Product | undefined {
    return this.state.products.find((p) => p.id === id);
  }

  // --- Deals ---
  getDeals(): Deal[] {
    return Object.values(this.state.deals || {})
      .filter(Boolean)
      .map((deal: any) => {
        const matchedProd =
          INITIAL_PRODUCTS.find((p) => p.id === deal.productId || p.name === deal.productName) ||
          INITIAL_PRODUCTS[0];
        const quantity = Number(deal.quantity || 5);
        const regularPrice = Number(deal.regularPrice ?? deal.baseValue ?? matchedProd.price * quantity);
        const negotiatedPrice = Number(deal.negotiatedPrice ?? deal.finalAmount ?? Math.round(regularPrice * 0.92));
        const unitPrice = Number(deal.unitPrice ?? Math.round(negotiatedPrice / quantity));
        const savings = Number(deal.savings ?? Math.max(0, regularPrice - negotiatedPrice));

        return {
          ...deal,
          productId: deal.productId || matchedProd.id,
          productName: deal.productName || matchedProd.name,
          productImage: deal.productImage || matchedProd.image,
          quantity,
          regularPrice,
          negotiatedPrice,
          unitPrice,
          savings,
          addOns: Array.isArray(deal.addOns) ? deal.addOns : [],
          status: deal.status || 'Offer Available',
          updatedAt: deal.updatedAt || new Date().toISOString(),
        } as Deal;
      })
      .sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
  }

  getDeal(id: string): Deal | undefined {
    const deals = this.getDeals();
    return deals.find((d) => d.id === id);
  }

  saveDeal(deal: Deal) {
    this.state.deals[deal.id] = deal;
    this.persist();
  }

  // --- Cart ---
  getCart(userId: string): CartItem[] {
    const rawCart = this.state.cart[userId] || [];
    return rawCart.map((item: any) => ({
      ...item,
      unitPrice: Number(item.unitPrice ?? item.price ?? 0),
      regularUnitPrice: Number(item.regularUnitPrice ?? item.unitPrice ?? item.price ?? 0),
      subtotal: Number(item.subtotal ?? Number(item.unitPrice ?? 0) * Number(item.quantity ?? 1)),
      quantity: Number(item.quantity ?? 1),
      addOns: Array.isArray(item.addOns) ? item.addOns : [],
    }));
  }

  addToCart(userId: string, item: Omit<CartItem, 'id'>): CartItem[] {
    if (!this.state.cart[userId]) {
      this.state.cart[userId] = [];
    }

    const userCart = this.state.cart[userId];
    const existingIndex = userCart.findIndex(
      (ci) => ci.productId === item.productId && ci.dealId === item.dealId
    );

    if (existingIndex > -1 && !item.dealId) {
      // Normal item: increment quantity and apply bulk pricing tier
      userCart[existingIndex].quantity += item.quantity;
      const product = this.findProductById(item.productId);
      if (product) {
        const bulk = calculateBulkPricing(product, userCart[existingIndex].quantity);
        userCart[existingIndex].unitPrice = bulk.unitPrice;
        userCart[existingIndex].savingsPerUnit = bulk.discountPerUnit;
      }
      userCart[existingIndex].subtotal =
        userCart[existingIndex].quantity * userCart[existingIndex].unitPrice;
    } else if (existingIndex > -1 && item.dealId) {
      // Existing negotiated deal: update quantity, pricing, and add-ons
      userCart[existingIndex].quantity = item.quantity;
      userCart[existingIndex].unitPrice = item.unitPrice;
      userCart[existingIndex].regularUnitPrice = item.regularUnitPrice;
      userCart[existingIndex].savingsPerUnit = item.savingsPerUnit;
      userCart[existingIndex].addOns = item.addOns;
      const addOnsTotal = (item.addOns || []).reduce(
        (sum, a) => sum + a.price * (a.quantity || 1),
        0
      );
      userCart[existingIndex].subtotal = item.quantity * item.unitPrice + addOnsTotal;
    } else {
      // Negotiated deal or new item
      let unitPrice = item.unitPrice;
      let savingsPerUnit = item.savingsPerUnit || 0;
      if (!item.dealId) {
        const product = this.findProductById(item.productId);
        if (product) {
          const bulk = calculateBulkPricing(product, item.quantity);
          unitPrice = bulk.unitPrice;
          savingsPerUnit = bulk.discountPerUnit;
        }
      }

      const addOnsTotal = (item.addOns || []).reduce(
        (sum, a) => sum + a.price * (a.quantity || 1),
        0
      );
      const subtotal = unitPrice * item.quantity + addOnsTotal;

      const newItem: CartItem = {
        ...item,
        unitPrice,
        savingsPerUnit,
        subtotal,
        id: `ci_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      };
      userCart.push(newItem);
    }

    this.persist();
    return userCart;
  }

  updateCartItem(userId: string, cartItemId: string, quantity: number): CartItem[] {
    const userCart = this.state.cart[userId] || [];
    const item = userCart.find((ci) => ci.id === cartItemId);
    if (item) {
      if (quantity <= 0) {
        return this.removeFromCart(userId, cartItemId);
      }
      item.quantity = quantity;
      if (!item.dealId && !item.isNegotiated) {
        const product = this.findProductById(item.productId);
        if (product) {
          const bulk = calculateBulkPricing(product, quantity);
          item.unitPrice = bulk.unitPrice;
          item.savingsPerUnit = bulk.discountPerUnit;
        }
      }
      const addOnsTotal = (item.addOns || []).reduce(
        (sum, a) => sum + a.price * (a.quantity || 1),
        0
      );
      item.subtotal = item.quantity * item.unitPrice + addOnsTotal;
      this.persist();
    }
    return userCart;
  }

  removeFromCart(userId: string, cartItemId: string): CartItem[] {
    if (!this.state.cart[userId]) return [];
    this.state.cart[userId] = this.state.cart[userId].filter((ci) => ci.id !== cartItemId);
    this.persist();
    return this.state.cart[userId];
  }

  clearCart(userId: string) {
    this.state.cart[userId] = [];
    this.persist();
  }

  // --- Orders ---
  getOrders(): Order[] {
    return this.state.orders.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getOrder(id: string): Order | undefined {
    return this.state.orders.find((o) => o.id === id || o.orderNumber === id);
  }

  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order {
    const count = this.state.orders.length + 1043;
    const order: Order = {
      ...orderData,
      id: `ord_${Date.now()}`,
      orderNumber: `ORD-${count}`,
      createdAt: new Date().toISOString(),
    };
    this.state.orders.unshift(order);
    this.persist();
    return order;
  }

  // --- Policy ---
  getPolicy(): MerchantPolicy {
    return this.state.policy;
  }

  updatePolicy(updates: Partial<MerchantPolicy>): MerchantPolicy {
    this.state.policy = { ...this.state.policy, ...updates };
    this.persist();
    return this.state.policy;
  }

  // --- Audit & Revenue (backend-only analytics) ---
  addAuditEvent(
    dealId: string,
    actor: AuditEvent['actor'],
    action: string,
    input: string,
    decision: string,
    reason: string,
    result: string
  ): AuditEvent {
    const event: AuditEvent = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      dealId,
      timestamp: new Date().toISOString(),
      actor,
      action,
      input,
      decision,
      reason,
      result,
    };
    this.state.auditLogs.unshift(event);
    if (this.state.auditLogs.length > 200) {
      this.state.auditLogs = this.state.auditLogs.slice(0, 200);
    }
    this.persist();
    return event;
  }

  getAuditLogs(): AuditEvent[] {
    return this.state.auditLogs;
  }

  // --- Transactions ---
  getTransactions(): Transaction[] {
    return this.state.transactions;
  }

  addTransaction(tx: Transaction) {
    this.state.transactions.unshift(tx);
    this.persist();
  }

  // --- Reset ---
  reset() {
    this.state = createInitialState();
    this.saveState(this.state);
  }
}

export const db = new DatabaseManager();
