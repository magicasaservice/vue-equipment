import { toValue, type MaybeRef, type ComputedRef } from 'vue'
import { useMenuChannel } from './useMenuChannel'
import type { Interaction } from '../../types'

interface UseMenuRemoteArgs {
  viewId: string
  instanceId: MaybeRef<string>
  mappedChannelId: MaybeRef<string>
  mappedTrigger: ComputedRef<Interaction[]>
}

export function useMenuRemote(args: UseMenuRemoteArgs) {
  const { viewId, instanceId, mappedChannelId, mappedTrigger } = args

  const { selectChannel } = useMenuChannel({
    instanceId: instanceId,
    viewId,
  })

  function onClick() {
    if (mappedTrigger.value.includes('click')) {
      selectChannel(toValue(mappedChannelId))
    }
  }

  function onMouseenter() {
    if (mappedTrigger.value.includes('mouseenter')) {
      selectChannel(toValue(mappedChannelId))
    }
  }

  return {
    onClick,
    onMouseenter,
  }
}
