import { computed, ref, toValue, nextTick, type MaybeRef } from 'vue'
import { useCookies } from '@vueuse/integrations/useCookies'
import { useMagicEmitter } from '@maas/vue-equipment/plugins'
import { useCookieState } from './private/useCookieState'

import type {
  CookieConsent,
  MagicCookieCallbackArgs,
  MappedCookies,
} from '../types'

// Public state
const preferencesVisible = ref(false)

export function useMagicCookie(id: MaybeRef<string>) {
  // @vueuse/integrations/useCookies
  const universalCookies = useCookies([toValue(id)])

  const { cookieState } = useCookieState({ id })

  // Private state
  const emitter = useMagicEmitter()

  const mappedCookies = computed(() =>
    cookieState?.cookies.reduce(
      (acc, cookie) => ({
        ...acc,
        [cookie.key]: cookie.optional === false ? true : cookie.value,
      }),
      {} as MappedCookies
    )
  )

  // Public state
  const cookieConsent = computed({
    get() {
      return universalCookies.get<CookieConsent>(toValue(id))
    },
    set(value: CookieConsent) {
      universalCookies.set(toValue(id), value, {
        path: '/',
        maxAge: cookieState?.maxAge,
      })
    },
  })

  // Public functions
  function showPreferences() {
    preferencesVisible.value = true
  }

  function hidePreferences() {
    preferencesVisible.value = false
  }

  function togglePreferences() {
    preferencesVisible.value = !preferencesVisible.value
  }

  function toggleCookie(key: string) {
    const cookie = cookieState.cookies.find((cookie) => cookie.key === key)
    if (cookie) {
      cookie.value = !cookie.value
    }

    console.log(cookie?.key, cookie?.value)
  }

  async function acceptAll() {
    // Set all cookies to true
    for (const cookie of cookieState.cookies) {
      cookie.value = true
    }

    await nextTick()

    // Get the current timestamp
    const timestamp = new Date().getTime()

    // Update the cookieConsent with the accepted cookies and timestamp
    cookieConsent.value = { timestamp, cookies: mappedCookies.value }

    // Emit the 'Accept' event with the updated cookieConsentData
    emitter.emit('acceptAll', cookieConsent.value)
  }

  // Accept selected cookies
  function acceptSelected() {
    // Get the current timestamp
    const timestamp = new Date().getTime()

    console.log(cookieState.cookies, mappedCookies.value)

    // Update cookieConsentData
    cookieConsent.value = {
      timestamp: timestamp,
      cookies: mappedCookies.value,
    }

    emitter.emit('acceptSelected', cookieConsent.value)
  }

  // Reject all cookies
  async function rejectAll() {
    // Set all optional cookies to false
    for (const cookie of cookieState.cookies) {
      cookie.value = cookie.optional === false ? true : false
    }

    await nextTick()

    // Get the current timestamp
    const timestamp = new Date().getTime()

    // Update cookieConsentData
    cookieConsent.value = { timestamp, cookies: mappedCookies.value }

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
    showPreferences,
    hidePreferences,
    togglePreferences,
    preferencesVisible,
    cookieConsent,
    toggleCookie,
    acceptAll,
    acceptSelected,
    rejectAll,
    onAccept,
    onAcceptSelected,
    onReject,
  }
}

export type UseMagicCookieReturn = ReturnType<typeof useMagicCookie>
