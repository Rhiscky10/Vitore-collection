// Centralised pricing rules for Vitoré.
// - Every product gets an automatic 7% discount off the listed price.
// - A 2% processing fee (Paystack) is added to the customer's checkout total.

export const DISCOUNT_RATE = 0.07;
export const PROCESSING_FEE_RATE = 0.02;
export const DISCOUNT_LABEL = "7% OFF";

const round2 = (n: number) => Math.round(n * 100) / 100;

export const getDiscountedPrice = (price: number) => round2(price * (1 - DISCOUNT_RATE));
export const getDiscountAmount = (price: number) => round2(price * DISCOUNT_RATE);
export const getProcessingFee = (amount: number) => round2(amount * PROCESSING_FEE_RATE);
