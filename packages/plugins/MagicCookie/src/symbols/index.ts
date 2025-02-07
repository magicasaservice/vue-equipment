import type { InjectionKey, MaybeRef } from 'vue'

const MagicCookieInstanceId = Symbol() as InjectionKey<MaybeRef<string>>
const MagicCookieItemId = Symbol() as InjectionKey<string>
const MagicCookieItemActive = Symbol() as InjectionKey<MaybeRef<boolean>>

export { MagicCookieInstanceId, MagicCookieItemId, MagicCookieItemActive }
