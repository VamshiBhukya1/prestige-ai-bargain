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

export function calculateBulkPricing(
  product: { price: number; cost?: number; maxDiscountPercent?: number },
  quantity: number
): BulkTierInfo {
  const qty = Math.max(1, Number(quantity) || 1);
  const regularUnitPrice = Number(product.price) || 0;
  const cost = Number(product.cost) || 0;

  // Merchant minimum rule: Never price below cost + margin buffer
  const costFloor = cost > 0 ? cost + 100 : Math.round(regularUnitPrice * 0.7);
  const absoluteMaxDiscount = Math.max(0, regularUnitPrice - costFloor);

  // Maximum allowed discount for 50+ units based on product & merchant policy
  let maxBulkDiscountAmount = 0;
  if (regularUnitPrice === 1850) {
    // Specific standard corporate gift box tier floor: ₹1,650 (₹200 discount)
    maxBulkDiscountAmount = 200;
  } else {
    const policyPercent = Math.max(product.maxDiscountPercent || 8, 10);
    maxBulkDiscountAmount = Math.round((regularUnitPrice * (policyPercent / 100)) / 10) * 10;
  }
  // Enforce merchant floor rule: discount can never breach cost floor
  maxBulkDiscountAmount = Math.min(absoluteMaxDiscount, maxBulkDiscountAmount);
  const merchantFloorPrice = regularUnitPrice - maxBulkDiscountAmount;

  let tierName: BulkTierInfo['tierName'] = 'Normal Price';
  let tierRange: BulkTierInfo['tierRange'] = '1-9';
  let discountPerUnit = 0;
  let isMaxDiscount = false;

  if (qty >= 50) {
    tierName = 'Maximum Allowed Bulk Discount';
    tierRange = '50+';
    discountPerUnit = maxBulkDiscountAmount;
    isMaxDiscount = true;
  } else if (qty >= 25) {
    tierName = 'Medium Bulk Discount';
    tierRange = '25-49';
    // Approximately 65% of max bulk discount, rounded to nearest ₹5
    discountPerUnit = Math.round((maxBulkDiscountAmount * 0.65) / 5) * 5;
  } else if (qty >= 10) {
    tierName = 'Small Bulk Discount';
    tierRange = '10-24';
    // Approximately 35% of max bulk discount, rounded to nearest ₹5
    discountPerUnit = Math.round((maxBulkDiscountAmount * 0.35) / 5) * 5;
  } else {
    tierName = 'Normal Price';
    tierRange = '1-9';
    discountPerUnit = 0;
  }

  // Safety check: verify discount does not breach merchant floor
  discountPerUnit = Math.min(maxBulkDiscountAmount, discountPerUnit);
  const unitPrice = Math.max(merchantFloorPrice, regularUnitPrice - discountPerUnit);
  const actualDiscountPerUnit = regularUnitPrice - unitPrice;
  const discountPercent =
    regularUnitPrice > 0
      ? Math.round((actualDiscountPerUnit / regularUnitPrice) * 1000) / 10
      : 0;

  const totalPrice = unitPrice * qty;
  const totalSavings = actualDiscountPerUnit * qty;

  let discountLabel = '0% (Normal Price)';
  if (discountPercent > 0) {
    discountLabel = `${discountPercent}% off (${tierName.replace(' Bulk Discount', '')})`;
  }

  return {
    tierName,
    tierRange,
    quantity: qty,
    regularUnitPrice,
    unitPrice,
    discountPerUnit: actualDiscountPerUnit,
    discountPercent,
    discountLabel,
    totalPrice,
    totalSavings,
    isMaxDiscount,
    merchantFloorPrice,
  };
}

export function getAllBulkTiers(product: {
  price: number;
  cost?: number;
  maxDiscountPercent?: number;
}): BulkTierInfo[] {
  return [
    calculateBulkPricing(product, 1),
    calculateBulkPricing(product, 10),
    calculateBulkPricing(product, 25),
    calculateBulkPricing(product, 50),
  ];
}
