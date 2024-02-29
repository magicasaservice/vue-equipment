import { computed, toValue, type MaybeRef } from 'vue'
import { uuid } from '@maas/vue-equipment/utils'
import { useCommandStore } from './private/useCommandStore'
import { useCommandItem } from './private/useCommandItem'
import { useCommandView } from './private/useCommandView'

export function useCommandApi(id: MaybeRef<string>) {
  // Private state
  const mappedId = computed(() => toValue(id) || uuid())

  // Public state
  const isActive = computed(() =>
    commandStore.value.map((item) => item.id).includes(mappedId.value)
  )

  // Private methods
  const { commandStore, addInstance, removeInstance } = useCommandStore()

  // Public methods
  function open() {
    addInstance(mappedId.value)
  }

  function close() {
    removeInstance(mappedId.value)
  }

  const { selectItem, selectLastItem } = useCommandItem(mappedId)
  const { selectView, selectLastView } = useCommandView()

  return {
    isActive,
    open,
    close,
    selectItem,
    selectLastItem,
    selectView,
    selectLastView,
  }
}
