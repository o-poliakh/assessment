import { QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { createQueryClient } from '../../../app/queryClient'
import convert from '../../../test/fixtures/convert.json'
import currencies from '../../../test/fixtures/currencies.json'
import { server } from '../../../test/server'
import { CurrencyConverter } from './CurrencyConverter'

const DEBOUNCE_SETTLED = { timeout: 3000 }

function renderConverter() {
  render(
    <QueryClientProvider client={createQueryClient()}>
      <CurrencyConverter />
    </QueryClientProvider>,
  )
}

async function openConverter() {
  const user = userEvent.setup()
  renderConverter()
  const from = screen.getByRole('combobox', { name: 'From' })
  await waitFor(() => expect(from).toBeEnabled())
  return {
    user,
    from,
    to: screen.getByRole('combobox', { name: 'To' }),
    amount: screen.getByRole('textbox', { name: 'Amount' }),
  }
}

async function expectResult(text: string) {
  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(text), DEBOUNCE_SETTLED)
}

function mockConversions() {
  const requests: Record<string, string>[] = []
  server.use(
    http.get('/api/v1/convert', ({ request }) => {
      const query = Object.fromEntries(new URL(request.url).searchParams)
      requests.push(query)
      return HttpResponse.json({
        ...convert,
        response: { ...convert.response, value: Number(query.amount) * 2 },
      })
    }),
  )
  return requests
}

describe('CurrencyConverter', () => {
  it('converts after typing and again when the user changes currency', async () => {
    const requests = mockConversions()
    const { user, from, to, amount } = await openConverter()
    expect(from).toHaveValue('USD')
    expect(to).toHaveValue('EUR')

    await user.type(amount, '10')
    await expectResult('€20.00')
    await user.selectOptions(to, 'GBP')
    await expectResult('£20.00')

    expect(requests).toEqual([
      { from: 'USD', to: 'EUR', amount: '10' },
      { from: 'USD', to: 'GBP', amount: '10' },
    ])
  })

  it('shows the amount and sends no request for the same currency', async () => {
    const requests = mockConversions()
    const { user, to, amount } = await openConverter()

    await user.selectOptions(to, 'USD')
    await user.type(amount, '10')

    expect(screen.getByRole('status')).toHaveTextContent('$10.00')
    await new Promise((resolve) => setTimeout(resolve, 500))
    expect(requests).toHaveLength(0)
  })

  it('shows an error and sends no request for an invalid amount', async () => {
    const requests = mockConversions()
    const { user, amount } = await openConverter()

    await user.type(amount, 'abc')

    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid positive number.')
    expect(amount).toHaveAttribute('aria-invalid', 'true')
    await new Promise((resolve) => setTimeout(resolve, 500))
    expect(requests).toHaveLength(0)
  })

  it('does not break on a currency code Intl does not accept', async () => {
    const usdt = { short_code: 'USDT', name: 'Tether' }
    server.use(
      http.get('/api/v1/currencies', () =>
        HttpResponse.json({ response: [...currencies.response, usdt] }),
      ),
    )
    mockConversions()
    const { user, to, amount } = await openConverter()

    await user.selectOptions(to, 'USDT')
    await user.type(amount, '10')
    await expectResult('20 USDT')
  })

  it('shows an error if the currency list is empty', async () => {
    server.use(http.get('/api/v1/currencies', () => HttpResponse.json({ response: [] })))
    renderConverter()

    expect(await screen.findByRole('alert')).toHaveTextContent('Unable to load currencies.')
    expect(screen.getByRole('combobox', { name: 'From' })).toBeDisabled()
  })

  it('shows an API key error on 401', async () => {
    server.use(http.get('/api/v1/currencies', () => new HttpResponse(null, { status: 401 })))
    renderConverter()

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid or missing API key.')
  })

  it('shows an error if conversion fails and keeps the form usable', async () => {
    server.use(http.get('/api/v1/convert', () => HttpResponse.error()))
    const { user, amount } = await openConverter()

    await user.type(amount, '100')

    expect(await screen.findByRole('alert', undefined, DEBOUNCE_SETTLED)).toHaveTextContent(
      'Unable to convert. Please try again.',
    )
    expect(amount).toBeEnabled()
  })
})
