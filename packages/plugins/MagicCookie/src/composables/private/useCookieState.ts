import { reactive, toValue, onScopeDispose, type MaybeRef } from 'vue'
import { defu } from 'defu'
import { createStateStore } from '@maas/vue-equipment/utils'
import { defaultOptions } from '../../utils/defaultOptions'
import type { CookieState, MagicCookieOptions } from '../../types/index'

const getCookieStateStore = createStateStore<CookieState[]>(
  'MagicCookie',
  () => []
)

export function useCookieState(instanceId: MaybeRef<string>) {
  const cookieStateStore = getCookieStateStore()
  let scopeCounted = false

  // Private functions
  function createState(id: string) {
    const state: CookieState = {
      id: id,
      refCount: 0,
      items: [],
      options: { ...defaultOptions },
      viewActive: false,
    }

    return reactive(state)
  }

  function addState(id: string) {
    const state = createState(id)
    cookieStateStore.value = [...cookieStateStore.value, state]

    return state
  }

  function deleteState() {
    const currentId = toValue(instanceId)
    cookieStateStore.value = cookieStateStore.value.filter(
      (x: CookieState) => x.id !== currentId
    )
  }

  // Public functions
  function initializeState(options?: MagicCookieOptions) {
    const currentId = toValue(instanceId)
    let state = cookieStateStore.value.find((entry) => entry.id === currentId)

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
    const state = cookieStateStore.value.find((entry) => entry.id === currentId)

    if (state) {
      state.refCount--
      if (state.refCount <= 0) {
        deleteState()
      }
    }
  })

  return {
    initializeState,
    cookieStateStore,
  }
}
