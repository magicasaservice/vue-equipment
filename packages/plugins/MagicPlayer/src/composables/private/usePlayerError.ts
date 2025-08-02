import { toValue, toRefs, type MaybeRef } from 'vue'
import { usePlayerState } from './usePlayerState'

import Hls, { ErrorTypes } from 'hls.js'
import type { PlayerError, PlayerErrorType } from '../../types'

export type UsePlayerErrorArgs = {
  id: MaybeRef<string>
}

interface CreateErrorArgs {
  type: PlayerErrorType
  message: string
  originalError?: Error
}

interface HandleHlsRuntimeErrorArgs {
  data: { fatal: boolean; type: ErrorTypes; details?: string }
  hls?: Hls
}

export function usePlayerError(args: UsePlayerErrorArgs) {
  const { id } = args

  const { initializeState } = usePlayerState(toValue(id))
  const state = initializeState()
  const { errors } = toRefs(state)

  // Private functions
  function createError(args: CreateErrorArgs): PlayerError {
    return {
      ...args,
      timestamp: Date.now(),
    }
  }

  function setError(error: PlayerError) {
    errors.value.push(error)

    // Log error for debugging
    console.error(
      `MagicPlayer [${error.type}]:`,
      error.message,
      error.originalError
    )
  }

  function clearErrors() {
    errors.value = []
  }

  // Public error handlers
  function handlePlayPromiseError(originalError: Error) {
    let type: PlayerErrorType = 'play-promise-rejected'
    let message = 'Play promise was rejected'

    switch (originalError.name) {
      case 'AbortError':
        message = 'Play was interrupted by another operation'
        break
      case 'NotAllowedError':
        message = 'Autoplay was prevented - user interaction required'
        break
      case 'NotSupportedError':
        message = 'Media format not supported'
        type = 'unsupported-source'
        break
    }

    setError(createError({ type, message, originalError }))
  }

  function handleMediaElementError(mediaError: MediaError) {
    const type = 'media-element-error'
    let message = 'Media element error'

    switch (mediaError.code) {
      case MediaError.MEDIA_ERR_ABORTED:
        message = 'Media loading was aborted by the user'
        break
      case MediaError.MEDIA_ERR_NETWORK:
        message = 'A network error occurred while loading the media'
        break
      case MediaError.MEDIA_ERR_DECODE:
        message = 'An error occurred while decoding the media'
        break
      case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
        message = 'The media source is not supported'
        break
    }

    const originalError = new Error(message, { cause: mediaError })
    setError(createError({ type, message, originalError }))
  }

  function handleNativeInitError(error: Error) {
    setError(
      createError({
        type: 'native-init-error',
        message: `Native player initialization failed: ${error.message}`,
        originalError: error,
      })
    )
  }

  function handleHlsInitError(originalError: Error) {
    const type: PlayerErrorType = 'hls-init-error'
    const message = `HLS initialization failed: ${originalError.message}`

    setError(createError({ type, message, originalError }))
  }

  function handleHlsRuntimeError(args: HandleHlsRuntimeErrorArgs) {
    const { data, hls } = args

    let type: PlayerErrorType = 'hls-fatal-error'
    let message = `HLS Fatal Error: ${data.details || 'Unknown HLS error'}`

    if (!data.fatal) {
      console.warn(`HLS Non-fatal error [${data.type}]:`, data.details)
      return
    }

    switch (data.type) {
      case ErrorTypes.NETWORK_ERROR:
        type = 'hls-network-error'
        message = `HLS Network Error: ${data.details || 'Unknown network error'}`
        break
      case ErrorTypes.MEDIA_ERROR:
        type = 'hls-media-error'

        try {
          if (hls) {
            hls.recoverMediaError()
            message = `HLS Media Error Recovered: ${data.details || 'Unknown media error'}`

            const originalError = new Error(message, { cause: data })
            setError(createError({ type, message, originalError }))
            return
          }
        } catch (recoverErr) {
          type = 'hls-media-error'
          message = `HLS Media Recovery Failed: ${recoverErr instanceof Error ? recoverErr.message : 'Unknown error'}`

          const originalError = new Error(message, { cause: data })
          setError(createError({ type, message, originalError }))
          return
        }

        type = 'hls-media-error'
        message = `HLS Media Error: ${data.details || 'Unknown media error'}`
        break
    }

    const originalError = new Error(message, { cause: data })
    setError(createError({ type, message, originalError }))
  }

  return {
    handlePlayPromiseError,
    handleMediaElementError,
    handleNativeInitError,
    handleHlsInitError,
    handleHlsRuntimeError,
    clearErrors,
  }
}

export type UsePlayerErrorReturn = ReturnType<typeof usePlayerError>
