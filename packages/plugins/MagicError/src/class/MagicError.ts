export class MagicError extends Error {
  public readonly statusCode: number
  public readonly timestamp: number
  public readonly source: string

  constructor(
    message: string,
    statusCode: number,
    source: string,
    options?: ErrorOptions
  ) {
    super(message, options)

    this.name = 'MagicError'
    this.statusCode = statusCode
    this.timestamp = Date.now()
    this.source = source

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MagicError)
    }
  }
}
