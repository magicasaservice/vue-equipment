import { computed, toValue, type MaybeRef } from 'vue'
import { useCommandStore } from './private/useCommandStore'
import { useCommandItem } from './private/useCommandItem'
import { useCommandView } from './private/useCommandView'

export function useMagicCommand(id: MaybeRef<string>) {
  // Public state
  const isActive = computed(() =>
    commandStore.value.map((item) => item.id).includes(toValue(id))
  )

  // Private methods
  const { commandStore, addInstance, removeInstance } = useCommandStore()

  // Public methods
  function open() {
    addInstance(toValue(id))
  }

  function close() {
    removeInstance(toValue(id))
  }

  const { selectItem, selectLastItem } = useCommandItem(toValue(id))
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
