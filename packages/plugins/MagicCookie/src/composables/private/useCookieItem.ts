import { reactive, toValue, type MaybeRef } from 'vue'
import { useCookies } from '@vueuse/integrations/useCookies'
import { useCookieState } from './useCookieState'

import type { CookieItem } from '../../types'

type UseCookieItemArgs = {
  instanceId: MaybeRef<string>
}

type InitializeItemArgs = Omit<CookieItem, 'active'>
type CreateItemArgs = Omit<CookieItem, 'active'>
type AddItemArgs = Omit<CookieItem, 'active'>

export function useCookieItem(args: UseCookieItemArgs) {
  const { instanceId } = args

  const { initializeState } = useCookieState(instanceId)
  const state = initializeState()

  // Private functions
  function getBrowserCookie(id: string) {
    // @vueuse/integrations/useCookies
    const universalCookies = useCookies([id])
    return universalCookies.get<boolean>(id)
  }

  function createItem(args: CreateItemArgs) {
    const { id, optional, maxAge = state.options.maxAge } = args

    const storedValue = getBrowserCookie(id)

    // Set to active if optional is false and no cookie is found
    const mappedActive = storedValue ?? (optional === false ? true : false)
    const mappedOptional = optional ?? true
    const timestamp = new Date().getTime()

    const item: CookieItem = {
      id: id,
      active: mappedActive,
      optional: mappedOptional,
      timestamp: timestamp,
      maxAge: maxAge,
    }

    console.log(item)

    return reactive(item)
  }

  function addItem(args: AddItemArgs) {
    const item = createItem(args)

    state.items.push(item)

    return item
  }

  // Public functions
  function initializeItem(args: InitializeItemArgs) {
    const { id } = args
    const item = getItem(id) ?? addItem(args)

    return item
  }

  function deleteItem(id: string) {
    if (!state?.items) return
    state.items = state.items.filter((x) => x.id !== id)
  }

  function getItem(id: string) {
    return state?.items.find((item) => {
      return item.id === id
    })
  }

  function selectItem(id: string, timestamp?: number) {
    const item = getItem(id)

    if (item) {
      item.active = true
      item.timestamp = timestamp ?? item.timestamp
    }
  }

  function unselectItem(id: string, timestamp?: number) {
    const item = getItem(id)

    if (item) {
      item.active = false
      item.timestamp = timestamp ?? item.timestamp
    }
  }

  function toggleItem(id: string) {
    const item = getItem(id)

    if (item) {
      item.active = !item.active
    }
  }

  function setItemCookie(id: string) {
    const item = getItem(id)

    if (!item) {
      console.warn(`Item ${id} not found. Cookie cannot be set.`)
      return
    }

    useCookies([id]).set(toValue(id), item.active, {
      path: '/',
      maxAge: item.maxAge,
    })
  }

  return {
    initializeItem,
    deleteItem,
    getItem,
    selectItem,
    unselectItem,
    toggleItem,
    setItemCookie,
  }
}
