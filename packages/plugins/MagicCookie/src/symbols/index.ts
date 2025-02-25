import type { InjectionKey, MaybeRef, Ref } from 'vue'

const MagicCookieInstanceId = Symbol() as InjectionKey<MaybeRef<string>>
const MagicCookieItemId = Symbol() as InjectionKey<string>
const MagicCookieItemActive = Symbol() as InjectionKey<Ref<boolean>>

export { MagicCookieInstanceId, MagicCookieItemId, MagicCookieItemActive }
