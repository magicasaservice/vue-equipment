import { reactive, type MaybeRef } from 'vue'
import { useMenuView } from './useMenuView'
import type { MenuChannel } from '../../types'

type UseMenuChannelArgs = {
  instanceId: MaybeRef<string>
  viewId: string
}

type CreateChannelArgs = Pick<MenuChannel, 'id'>
type AddChannelArgs = Pick<MenuChannel, 'id'>
type InitializeChannelArgs = Pick<MenuChannel, 'id'>

export function useMenuChannel(args: UseMenuChannelArgs) {
  const { instanceId, viewId } = args

  const { getView } = useMenuView(instanceId)
  const view = getView(viewId)

  // Channel cache for faster lookups
  const channelMap = new Map<string, MenuChannel>()

  function createChannel(args: CreateChannelArgs): MenuChannel {
    const { id } = args

    const channel: MenuChannel = reactive({
      id,
      active: false,
    })

    // Cache the channel
    channelMap.set(id, channel)
    return channel
  }

  function addChannel(args: AddChannelArgs): MenuChannel {
    const channel = createChannel(args)

    if (view?.channels) {
      view.channels.push(channel) // Direct push instead of spread
    }

    return channel
  }

  function unselectSiblings(id: string) {
    if (!view?.channels) {
      return
    }

    // Direct array iteration is faster than filter + forEach
    for (const channel of view.channels) {
      if (channel.id !== id) {
        channel.active = false
      }
    }
  }

  function getChannel(id: string): MenuChannel | undefined {
    if (!view?.channels) {
      return undefined
    }

    // Always check view first to ensure we have latest state
    const channel = view.channels.find((ch) => ch.id === id)
    if (channel) {
      channelMap.set(id, channel) // Update cache
      return channel
    }

    return undefined
  }

  function initializeChannel(args: InitializeChannelArgs): MenuChannel {
    const { id } = args
    const channel = getChannel(id) ?? addChannel(args)

    return channel
  }

  function deleteChannel(id: string) {
    if (!view?.channels) {
      return
    }

    const index = view.channels.findIndex((channel) => channel.id === id)
    if (index !== -1) {
      view.channels.splice(index, 1)
      channelMap.delete(id)
    }
  }

  function selectChannel(id: string) {
    const channel = getChannel(id)
    if (!channel) {
      return
    }

    channel.active = true
    unselectSiblings(id)
  }

  function unselectChannel(id: string) {
    const channel = getChannel(id)
    if (!channel) {
      return
    }

    channel.active = false
  }

  return {
    initializeChannel,
    deleteChannel,
    getChannel,
    selectChannel,
    unselectChannel,
  }
}
