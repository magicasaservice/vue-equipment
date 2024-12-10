import { computed, ref } from 'vue'
import { useCookies } from '@vueuse/integrations/useCookies'
import { toValue } from '@vueuse/core'
import { useMagicEmitter } from '@maas/vue-equipment/plugins'
import { cookieApiStore } from './private/useCookieApi'

import type { MagicCookieConsent } from '../types'

// Reactive variables
const preferencesVisible = ref(false)
const selectedCookies = ref<{ [key: string]: boolean }>({})

export function useMagicCookie() {
  // Use universal cookies from the @vueuse/integrations/useCookies
  const universalCookies = useCookies(['cookie_consent'])

  // Computed property to manage cookie consent data
  const cookieConsent = computed({
    get: () => {
      return universalCookies.get('cookie_consent') as MagicCookieConsent
    },
    set: (value: MagicCookieConsent) => {
      universalCookies.set('cookie_consent', value, {
        path: '/',
        maxAge: cookieApiStore.value?.maxAge,
      })
    },
  })

  // Initialize an event emitter for custom events
  const emitter = useMagicEmitter()

  // Initial state: selectedCookies value is set based on the current cookie consent data
  selectedCookies.value = cookieConsent.value?.cookies || {}

  // Methods
  // Toggle the selection of a specific cookie by key
  function toggleSelection(key: string) {
    selectedCookies.value = {
      ...selectedCookies.value,
      [key]: !selectedCookies.value[key],
    }
  }

  // Accept all cookies
  function accept() {
    // Create an object representing all cookies as accepted
    const cookies: { [key: string]: boolean } =
      cookieApiStore.value?.cookies?.reduce((result, cookie) => {
        result[cookie.key] = true
        return result
      }, {} as { [key: string]: boolean })

    // Set the selectedCookies value to include all cookies
    selectedCookies.value = cookies

    // Get the current timestamp
    const timestamp = new Date().getTime()

    // Update the cookieConsent with the accepted cookies and timestamp
    cookieConsent.value = { timestamp, cookies }

    // Emit the 'Accept' event with the updated cookieConsentData
    emitter.emit('accept', cookieConsent.value)
  }

  // Accept selected cookies
  function acceptSelected() {
    // Get the current timestamp
    const timestamp = new Date().getTime()

    // Update the cookieConsentData with the selected cookies and timestamp
    cookieConsent.value = {
      timestamp: timestamp,
      cookies: selectedCookies.value,
    }

    // Emit the 'AcceptSelected' event with the updated cookieConsentData
    emitter.emit('acceptSelected', cookieConsent.value)
  }

  // Reject all cookies
  function reject() {
    // Create an object representing all cookies as rejected (optional cookies as accepted)
    const cookies: { [key: string]: boolean } =
      cookieApiStore.value?.cookies?.reduce((result, cookie) => {
        result[cookie.key] = cookie.optional === false ? true : false
        return result
      }, {} as { [key: string]: boolean })

    // Set the selectedCookies value to include all cookies
    selectedCookies.value = cookies

    // Get the current timestamp
    const timestamp = new Date().getTime()

    // Update the cookieConsentData with the rejected cookies and timestamp
    cookieConsent.value = { timestamp, cookies }

    // Emit the 'Reject' event with the updated cookieConsentData
    emitter.emit('reject', cookieConsent.value)
  }

  // Events
  function onAccept(handler: (args: MagicCookieConsent) => void) {
    emitter.on('accept', (args: MagicCookieConsent) => handler(toValue(args)))
  }

  function onAcceptSelected(handler: (args: MagicCookieConsent) => void) {
    emitter.on('acceptSelected', (args: MagicCookieConsent) =>
      handler(toValue(args))
    )
  }

  function onReject(handler: (args: MagicCookieConsent) => void) {
    emitter.on('reject', (args: MagicCookieConsent) => handler(toValue(args)))
  }

  // Return the API functions and reactive variables
  return {
    preferencesVisible,
    selectedCookies,
    cookieConsent,
    toggleSelection,
    accept,
    acceptSelected,
    reject,
    onAccept,
    onAcceptSelected,
    onReject,
  }
}

export type UseMagicCookieReturn = ReturnType<typeof useMagicCookie>
