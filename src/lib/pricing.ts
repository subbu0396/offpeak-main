export function calculateOffPeakPrice(basePrice: number, offPeakDiscount: number, minPrice?: number): number {
  const discounted = Math.round(basePrice * (1 - offPeakDiscount / 100))
  return minPrice ? Math.max(minPrice, discounted) : discounted
}

export function formatCurrency(amount: number, currency: string = "GBP"): string {
  const symbol = currency === "GBP" ? "£" : currency === "USD" ? "$" : currency === "EUR" ? "€" : currency
  return `${symbol}${amount.toFixed(2)}`
}
