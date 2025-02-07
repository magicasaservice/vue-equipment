import { ref, reactive, toValue, type Ref, type MaybeRef } from 'vue'
import { defu } from 'defu'
import { defaultOptions } from '../../utils/defaultOptions'
import type { AccordionState, MagicAccordionOptions } from '../../types/index'

const accordionStateStore: Ref<AccordionState[]> = ref([])

export function useAccordionState(instanceId: MaybeRef<string>) {
  // Private functions
  function createState(id: string) {
    const state: AccordionState = {
      id: id,
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

  // Public functions
  function initializeState(options?: MagicAccordionOptions) {
    let state = accordionStateStore.value.find((entry) => {
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
    accordionStateStore.value = accordionStateStore.value.filter(
      (x: AccordionState) => x.id !== toValue(instanceId)
    )
  }

  return {
    initializeState,
    deleteState,
    accordionStateStore,
  }
}
