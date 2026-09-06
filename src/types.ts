export interface ProductVariant {
  name: string;
  priceDelta: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number; // INR
  cost: number; // INR
  margin: number; // price - cost
  inventory: number;
  variants: ProductVariant[];
  attributes: Record<string, string>;
  addOns: string[];
  bundleCompatibility: string[];
  deliveryTimeDays: number;
  shippingCost: number;
  discountEligible: boolean;
  maxDiscountPercent: number;
  purchaseRestrictions: string[];
  badge?: string;
  image?: string;
}

export interface MerchantPolicy {
  maxDiscountPercent: number; // e.g. 8%
  minMarginAmount: number; // e.g. ₹1,000
  maxNegotiationRounds: number; // e.g. 3
  maxOrderValue: number; // e.g. ₹50,000
  requireBuyerApproval: boolean;
  allowedActions: string[];
  restrictedActions: string[];
}

export type DealStatus =
  | 'Negotiating'
  | 'Offer Available'
  | 'Accepted'
  | 'Rejected'
  | 'Expired'
  | 'Cancelled';

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'customer';
  text: string;
  timestamp: string;
  offerCard?: {
    productName: string;
    quantity: number;
    regularPrice: number;
    negotiatedPrice: number;
    unitPrice: number;
    savings: number;
    customerOfferPrice?: number;
    aiCounterPrice?: number;
    bulkTier?: BulkTierInfo;
    addOns?: { name: string; price: number; quantity: number }[];
  };
  upsellOffer?: {
    id: string;
    name: string;
    pricePerUnit: number;
    description: string;
  };
}

export interface DealOrderSummary {
  productName: string;
  productImage?: string;
  quantity: number;
  finalPricePerUnit: number;
  totalAmount: number;
  originalPricePerUnit: number;
  originalTotal: number;
  totalSavings: number;
}

export interface Deal {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  regularPrice: number;
  negotiatedPrice: number;
  unitPrice: number;
  savings: number;
  basePrice?: number;
  availableStock?: number;
  customerOfferPrice?: number;
  aiCounterPrice?: number;
  bulkTier?: BulkTierInfo;
  addOns: { name: string; price: number; quantity: number }[];
  status: DealStatus;
  messages: ChatMessage[];
  whyThisOffer?: string;
  orderSummary?: DealOrderSummary;
  negotiationRounds?: NegotiationRound[];
  items?: DealItem[];
  finalTotal?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  regularUnitPrice: number;
  unitPrice: number; // negotiated or regular
  isNegotiated: boolean;
  dealId?: string;
  savingsPerUnit?: number;
  addOns?: { name: string; price: number; quantity: number }[];
  subtotal: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "ORD-1042"
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus: 'Successful' | 'Pending' | 'Failed';
  orderStatus: 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  dealIds?: string[];
  createdAt: string;
}

export interface BuyerIntent {
  id: string;
  rawQuery: string;
  product: string;
  quantity: number;
  maxBudget: number;
  deliveryDays: number;
  preferences: string[];
  extractedAt: string;
}

export interface DealItem {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  unitCost: number;
  isUpsell?: boolean;
  isBundleAddon?: boolean;
  reason?: string;
}

export interface NegotiationRound {
  roundNumber: number;
  speaker: 'buyer' | 'merchant' | 'system' | 'policy';
  message: string;
  proposedTotal: number;
  merchantMargin: number;
  dealScore: number;
  reason: string;
  timestamp: string;
}

export interface PolicyCheckItem {
  rule: string;
  passed: boolean;
  detail: string;
  policyRef: string;
}

export interface PolicyCheckResult {
  passed: boolean;
  checkedAt: string;
  checks: PolicyCheckItem[];
  statusText: string;
}

export interface Transaction {
  id: string;
  dealId: string;
  buyerName: string;
  merchantName: string;
  productsSummary: string;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed';
  paymentMethod?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  failureReason?: string;
  duplicateBlocked: boolean;
  retryCount: number;
  buyerApproved: boolean;
  deal?: any;
  audits?: any;
  createdAt: string;
  updatedAt: string;
}

export interface AuditEvent {
  id: string;
  dealId: string;
  timestamp: string;
  actor:
    | 'AI Buyer'
    | 'AI Merchant'
    | 'Revenue Engine'
    | 'Policy Guard'
    | 'Buyer (Human)'
    | 'Razorpay'
    | 'Deal Orchestrator'
    | 'Order Service';
  action: string;
  input: string;
  decision: string;
  reason: string;
  result: string;
}

export interface RevenueOpportunity {
  id: string;
  title: string;
  type: 'upsell' | 'bundle' | 'abandoned_cart' | 'high_value_buyer';
  estimatedValue: number;
  reason: string;
  approved: boolean;
}

export interface BulkTierInfo {
  tierName: 'Normal Price' | 'Small Bulk Discount' | 'Medium Bulk Discount' | 'Maximum Allowed Bulk Discount';
  tierRange: '1-9' | '10-24' | '25-49' | '50+';
  quantity: number;
  regularUnitPrice: number;
  unitPrice: number;
  discountPerUnit: number;
  discountPercent: number;
  discountLabel: string;
  totalPrice: number;
  totalSavings: number;
  isMaxDiscount: boolean;
  merchantFloorPrice: number;
}

export interface RevenueMetrics {
  totalRevenue: number;
  aiAssistedRevenue: number;
  averageOrderValue: number;
  upsellRevenue: number;
  crossSellRevenue: number;
  bundleRevenue: number;
  dealsCompleted: number;
  conversionRate: number;
  opportunities: RevenueOpportunity[];
}
