import { useId, useState } from 'react'
import { isAuthError, useCurrencies } from '../hooks/useCurrencies'
import { useCurrencyConversion } from '../hooks/useCurrencyConversion'
import { formatAmount, parseAmount } from '../lib/amount'
import { DEFAULT_FROM, DEFAULT_TO, pickDefault } from '../lib/defaults'
import { CurrencySelect } from './CurrencySelect'

export function CurrencyConverter() {
  const currenciesQuery = useCurrencies()
  const currencies = currenciesQuery.data ?? []

  const [fromChoice, setFromChoice] = useState<string | null>(null)
  const [toChoice, setToChoice] = useState<string | null>(null)
  const [amountInput, setAmountInput] = useState('')

  const from = fromChoice ?? pickDefault(currencies, DEFAULT_FROM)
  const to = toChoice ?? pickDefault(currencies, DEFAULT_TO)

  const amount = parseAmount(amountInput)
  const isInputInvalid = amountInput.trim() !== '' && amount === null
  const conversion = useCurrencyConversion({ from, to, amount })

  const canConvert = amount !== null && from !== null && to !== null
  const isSameCurrency = from === to
  const needsConversion = canConvert && !isSameCurrency
  const convertedValue = isSameCurrency ? amount : conversion.data

  const amountId = useId()
  const amountErrorId = useId()

  return (
    <section>
      <div>
        <label htmlFor={amountId}>Amount</label>
        <input
          id={amountId}
          inputMode="decimal"
          value={amountInput}
          onChange={(event) => setAmountInput(event.target.value)}
          aria-invalid={isInputInvalid}
          aria-describedby={isInputInvalid ? amountErrorId : undefined}
        />
        {isInputInvalid && (
          <p id={amountErrorId} role="alert">
            Enter a valid positive number.
          </p>
        )}
      </div>

      <CurrencySelect
        label="From"
        value={from}
        currencies={currencies}
        onChange={setFromChoice}
        disabled={currencies.length === 0}
      />
      <CurrencySelect
        label="To"
        value={to}
        currencies={currencies}
        onChange={setToChoice}
        disabled={currencies.length === 0}
      />

      {currenciesQuery.isPending && <p>Loading currencies...</p>}
      {currenciesQuery.isError && (
        <p role="alert">
          {isAuthError(currenciesQuery.error)
            ? 'Invalid or missing API key.'
            : 'Unable to load currencies.'}
        </p>
      )}

      {needsConversion && conversion.isPending && <p>Converting...</p>}
      {needsConversion && conversion.isError && (
        <p role="alert">Unable to convert. Please try again.</p>
      )}

      <output aria-live="polite">
        {canConvert &&
          !conversion.isError &&
          convertedValue != null &&
          formatAmount(convertedValue, { currency: to, locale: navigator.language })}
      </output>
    </section>
  )
}
