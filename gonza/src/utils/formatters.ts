/**
 * Helper tool for number and currency formatting across the Gonza platform.
 */
export class NumberFormatter {
  /**
   * Adds comma separation to a number (e.g., 1500000 -> 15,000,000)
   */
  static formatWithCommas(value: number | string | undefined | null): string {
    const num = this.parse(value);
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(num);
  }

  /**
   * Minimizes large values into readable strings (e.g., 50000 -> 50K, 1500000 -> 1.5M)
   * Supports up to Trillions.
   */
  static minimize(
    value: number | string | undefined | null,
    decimals: number = 1
  ): string {
    const num = this.parse(value);
    const absNum = Math.abs(num);

    if (absNum < 1000) return num.toString();

    const units = [
      { value: 1e12, symbol: "T" },
      { value: 1e9, symbol: "B" },
      { value: 1e6, symbol: "M" },
      { value: 1e3, symbol: "K" },
    ];

    for (const unit of units) {
      if (absNum >= unit.value) {
        const result = num / unit.value;
        // Remove trailing .0 if present
        return (
          parseFloat(result.toFixed(decimals)).toString() + unit.symbol
        );
      }
    }

    return num.toString();
  }

  /**
   * Formats as currency with an optional symbol (e.g., 50000 -> UGX 50,000)
   */
  static formatCurrency(
    value: number | string | undefined | null,
    currency: string = "UGX",
    minimize: boolean = false
  ): string {
    const formatted = minimize 
      ? this.minimize(value) 
      : this.formatWithCommas(value);
    
    return `${currency} ${formatted}`;
  }

  /**
   * Intelligent formatter that minimizes values only above a certain threshold.
   * Default threshold is 1 Million.
   */
  static smartFormat(
    value: number | string | undefined | null,
    threshold: number = 1000000
  ): string {
    const num = this.parse(value);
    if (Math.abs(num) >= threshold) {
      return this.minimize(num);
    }
    return this.formatWithCommas(num);
  }

  /**
   * Private helper to safely parse input to a valid number
   */
  private static parse(value: any): number {
    if (value === undefined || value === null || value === "") return 0;
    const num = typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;
    return isNaN(num) ? 0 : num;
  }
}
