import { ref } from 'vue'
import { slugify } from '@maas/vue-equipment/utils'
import type { CookieApiDefinition, CookieRecord } from '../../types'

// Global API state to manage cookies and maxAge
export const globalApiState = ref({
  cookies: [] as CookieRecord[],
  maxAge: undefined as number | undefined,
})

export function defineCookieApi({ cookies, maxAge }: CookieApiDefinition) {
  // Validate the input configuration
  if (!Array.isArray(cookies)) {
    console.warn('Invalid configuration. "cookies" must be an array.')
  }

  // Map the cookies array to include a 'key' property that is slugified
  // with specific options (separator, lowercase, and strict).
  globalApiState.value.cookies = cookies?.map((cookie) => {
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
  globalApiState.value.maxAge = maxAge
}
