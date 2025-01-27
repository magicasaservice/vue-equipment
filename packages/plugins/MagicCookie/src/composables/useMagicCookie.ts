import { computed, nextTick, type MaybeRef } from 'vue'
import { useMagicEmitter } from '@maas/vue-equipment/plugins'
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
  const cookieConsent = computed(() =>
    state?.items.reduce(
      (acc, cookie) => ({
        ...acc,
        [cookie.id]: cookie.optional === false ? true : cookie.active,
      }),
      {} as CookieConsent
    )
  )

  const viewActive = computed(() => state.viewActive)

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

    emitter.emit('acceptAll', cookieConsent.value)
  }

  // Accept selected cookies
  function acceptSelected() {
    for (const cookie of state.items) {
      setItemCookie(cookie.id)
    }

    emitter.emit('acceptSelected', cookieConsent.value)
  }

  // Reject all cookies
  async function rejectAll() {
    const timestamp = new Date().getTime()
    // Set all optional cookies to false
    for (const cookie of state.items) {
      unselectItem(cookie.id, timestamp)
      setItemCookie(cookie.id)
    }

    await nextTick()

    emitter.emit('rejectAll', cookieConsent.value)
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
    viewActive,
    showView,
    hideView,
    toggleView,
    cookieConsent,
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
