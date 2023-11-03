import { shallowRef, reactive, type ShallowRef } from 'vue'
import type { UseMediaApiReturn } from './useMediaApi'
import type { UsePlayerInternalApiReturn } from './usePlayerInternalApi'
import type { UseRuntimeSourceProviderReturn } from './useRuntimeSourceProvider'
import type { UseControlsApiReturn } from './useControlsApi'
import type { UsePlayerApiArgs } from '../../types'

export interface PlayerInstance {
  id: string
  mediaApi: UseMediaApiReturn
  playerApi: UsePlayerInternalApiReturn
  controlsApi: UseControlsApiReturn
  runtimeProvider: UseRuntimeSourceProviderReturn
  args: UsePlayerApiArgs
}

const playerStore: ShallowRef<PlayerInstance[]> = shallowRef([])

export function usePlayerStore() {
  const defaultMediaApi = reactive({}) as UseMediaApiReturn
  const defaultPlayerApi = reactive({}) as UsePlayerInternalApiReturn
  const defaultControlsApi = reactive({}) as UseControlsApiReturn
  const defaultRuntimeProvider = reactive({}) as UseRuntimeSourceProviderReturn
  const defaultArgs = reactive({}) as UsePlayerApiArgs

  function createInstance(id: string): PlayerInstance {
    const instance: PlayerInstance = {
      id: id,
      mediaApi: defaultMediaApi,
      playerApi: defaultPlayerApi,
      controlsApi: defaultControlsApi,
      runtimeProvider: defaultRuntimeProvider,
      args: defaultArgs,
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
