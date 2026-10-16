import { pickDefault } from './defaults'

const currencies = [
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'Pound Sterling' },
  { code: 'USD', name: 'US Dollar' },
]

describe('pickDefault', () => {
  it('uses the first currency if the preferred one is missing', () => {
    expect(pickDefault(currencies, 'JPY')).toBe('EUR')
  })

  it('returns null for an empty list', () => {
    expect(pickDefault([], 'EUR')).toBeNull()
  })
})
