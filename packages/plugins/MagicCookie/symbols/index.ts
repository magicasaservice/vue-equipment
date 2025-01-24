import type { InjectionKey, MaybeRef } from 'vue'
import type { MagicCookie, MagicCookieOptions } from '../src/types'

const MagicCookieId = Symbol() as InjectionKey<MaybeRef<string>>
const MagicCookieList = Symbol() as InjectionKey<MagicCookie[]>
const MagicCookieOptionsKey = Symbol() as InjectionKey<MagicCookieOptions>

export { MagicCookieId, MagicCookieList, MagicCookieOptionsKey }
