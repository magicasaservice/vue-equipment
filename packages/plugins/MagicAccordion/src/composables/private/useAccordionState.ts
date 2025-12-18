import { reactive, toValue, onScopeDispose, type MaybeRef } from 'vue'
import { defu } from 'defu'
import { createStateStore } from '@maas/vue-equipment/utils'
import { defaultOptions } from '../../utils/defaultOptions'
import type { AccordionState, MagicAccordionOptions } from '../../types/index'

const getAccordionStateStore = createStateStore<AccordionState[]>(
  'MagicAccordion',
  () => []
)

export function useAccordionState(instanceId: MaybeRef<string>) {
  const accordionStateStore = getAccordionStateStore()
  let scopeCounted = false

  // Private functions
  function createState(id: string) {
    const state: AccordionState = {
      id: id,
      refCount: 0,
      options: { ...defaultOptions },
      views: [],
    }

    return reactive(state)
  }

  function addState(id: string) {
    const state = createState(id)
    accordionStateStore.value = [...accordionStateStore.value, state]

    return state
  }

  function deleteState() {
    const currentId = toValue(instanceId)
    accordionStateStore.value = accordionStateStore.value.filter(
      (x: AccordionState) => x.id !== currentId
    )
  }

  // Public functions
  function initializeState(options?: MagicAccordionOptions) {
    const currentId = toValue(instanceId)
    let state = accordionStateStore.value.find(
      (entry) => entry.id === currentId
    )

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
    const state = accordionStateStore.value.find(
      (entry) => entry.id === currentId
    )

    if (state) {
      state.refCount--
      if (state.refCount <= 0) {
        deleteState()
      }
    }
  })

  return {
    initializeState,
    accordionStateStore,
  }
}
