import { ref, reactive, toValue, type Ref, type MaybeRef } from 'vue'
import { defu } from 'defu'
import { defaultOptions } from '../../utils/defaultOptions'
import type { CommandState, MagicCommandOptions } from '../../types/index'

const commandStateStore: Ref<CommandState[]> = ref([])

export function useCommandState(instanceId: MaybeRef<string>) {
  // Private functions
  function createState(id: string) {
    const view = commandStateStore.value
      .find((state) => state.id === id)
      ?.views.findLast((view) => view.active)?.id

    const state: CommandState = {
      id: id,
      options: { ...defaultOptions },
      views: [],
      renderer: null,
      active: false,
      input: {
        type: 'pointer',
        view: view,
      },
    }

    return reactive(state)
  }

  function addState(id: string) {
    const state = createState(id)
    commandStateStore.value = [...commandStateStore.value, state]

    return state
  }

  // Public functions
  function initializeState(options?: MagicCommandOptions) {
    let state = commandStateStore.value.find((entry) => {
      return entry.id === toValue(instanceId)
    })

    if (!state) {
      state = addState(toValue(instanceId))
    }

    if (options) {
      const mappedOptions = defu(options, defaultOptions)
      state.options = mappedOptions
    }

    return state
  }

  function deleteState() {
    commandStateStore.value = commandStateStore.value.filter(
      (x: CommandState) => x.id !== toValue(instanceId)
    )
  }

  return {
    initializeState,
    deleteState,
    commandStateStore,
  }
}
