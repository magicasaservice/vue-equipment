import { type MaybeRef } from 'vue'
import { useMenuView } from './private/useMenuView'

export function useMagicMenu(instanceId: MaybeRef<string>) {
  // Public functions
  const { selectView, unselectView } = useMenuView(instanceId)

  return {
    selectView,
    unselectView,
  }
}

export type UseMagicMenuReturn = ReturnType<typeof useMagicMenu>
