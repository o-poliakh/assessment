import { ErrorBoundary } from 'react-error-boundary'
import { CurrencyConverter } from '../features/currency/components/CurrencyConverter'

export default function App() {
  return (
    <main>
      <h1>Currency converter</h1>
      <ErrorBoundary
        fallbackRender={({ resetErrorBoundary }) => (
          <section>
            <p role="alert">Something went wrong.</p>
            <button type="button" onClick={resetErrorBoundary}>
              Try again
            </button>
          </section>
        )}
      >
        <CurrencyConverter />
      </ErrorBoundary>
    </main>
  )
}
