import { useQuery } from '@tanstack/react-query'
import { fetchCurrencies } from '../../../api/currencyBeacon/client'
import { HttpError } from '../../../api/currencyBeacon/errors'
import { toCurrencies } from '../mappers/currencyBeacon'

export function useCurrencies() {
  return useQuery({
    queryKey: ['currencies'],
    queryFn: ({ signal }) => fetchCurrencies(signal),
    select: toCurrencies,
    staleTime: Infinity,
  })
}

export function isAuthError(error: unknown): boolean {
  return error instanceof HttpError && error.status === 401
}
