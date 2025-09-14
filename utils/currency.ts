export function toUSD(amount: number, currency: string): string {
  if (currency === "USD") {
    return `$${amount}`;
  }
  // For other currencies, you can add conversion logic here
  return `$${amount}`;
}
