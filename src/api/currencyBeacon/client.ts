import { HttpError, InvalidResponseError } from './errors'
import { isConvertResponseDto, isCurrenciesResponseDto } from './guards'
import type { ConvertResponseDto, CurrencyDto } from './types'

const BASE_URL = '/api/v1'

async function fetchJson(
  endpoint: string,
  { signal, query }: { readonly signal?: AbortSignal; readonly query?: URLSearchParams } = {},
): Promise<unknown> {
  const url = query ? `${BASE_URL}${endpoint}?${query}` : `${BASE_URL}${endpoint}`
  const res = await fetch(url, { signal })
  if (!res.ok) {
    throw new HttpError(res.status)
  }
  return res.json()
}

export async function fetchCurrencies(signal?: AbortSignal): Promise<readonly CurrencyDto[]> {
  const body = await fetchJson('/currencies', { signal })
  if (!isCurrenciesResponseDto(body) || body.response.length === 0) {
    throw new InvalidResponseError('/currencies')
  }
  return body.response
}

export type ConversionParams = {
  readonly from: string
  readonly to: string
  readonly amount: number
}

export async function fetchConversion(
  { from, to, amount }: ConversionParams,
  signal?: AbortSignal,
): Promise<ConvertResponseDto> {
  const query = new URLSearchParams({ from, to, amount: String(amount) })
  const body = await fetchJson('/convert', { signal, query })
  if (!isConvertResponseDto(body)) {
    throw new InvalidResponseError('/convert')
  }
  return body
}
