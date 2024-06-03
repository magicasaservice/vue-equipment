import { ref, reactive, toValue, type MaybeRef } from 'vue'
import { defu } from 'defu'
import { defaultOptions } from '../../utils/defaultOptions'

import type { CommandState, MagicCommandOptions } from '../../types/index'

let commandStateStore = ref<CommandState[]>([])

export function useCommandState(instanceId: MaybeRef<string>) {
  // Private functions
  function createState(id: string) {
    const state: CommandState = {
      id,
      views: [],
      options: defaultOptions,
      active: false,
    }
    return reactive(state)
  }

  function addState(id: string) {
    const instance = createState(id)
    commandStateStore.value = [...commandStateStore.value, instance]

    return instance
  }

  // Public functions
  function initializeState(options?: MagicCommandOptions) {
    let instance = commandStateStore.value.find((instance) => {
      return instance.id === toValue(instanceId)
    })

    if (!instance) {
      instance = addState(toValue(instanceId))
    }

    if (options) {
      const mappedOptions = defu(options, defaultOptions)
      instance.options = mappedOptions
    }

    return instance
  }

  function deleteState() {
    commandStateStore.value = commandStateStore.value.filter(
      (x: CommandState) => x.id !== toValue(instanceId)
    )
  }

  return {
    commandStateStore,
    initializeState,
    deleteState,
  }
}
