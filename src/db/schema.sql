-- ==============================================================================
-- AI DEAL ROOM - RELATIONAL POSTGRESQL SCHEMA SPECIFICATION
-- ==============================================================================

-- 1. USERS & ROLES
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL CHECK (role IN ('BUYER', 'MERCHANT')),
    company VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. MERCHANTS
CREATE TABLE IF NOT EXISTS merchants (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(64) UNIQUE NOT NULL,
    verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. PRODUCTS CATALOG
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY,
    merchant_id VARCHAR(64) REFERENCES merchants(id),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(128) NOT NULL,
    description TEXT,
    price NUMERIC(12, 2) NOT NULL,
    cost NUMERIC(12, 2) NOT NULL,
    margin NUMERIC(12, 2) NOT NULL,
    inventory INTEGER NOT NULL DEFAULT 0,
    delivery_time_days INTEGER DEFAULT 3,
    shipping_cost NUMERIC(12, 2) DEFAULT 0,
    discount_eligible BOOLEAN DEFAULT TRUE,
    max_discount_percent NUMERIC(5, 2) DEFAULT 10.0,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. MERCHANT POLICIES
CREATE TABLE IF NOT EXISTS merchant_policies (
    id VARCHAR(64) PRIMARY KEY,
    merchant_id VARCHAR(64) REFERENCES merchants(id) ON DELETE CASCADE,
    max_discount_percent NUMERIC(5, 2) NOT NULL DEFAULT 8.0,
    min_margin_amount NUMERIC(12, 2) NOT NULL DEFAULT 1000.0,
    max_negotiation_rounds INTEGER NOT NULL DEFAULT 3,
    max_order_value NUMERIC(12, 2) NOT NULL DEFAULT 50000.0,
    require_buyer_approval BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. BUYER INTENTS
CREATE TABLE IF NOT EXISTS buyer_intents (
    id VARCHAR(64) PRIMARY KEY,
    buyer_id VARCHAR(64) REFERENCES users(id),
    raw_query TEXT NOT NULL,
    product VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    max_budget NUMERIC(12, 2) NOT NULL,
    delivery_days INTEGER NOT NULL,
    preferences JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. DEALS
CREATE TABLE IF NOT EXISTS deals (
    id VARCHAR(64) PRIMARY KEY,
    buyer_intent_id VARCHAR(64) REFERENCES buyer_intents(id),
    merchant_id VARCHAR(64) REFERENCES merchants(id),
    status VARCHAR(64) NOT NULL,
    base_value NUMERIC(12, 2) NOT NULL,
    bundle_adjustment NUMERIC(12, 2) NOT NULL DEFAULT 0,
    final_amount NUMERIC(12, 2) NOT NULL,
    merchant_cost NUMERIC(12, 2) NOT NULL,
    merchant_margin NUMERIC(12, 2) NOT NULL,
    deal_score INTEGER NOT NULL,
    current_round INTEGER NOT NULL DEFAULT 1,
    max_rounds INTEGER NOT NULL DEFAULT 3,
    buyer_approved BOOLEAN DEFAULT FALSE,
    buyer_approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. DEAL ITEMS
CREATE TABLE IF NOT EXISTS deal_items (
    id VARCHAR(64) PRIMARY KEY,
    deal_id VARCHAR(64) REFERENCES deals(id) ON DELETE CASCADE,
    product_id VARCHAR(64) REFERENCES products(id),
    name VARCHAR(255) NOT NULL,
    unit_price NUMERIC(12, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL,
    unit_cost NUMERIC(12, 2) NOT NULL,
    is_upsell BOOLEAN DEFAULT FALSE,
    is_bundle_addon BOOLEAN DEFAULT FALSE,
    reason TEXT
);

-- 8. NEGOTIATION ROUNDS
CREATE TABLE IF NOT EXISTS negotiation_rounds (
    id VARCHAR(64) PRIMARY KEY,
    deal_id VARCHAR(64) REFERENCES deals(id) ON DELETE CASCADE,
    round_number INTEGER NOT NULL,
    speaker VARCHAR(32) NOT NULL CHECK (speaker IN ('buyer', 'merchant', 'system', 'policy')),
    message TEXT NOT NULL,
    proposed_total NUMERIC(12, 2) NOT NULL,
    merchant_margin NUMERIC(12, 2) NOT NULL,
    deal_score INTEGER,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. TRANSACTIONS
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(64) PRIMARY KEY,
    deal_id VARCHAR(64) REFERENCES deals(id),
    buyer_name VARCHAR(255) NOT NULL,
    merchant_name VARCHAR(255) NOT NULL,
    products_summary TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(8) DEFAULT 'INR',
    status VARCHAR(32) NOT NULL CHECK (status IN ('pending', 'success', 'failed')),
    payment_method VARCHAR(128),
    razorpay_order_id VARCHAR(128),
    razorpay_payment_id VARCHAR(128),
    failure_reason TEXT,
    duplicate_blocked BOOLEAN DEFAULT FALSE,
    retry_count INTEGER DEFAULT 0,
    buyer_approved BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. PAYMENTS (Gateway captures & verification)
CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(64) PRIMARY KEY,
    transaction_id VARCHAR(64) REFERENCES transactions(id) ON DELETE CASCADE,
    gateway VARCHAR(64) DEFAULT 'RAZORPAY_TEST',
    gateway_order_id VARCHAR(128),
    gateway_payment_id VARCHAR(128),
    amount_in_paise BIGINT NOT NULL,
    status VARCHAR(32) NOT NULL,
    signature_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. ORDERS (Fulfillment dispatch)
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    deal_id VARCHAR(64) REFERENCES deals(id),
    transaction_id VARCHAR(64) REFERENCES transactions(id),
    buyer_id VARCHAR(64) REFERENCES users(id),
    merchant_id VARCHAR(64) REFERENCES merchants(id),
    fulfillment_status VARCHAR(64) DEFAULT 'CONFIRMED',
    tracking_number VARCHAR(128),
    estimated_delivery_days INTEGER DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. AUDIT EVENTS (Cryptographic tamper-evident trail)
CREATE TABLE IF NOT EXISTS audit_events (
    id VARCHAR(64) PRIMARY KEY,
    deal_id VARCHAR(64),
    actor VARCHAR(64) NOT NULL,
    action VARCHAR(255) NOT NULL,
    input TEXT,
    decision VARCHAR(255),
    reason TEXT,
    result TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. REVENUE RECOMMENDATIONS
CREATE TABLE IF NOT EXISTS recommendations (
    id VARCHAR(64) PRIMARY KEY,
    product VARCHAR(255) NOT NULL,
    type VARCHAR(32) NOT NULL CHECK (type IN ('bundle', 'upsell', 'cross_sell')),
    original_price NUMERIC(12, 2) NOT NULL,
    additional_value NUMERIC(12, 2) NOT NULL,
    reason TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
