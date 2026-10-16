export class HttpError extends Error {
  readonly status: number

  constructor(status: number) {
    super(`HTTP ${status}`)
    this.name = 'HttpError'
    this.status = status
  }
}

export class InvalidResponseError extends Error {
  constructor(endpoint: string) {
    super(`Invalid response from ${endpoint}`)
    this.name = 'InvalidResponseError'
  }
}
