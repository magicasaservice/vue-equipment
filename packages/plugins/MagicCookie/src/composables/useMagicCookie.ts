import { computed, nextTick, type MaybeRef } from 'vue'
import { useMagicEmitter } from '@maas/vue-equipment/plugins/MagicEmitter'
import { useCookieState } from './private/useCookieState'
import { useCookieItem } from './private/useCookieItem'

import type { CookieConsent, MagicCookieCallbackArgs } from '../types'

export function useMagicCookie(id: MaybeRef<string>) {
  const { selectItem, unselectItem, toggleItem, setItemCookie } = useCookieItem(
    { instanceId: id }
  )

  // Private state
  const emitter = useMagicEmitter()

  const { initializeState } = useCookieState(id)
  const state = initializeState()

  // Public state
  const cookies = computed(() =>
    state?.items.reduce(
      (acc, cookie) => ({
        ...acc,
        [cookie.id]: cookie.optional === false ? true : cookie.active,
      }),
      {} as CookieConsent
    )
  )

  const cookiesSet = computed(() =>
    state?.items.every((cookie) => cookie.set === true)
  )

  // Public functions
  function showView() {
    state.viewActive = true
  }

  function hideView() {
    state.viewActive = false
  }

  function toggleView() {
    state.viewActive = !state.viewActive
  }

  async function acceptAll() {
    const timestamp = new Date().getTime()

    for (const cookie of state.items) {
      selectItem(cookie.id, timestamp)
      setItemCookie(cookie.id)
    }

    await nextTick()

    emitter.emit('acceptAll', cookies.value)
  }

  // Accept selected cookies
  function acceptSelected() {
    for (const cookie of state.items) {
      setItemCookie(cookie.id)
    }

    emitter.emit('acceptSelected', cookies.value)
  }

  // Reject all cookies
  async function rejectAll() {
    const timestamp = new Date().getTime()
    // Set all optional cookies to false
    for (const cookie of state.items) {
      if (cookie.optional !== false) {
        unselectItem(cookie.id, timestamp)
      }

      setItemCookie(cookie.id)
    }

    await nextTick()

    emitter.emit('rejectAll', cookies.value)
  }

  function onAccept(callback: (args: MagicCookieCallbackArgs) => void) {
    emitter.on('acceptAll', callback)
  }

  function onAcceptSelected(callback: (args: MagicCookieCallbackArgs) => void) {
    emitter.on('acceptSelected', callback)
  }

  function onReject(callback: (args: MagicCookieCallbackArgs) => void) {
    emitter.on('rejectAll', callback)
  }

  return {
    cookies,
    cookiesSet,
    showView,
    hideView,
    toggleView,
    selectItem,
    unselectItem,
    toggleItem,
    acceptAll,
    acceptSelected,
    rejectAll,
    onAccept,
    onAcceptSelected,
    onReject,
  }
}

export type UseMagicCookieReturn = ReturnType<typeof useMagicCookie>
