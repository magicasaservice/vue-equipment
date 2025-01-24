export type MagicCookie = {
  [key: string]: unknown
  key: string
  value: boolean
  optional?: boolean
  title?: string
  text?: string
}

export type MappedCookies = Record<string, boolean>

export type CookieConsent = {
  timestamp?: number
  cookies: MappedCookies
}

export type MagicCookieOptions = {
  maxAge?: number
  transition?: {
    preferences?: string
  }
}

export type CookieEvents = {
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
