import type { InjectionKey, MaybeRef } from 'vue'
import type { MagicCookie, MagicCookieOptions } from '../types'

const MagicCookieId = Symbol() as InjectionKey<MaybeRef<string>>
const MagicCookieCookies = Symbol() as InjectionKey<MagicCookie[]>
const MagicCookieOptionsKey = Symbol() as InjectionKey<MagicCookieOptions>

export { MagicCookieId, MagicCookieCookies, MagicCookieOptionsKey }
