/**
 * Formats a given numeric amount as a USD currency string.
 * @param amount - The number to format
 * @returns The formatted currency string
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
