import { type MaybeRef } from 'vue'
import { useMenuView } from './private/useMenuView'
import { useMenuChannel } from './private/useMenuChannel'

interface UseMagicMenuArgs {
  instanceId: MaybeRef<string>
  viewId: string
}

export function useMagicMenu(args: UseMagicMenuArgs) {
  const { instanceId, viewId } = args

  // Public functions
  const { selectView, unselectView } = useMenuView(instanceId)
  const { selectChannel, unselectChannel } = useMenuChannel({
    instanceId,
    viewId,
  })

  return {
    selectView,
    unselectView,
    selectChannel,
    unselectChannel,
  }
}

export type UseMagicMenuReturn = ReturnType<typeof useMagicMenu>
