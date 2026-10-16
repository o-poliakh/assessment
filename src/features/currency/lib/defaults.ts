import type { Currency } from '../model/currency'

export const DEFAULT_FROM = 'USD'
export const DEFAULT_TO = 'EUR'

export function pickDefault(currencies: readonly Currency[], preferred: string): string | null {
  if (currencies.some((c) => c.code === preferred)) {
    return preferred
  }
  return currencies.at(0)?.code ?? null
}
