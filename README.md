# Currency Converter

Simple currency converter built with React and TypeScript using the [CurrencyBeacon API](https://currencybeacon.com/).

## Setup

Requirements:

- Node.js 22.12+
- CurrencyBeacon API key

Create `.env.local`:

```bash
cp .env.example .env.local
```

Add your API key:

```env
CURRENCYBEACON_API_KEY=your_api_key
```

Then run:

```bash
npm install
npm run dev
```

Tests:

```bash
npm test
```

Restart the dev server after changing `.env.local`.

## Notes

- In development the API key is added by the Vite proxy, so it never reaches the client bundle.
- API code lives in `src/api/currencyBeacon`, currency UI and logic in `src/features/currency`.
- Responses are checked with type guards before use, since the API shape isn't guaranteed.
- Amount input is debounced by 400 ms so it doesn't send a request on every key press.
- Changing a currency converts right away.
- If both currencies are the same, no request is sent.

## Known limitations

- Decimal values should use a dot, for example `10.5`. Values like `10,5` are not supported.

## Possible improvements

- Reserve space for the conversion result to avoid layout shift while the "Converting..." state is shown.
- Handle offline mode: detect lost connection and show a clear message instead of a generic error.
