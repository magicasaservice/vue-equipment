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
      options: defaultOptions,
      views: [],
    }

    return reactive(state)
  }

  function addState(id: string) {
    const instance = createState(id)
    accordionStateStore.value = [...accordionStateStore.value, instance]

    return instance
  }

  // Public functions
  function initializeState(options?: MagicAccordionOptions) {
    let instance = accordionStateStore.value.find((instance) => {
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
