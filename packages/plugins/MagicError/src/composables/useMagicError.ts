import { MagicError } from '../class/MagicError'

export interface UseMagicErrorArgs {
  prefix?: string
  source?: string
}

export interface ThrowErrorArgs {
  message: string
  statusCode: number
  cause?: unknown
}

export function useMagicError(args: UseMagicErrorArgs = {}) {
  const { prefix = 'MagicError', source = 'Vue Equipment' } = args

  function logError(message: string) {
    console.error(`[${prefix}]:`, message)
  }

  function logWarning(message: string) {
    console.warn(`[${prefix}]:`, message)
  }

  function throwError(args: ThrowErrorArgs): never {
    const { message, statusCode, cause } = args

    const mappedMessage = `[${prefix}]: ${message}`
    const error = new MagicError(mappedMessage, statusCode, source, {
      cause,
    })

    logError(message)
    throw error
  }

  return {
    throwError,
    logError,
    logWarning,
    MagicError,
  }
}
