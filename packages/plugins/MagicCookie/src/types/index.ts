export interface CookieItem {
  id: string
  active: boolean
  optional?: boolean
  maxAge?: number
  timestamp?: number
  set?: boolean
}

export interface CookieState {
  id: string
  refCount: number
  options: MagicCookieOptions
  items: CookieItem[]
  viewActive: boolean
}

export type CookieConsent = Record<CookieItem['id'], CookieItem['active']>

export interface MagicCookieOptions {
  maxAge?: number
  transition?: string
  animation?: {
    duration: number
    easing: (t: number) => number
  }
}

export interface CookieEvents {
  beforeEnter: string
  enter: string
  afterEnter: string
  beforeLeave: string
  leave: string
  afterLeave: string
  acceptAll: CookieConsent
  rejectAll: CookieConsent
  acceptSelected: CookieConsent
}

export type MagicCookieCallbackArgs = CookieConsent
