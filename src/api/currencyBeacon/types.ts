export type CurrencyDto = {
  readonly short_code: string
  readonly name: string
}

export type CurrenciesResponseDto = {
  readonly response: readonly CurrencyDto[]
}

export type ConvertResponseDto = {
  readonly response: {
    readonly value: number
  }
}
