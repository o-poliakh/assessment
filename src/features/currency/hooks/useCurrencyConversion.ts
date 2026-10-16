import { skipToken, useQuery } from '@tanstack/react-query'
import { fetchConversion, type ConversionParams } from '../../../api/currencyBeacon/client'
import { toConvertedValue } from '../mappers/currencyBeacon'
import { useDebouncedValue } from './useDebouncedValue'

const CONVERSION_STALE_TIME_MS = 60 * 60 * 1000

type Params = {
  readonly from: string | null
  readonly to: string | null
  readonly amount: number | null
}

function toRequest({ from, to, amount }: Params): ConversionParams | null {
  if (amount === null || from === null || to === null || from === to) {
    return null
  }
  return { from, to, amount }
}

export function useCurrencyConversion(params: Params) {
  const debouncedAmount = useDebouncedValue(params.amount)
  const isDebouncing = params.amount !== debouncedAmount
  const request = isDebouncing ? null : toRequest(params)

  return useQuery({
    queryKey: ['conversion', request],
    queryFn: request ? ({ signal }) => fetchConversion(request, signal) : skipToken,
    select: toConvertedValue,
    staleTime: CONVERSION_STALE_TIME_MS,
  })
}
