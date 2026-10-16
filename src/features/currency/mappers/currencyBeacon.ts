import type { ConvertResponseDto, CurrencyDto } from '../../../api/currencyBeacon/types'
import type { Currency } from '../model/currency'

function toCurrency(dto: CurrencyDto): Currency {
  return { code: dto.short_code, name: dto.name }
}

export function toCurrencies(dtos: readonly CurrencyDto[]): readonly Currency[] {
  return dtos.map(toCurrency).sort((a, b) => a.code.localeCompare(b.code, 'en'))
}

export function toConvertedValue(dto: ConvertResponseDto): number {
  return dto.response.value
}
