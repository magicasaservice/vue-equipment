import { reactive, toValue, onScopeDispose, type MaybeRef } from 'vue'
import { defu } from 'defu'
import { createStateStore } from '@maas/vue-equipment/utils'
import { defaultOptions } from '../../utils/defaultOptions'
import type { MenuState, MagicMenuOptions } from '../../types/index'

const getMenuStateStore = createStateStore<MenuState[]>('MagicMenu', () => [])

export function useMenuState(instanceId: MaybeRef<string>) {
  const menuStateStore = getMenuStateStore()
  let scopeCounted = false

  // Private functions
  function createState(id: string) {
    const state: MenuState = {
      id: id,
      refCount: 0,
      options: { ...defaultOptions },
      views: [],
      active: false,
      input: {
        type: 'pointer',
        disabled: [],
        view: undefined,
      },
    }

    return reactive(state)
  }

  function addState(id: string) {
    const state = createState(id)
    menuStateStore.value = [...menuStateStore.value, state]

    return state
  }

  function deleteState() {
    const currentId = toValue(instanceId)
    menuStateStore.value = menuStateStore.value.filter(
      (x: MenuState) => x.id !== currentId
    )
  }

  // Public functions
  function initializeState(options?: MagicMenuOptions) {
    const currentId = toValue(instanceId)
    let state = menuStateStore.value.find((entry) => entry.id === currentId)

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
    const state = menuStateStore.value.find((entry) => entry.id === currentId)

    if (state) {
      state.refCount--
      if (state.refCount <= 0) {
        deleteState()
      }
    }
  }, true)

  return {
    initializeState,
    menuStateStore,
  }
}
