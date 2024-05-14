import { ref } from 'vue'
import { slugify } from '@maas/vue-equipment/utils'
import type { MagicCookieRecord } from '../../types'

type UseCookieApiArgs = {
  cookies: MagicCookieRecord[]
  maxAge?: number
}

// Global API state to manage cookies and maxAge
export const cookieApiStore = ref({
  cookies: [] as MagicCookieRecord[],
  maxAge: undefined as number | undefined,
})

export function useCookieApi({ cookies, maxAge }: UseCookieApiArgs) {
  // Validate the input configuration
  if (!Array.isArray(cookies)) {
    console.warn('Invalid configuration. "cookies" must be an array.')
  }

  // Map the cookies array to include a 'key' property that is slugified
  // with specific options (separator, lowercase, and strict).
  cookieApiStore.value.cookies = cookies?.map((cookie) => {
    return {
      ...cookie,
      key: slugify(cookie.key, {
        separator: '_',
        lowercase: true,
        strict: true,
      }),
    }
  })

  // Set the global maxAge value based on the provided maxAge.
  cookieApiStore.value.maxAge = maxAge
}
