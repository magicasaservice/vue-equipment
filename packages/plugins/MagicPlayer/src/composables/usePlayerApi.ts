import { uuid } from 'utils'
import { computed, onUnmounted, toValue, type MaybeRef } from 'vue'
import { usePlayerStore } from './private/usePlayerStore'
import { usePlayerInternalApi } from './private/usePlayerInternalApi'
import { useMediaApi } from './private/useMediaApi'
import { useControlsApi } from './private/useControlsApi'
import { useRuntimeSourceProvider } from './private/useRuntimeSourceProvider'
import type { UsePlayerApiArgs } from '../types'

export function usePlayerApi(args: UsePlayerApiArgs | MaybeRef<string>) {
  const { findInstance, addInstance, removeInstance } = usePlayerStore()

  // Private state
  const mappedId = computed(() => {
    if (typeof args === 'string') {
      return toValue(args) || uuid()
    } else if ('id' in args) {
      return toValue(args.id) || uuid()
    } else {
      return uuid()
    }
  })

  // Public state
  const instance = computed(() => findInstance(toValue(mappedId)))

  // Private methods
  function initialize() {
    const id = toValue(mappedId)
    let instance = findInstance(id)

    // If no instance is found, create one
    if (!instance) {
      instance = addInstance(id)
    }

    // If any args are provided, they are used to full initialize the instance
    // The order here is important, since some composables depend on each other
    if (typeof args !== 'string') {
      if ('mediaRef' in args) {
        instance.mediaApi = useMediaApi({ mediaRef: args.mediaRef })
      } else if ('videoRef' in args) {
        instance.mediaApi = useMediaApi({ mediaRef: args.videoRef })
      }

      if ('videoRef' in args && 'playerRef' in args) {
        instance.playerApi = usePlayerInternalApi({
          id,
          playerRef: args.playerRef,
          videoRef: args.videoRef,
        })
      }

      if ('videoRef' in args && 'srcType' in args && 'src' in args) {
        instance.runtimeProvider = useRuntimeSourceProvider({
          videoRef: args.videoRef,
          srcType: args.srcType!,
          src: args.src!,
        })
      }

      if ('barRef' in args && 'trackRef' in args) {
        instance.controlsApi = useControlsApi({
          id,
          barRef: args.barRef,
          trackRef: args.trackRef,
          popoverRef: args.popoverRef,
        })
      }
    }

    return instance
  }

  function destroy(id: string) {
    if (!id) return
    removeInstance(toValue(id))
  }

  // Lifecycle
  onUnmounted(() => {
    destroy(toValue(mappedId))
  })

  // Initialize within setup
  initialize()

  return {
    instance,
  }
}

export type UsePlayerApiReturn = ReturnType<typeof usePlayerApi>
