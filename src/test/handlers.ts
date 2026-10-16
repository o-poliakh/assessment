import { http, HttpResponse } from 'msw'
import convert from './fixtures/convert.json'
import currencies from './fixtures/currencies.json'

export const handlers = [
  http.get('/api/v1/currencies', () => HttpResponse.json(currencies)),
  http.get('/api/v1/convert', () => HttpResponse.json(convert)),
]
