import { toValue, type MaybeRef } from 'vue'
// import { useMenuState } from './private/useMenuState'
import { useMenuItem } from './private/useMenuItem'
import { useMenuView } from './private/useMenuView'

export function useMagicMenu(id: MaybeRef<string>) {
  // Public methods
  const { selectItem } = useMenuItem(toValue(id))
  const { selectView } = useMenuView(toValue(id))

  return {
    selectItem,
    selectView,
  }
}
