import { useId } from 'react'
import type { Currency } from '../model/currency'

type CurrencySelectProps = {
  readonly label: string
  readonly value: string | null
  readonly currencies: readonly Currency[]
  readonly onChange: (code: string) => void
  readonly disabled?: boolean
}

export function CurrencySelect({
  label,
  value,
  currencies,
  onChange,
  disabled,
}: CurrencySelectProps) {
  const id = useId()

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value ?? ''}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      >
        {currencies.map((currency) => (
          <option key={currency.code} value={currency.code}>
            {currency.code} - {currency.name}
          </option>
        ))}
      </select>
    </div>
  )
}
