import { shallowRef, reactive, type ShallowRef } from 'vue'
import type { UseMediaApiReturn } from './useMediaApi'
import type { UsePlayerInternalApiReturn } from './usePlayerInternalApi'
import type { UseRuntimeSourceProviderReturn } from './useRuntimeSourceProvider'
import type { UseControlsApiReturn } from './useControlsApi'

export interface PlayerInstance {
  id: string
  mediaApi: UseMediaApiReturn
  playerApi: UsePlayerInternalApiReturn
  controlsApi: UseControlsApiReturn
  runtimeProvider: UseRuntimeSourceProviderReturn
}

const playerStore: ShallowRef<PlayerInstance[]> = shallowRef([])

export function usePlayerStore() {
  function createInstance(id: string): PlayerInstance {
    const instance: PlayerInstance = {
      id: id,
      mediaApi: reactive({}) as UseMediaApiReturn,
      playerApi: reactive({}) as UsePlayerInternalApiReturn,
      controlsApi: reactive({}) as UseControlsApiReturn,
      runtimeProvider: reactive({}) as UseRuntimeSourceProviderReturn,
    } as PlayerInstance
    return instance
  }

  // Public methods
  function findInstance(id: string) {
    const instance = playerStore.value.find((instance) => {
      return instance.id === id
    })
    return instance as PlayerInstance
  }

  function addInstance(id: string): PlayerInstance {
    const instance = createInstance(id)
    playerStore.value.push(instance)
    return findInstance(id)
  }

  function removeInstance(id: string) {
    playerStore.value = playerStore.value.filter(
      (instance) => instance.id !== id,
    )
  }

  return {
    playerStore,
    findInstance,
    addInstance,
    removeInstance,
  }
}
