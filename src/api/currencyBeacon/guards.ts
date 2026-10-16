import type { ConvertResponseDto, CurrenciesResponseDto, CurrencyDto } from './types'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isCurrencyDto(value: unknown): value is CurrencyDto {
  return isRecord(value) && typeof value.short_code === 'string' && typeof value.name === 'string'
}

export function isCurrenciesResponseDto(value: unknown): value is CurrenciesResponseDto {
  return isRecord(value) && Array.isArray(value.response) && value.response.every(isCurrencyDto)
}

export function isConvertResponseDto(value: unknown): value is ConvertResponseDto {
  return isRecord(value) && isRecord(value.response) && Number.isFinite(value.response.value)
}
