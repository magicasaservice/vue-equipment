import { reactive, toValue, type MaybeRef, type Reactive } from 'vue'
import { useCookies } from '@vueuse/integrations/useCookies'
import { slugify } from '@maas/vue-equipment/utils'
import type { MagicCookie } from '../../types'

type UseCookieStoreArgs = {
  id: MaybeRef<string>
  cookies: MagicCookie[]
  maxAge?: number
}

type CookieStore = Reactive<{
  cookies: MagicCookie[]
  maxAge: number | undefined
}>

// Global API state to manage cookies and maxAge
export const cookieStore: CookieStore = reactive({
  cookies: [],
  maxAge: undefined,
})

export function useCookieStore(args: UseCookieStoreArgs) {
  const { id, cookies, maxAge } = args

  // @vueuse/integrations/useCookies
  const universalCookies = useCookies([toValue(id)])
  const browserCookies = universalCookies.get(toValue(id))

  if (!Array.isArray(cookies)) {
    console.warn('Invalid configuration. ‘cookies‘ must be an array.')
  }

  // Initialize maxAge
  cookieStore.maxAge = maxAge

  // Initialize cookies
  cookieStore.cookies = cookies?.map((cookie) => {
    const savedCookie = browserCookies.cookies[cookie.key]
    let value = cookie.value

    switch (true) {
      case cookie.optional === false:
        value = true
        break
      default:
        value = savedCookie ?? cookie.value
    }

    const key = slugify(cookie.key, {
      separator: '_',
      lowercase: true,
      strict: true,
    })

    return {
      ...cookie,
      value,
      key,
    }
  })

  return {
    cookieStore,
  }
}
