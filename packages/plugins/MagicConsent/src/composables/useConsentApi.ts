import { computed, ref } from 'vue'
import { useCookies } from '@vueuse/integrations/useCookies'
import { toValue } from '@vueuse/core'
import { globalApiState } from './private/defineConsentApi'
import { useConsentEmitter } from './useConsentEmitter'

import type { CookieConsentData } from '../types'

// Use universal cookies from the @vueuse/integrations/useCookies
const universalCookies = useCookies(['cookie_consent'])

// Reactive variables
const preferencesVisible = ref(false)
const selectedCookies = ref<{ [key: string]: boolean }>({})

// Computed property to manage the cookie consent data
const cookieConsentData = computed({
  get: () => {
    // Retrieve the cookie consent data from the cookies
    return universalCookies.get('cookie_consent') as CookieConsentData
  },
  set: (value: CookieConsentData) => {
    // Update the cookie consent data in the cookies
    universalCookies.set('cookie_consent', value, {
      maxAge: globalApiState.value?.maxAge,
    })
  },
})

export function useConsentApi() {
  // Initialize an event emitter for custom events
  const emitter = useConsentEmitter()

  // Initial state: selectedCookies value is set based on the current cookie consent data
  selectedCookies.value = cookieConsentData.value?.cookies || {}

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
      globalApiState.value?.cookies?.reduce(
        (result, cookie) => {
          result[cookie.key] = true
          return result
        },
        {} as { [key: string]: boolean },
      )

    // Set the selectedCookies value to include all cookies
    selectedCookies.value = cookies

    // Get the current timestamp
    const timestamp = new Date().getTime()

    // Update the cookieConsentData with the accepted cookies and timestamp
    cookieConsentData.value = { timestamp, cookies }

    // Emit the 'Accept' event with the updated cookieConsentData
    emitter.emit('accept', cookieConsentData.value)
  }

  // Accept selected cookies
  function acceptSelected() {
    // Get the current timestamp
    const timestamp = new Date().getTime()

    // Update the cookieConsentData with the selected cookies and timestamp
    cookieConsentData.value = {
      timestamp: timestamp,
      cookies: selectedCookies.value,
    }

    // Emit the 'AcceptSelected' event with the updated cookieConsentData
    emitter.emit('acceptSelected', cookieConsentData.value)
  }

  // Reject all cookies
  function reject() {
    // Create an object representing all cookies as rejected (optional cookies as accepted)
    const cookies: { [key: string]: boolean } =
      globalApiState.value?.cookies?.reduce(
        (result, cookie) => {
          result[cookie.key] = cookie.optional === false ? true : false
          return result
        },
        {} as { [key: string]: boolean },
      )

    // Set the selectedCookies value to include all cookies
    selectedCookies.value = cookies

    // Get the current timestamp
    const timestamp = new Date().getTime()

    // Update the cookieConsentData with the rejected cookies and timestamp
    cookieConsentData.value = { timestamp, cookies }

    // Emit the 'Reject' event with the updated cookieConsentData
    emitter.emit('reject', cookieConsentData.value)
  }

  // Events
  function onAccept(handler: (args: CookieConsentData) => void) {
    emitter.on('accept', (args: CookieConsentData) => handler(toValue(args)))
  }

  function onAcceptSelected(handler: (args: CookieConsentData) => void) {
    emitter.on('acceptSelected', (args: CookieConsentData) =>
      handler(toValue(args)),
    )
  }

  function onReject(handler: (args: CookieConsentData) => void) {
    emitter.on('reject', (args: CookieConsentData) => handler(toValue(args)))
  }

  // Return the API functions and reactive variables
  return {
    preferencesVisible,
    selectedCookies,
    cookieConsentData,
    toggleSelection,
    accept,
    acceptSelected,
    reject,
    onAccept,
    onAcceptSelected,
    onReject,
  }
}
