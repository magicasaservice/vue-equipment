import { reactive, toValue, onScopeDispose, type MaybeRef } from 'vue'
import { defu } from 'defu'
import { createStateStore } from '@maas/vue-equipment/utils'
import { defaultOptions } from '../../utils/defaultOptions'
import type { CommandState, MagicCommandOptions } from '../../types/index'

const getCommandStateStore = createStateStore<CommandState[]>(
  'MagicCommand',
  () => []
)

export function useCommandState(instanceId: MaybeRef<string>) {
  const commandStateStore = getCommandStateStore()
  let scopeCounted = false

  // Private functions
  function createState(id: string) {
    const view = commandStateStore.value
      .find((state) => state.id === id)
      ?.views.findLast((view) => view.active)?.id

    const state: CommandState = {
      id: id,
      refCount: 0,
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

  function deleteState() {
    const currentId = toValue(instanceId)
    commandStateStore.value = commandStateStore.value.filter(
      (x: CommandState) => x.id !== currentId
    )
  }

  // Public functions
  function initializeState(options?: MagicCommandOptions) {
    const currentId = toValue(instanceId)
    let state = commandStateStore.value.find((entry) => entry.id === currentId)

    if (!state) {
      state = addState(currentId)
    }

    if (!scopeCounted) {
      state.refCount++
      scopeCounted = true
    }

    if (options) {
      const mappedOptions = defu(options, defaultOptions)
      state.options = mappedOptions
    }

    return state
  }

  onScopeDispose(() => {
    if (!scopeCounted) {
      return
    }

    const currentId = toValue(instanceId)
    const state = commandStateStore.value.find(
      (entry) => entry.id === currentId
    )

    if (state) {
      state.refCount--
      if (state.refCount <= 0) {
        deleteState()
      }
    }
  }, true)

  return {
    initializeState,
    commandStateStore,
  }
}
