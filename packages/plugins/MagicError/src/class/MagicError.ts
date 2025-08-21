export class MagicError extends Error {
  public readonly errorCode: string | number
  public readonly timestamp: number
  public readonly source: string

  constructor(
    message: string,
    errorCode: string | number,
    source: string,
    options?: ErrorOptions
  ) {
    super(message, options)

    this.name = 'MagicError'
    this.errorCode = errorCode
    this.timestamp = Date.now()
    this.source = source

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MagicError)
    }
  }
}
