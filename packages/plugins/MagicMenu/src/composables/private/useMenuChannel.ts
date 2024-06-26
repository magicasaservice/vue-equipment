import { reactive, type MaybeRef } from 'vue'
import { useMenuView } from './useMenuView'
import { useMenuState } from './useMenuState'
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

  const { initializeState } = useMenuState(instanceId)
  const state = initializeState()

  const { getView } = useMenuView(instanceId)
  const view = getView(viewId)

  // Private functions
  function createChannel(args: CreateChannelArgs) {
    const { id } = args

    const channel: MenuChannel = {
      id: id,
      active: false,
    }

    return reactive(channel)
  }

  function addChannel(args: AddChannelArgs) {
    const channel = createChannel(args)

    if (view?.channels) {
      view.channels = [...view?.channels, channel]
    }

    return channel
  }

  function unselectSiblings(id: string) {
    return view?.channels
      .filter((channel) => channel.id !== id)
      .forEach((channel) => (channel.active = false))
  }

  // Public functions
  function initializeChannel(args: InitializeChannelArgs) {
    const { id } = args
    const instance = getChannel(id)

    if (!instance) {
      const channel = addChannel(args)
      return channel
    }

    return instance
  }

  function deleteChannel(id: string) {
    if (!view?.channels) return
    view.channels = view.channels.filter((x) => x.id !== id)
  }

  function getChannel(id: string) {
    return view?.channels.find((channel) => {
      return channel.id === id
    })
  }

  function selectChannel(id: string) {
    const instance = getChannel(id)

    if (instance) {
      instance.active = true

      // Deactivate all siblings
      unselectSiblings(id)

      // Set view in focus
      if (view) {
        state.input.view = view.id
      }
    }
  }

  function unselectChannel(id: string) {
    const instance = getChannel(id)

    if (instance) {
      instance.active = false
    }
  }

  return {
    initializeChannel,
    deleteChannel,
    getChannel,
    selectChannel,
    unselectChannel,
  }
}
