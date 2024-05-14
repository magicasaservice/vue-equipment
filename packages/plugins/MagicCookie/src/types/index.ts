export type MagicCookieRecord = {
  key: string
  optional?: boolean
  title?: string
  text?: string
  [key: string]: unknown
}

export type MagicCookieConsent = {
  timestamp: number | undefined
  cookies: Record<string, boolean>
}

export type MagicCookieEvents = {
  accept: MagicCookieConsent
  reject: MagicCookieConsent
  acceptSelected: MagicCookieConsent
}
