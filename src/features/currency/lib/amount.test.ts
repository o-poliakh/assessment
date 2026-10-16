import { formatAmount, parseAmount } from './amount'

describe('parseAmount', () => {
  it.each([
    ['0.25', 0.25],
    ['.5', 0.5],
    [' 7 ', 7],
  ])('accepts %j', (input, expected) => {
    expect(parseAmount(input)).toBe(expected)
  })

  it.each(['', '0', '-5', '1,5', '1e5'])('rejects %j', (input) => {
    expect(parseAmount(input)).toBeNull()
  })
})

describe('formatAmount', () => {
  it('uses no decimals for a currency without minor units', () => {
    expect(formatAmount(1000, { currency: 'JPY', locale: 'en-US' })).toBe('¥1,000')
  })
})
