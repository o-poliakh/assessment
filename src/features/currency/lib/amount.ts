const AMOUNT_PATTERN = /^(\d+(\.\d*)?|\.\d+)$/

const MAX_AMOUNT = Number.MAX_SAFE_INTEGER

export function parseAmount(input: string): number | null {
  const trimmed = input.trim()
  if (!AMOUNT_PATTERN.test(trimmed)) {
    return null
  }
  const value = Number(trimmed)
  return value > 0 && value <= MAX_AMOUNT ? value : null
}

type FormatAmountOptions = {
  currency: string
  locale: string
}

export function formatAmount(value: number, { currency, locale }: FormatAmountOptions): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 6,
    }).format(value)
  } catch (error) {
    if (!(error instanceof RangeError)) {
      throw error
    }
    const number = new Intl.NumberFormat(locale, { maximumFractionDigits: 6 }).format(value)
    return `${number} ${currency}`
  }
}
