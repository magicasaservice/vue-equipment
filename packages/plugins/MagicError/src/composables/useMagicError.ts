import { MagicError } from '../class/MagicError'

export interface UseMagicErrorArgs {
  prefix?: string
  source?: string
}

export interface ThrowErrorArgs {
  message: string
  errorCode: string | number
  cause?: unknown
}

// Neeeded for the `assert` function to work correctly
export interface UseMagicErrorReturn {
  assert<T>(value: T, args: ThrowErrorArgs): asserts value is NonNullable<T>
  throwError(args: ThrowErrorArgs): never
  logError(message: string): void
  logWarning(message: string): void
  MagicError: typeof MagicError
}

export function useMagicError(
  args: UseMagicErrorArgs = {}
): UseMagicErrorReturn {
  const { prefix = 'MagicError', source = 'vue-equipment' } = args

  function logError(message: string) {
    console.error(`[${prefix}]:`, message)
  }

  function logWarning(message: string) {
    console.warn(`[${prefix}]:`, message)
  }

  function throwError(args: ThrowErrorArgs): never {
    const { message, errorCode, cause } = args

    const mappedMessage = `[${prefix}]: ${message}`
    const error = new MagicError(mappedMessage, errorCode, source, {
      cause,
    })

    logError(message)
    throw error
  }

  function assert<T>(
    value: T,
    args: ThrowErrorArgs
  ): asserts value is NonNullable<T> {
    if (value === undefined || value === null) {
      throwError(args)
    }
  }

  return {
    assert,
    throwError,
    logError,
    logWarning,
    MagicError,
  }
}
