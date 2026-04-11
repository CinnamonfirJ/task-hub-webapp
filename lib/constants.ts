export const PLATFORM_FEE_PERCENT = 0.15;

/**
 * Calculates net earnings after platform fee
 * @param amount Gross amount
 * @returns Rounded net amount
 */
export function calculateNetEarnings(amount: number): number {
  if (!amount || isNaN(amount)) return 0;
  return Math.round(amount * (1 - PLATFORM_FEE_PERCENT));
}

/**
 * Calculates the platform fee amount
 * @param amount Gross amount
 * @returns Rounded fee amount
 */
export function calculatePlatformFee(amount: number): number {
  if (!amount || isNaN(amount)) return 0;
  return Math.round(amount * PLATFORM_FEE_PERCENT);
}
