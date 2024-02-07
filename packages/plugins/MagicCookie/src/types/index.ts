export type CookieApiDefinition = {
  cookies: CookieRecord[]
  maxAge?: number
}

export type CookieRecord = {
  key: string
  optional?: boolean
  title?: string
  text?: string
  [key: string]: any
}

export type CookieConsent = {
  timestamp: number | undefined
  cookies: Record<string, boolean>
}

export type CookieEvents = {
  accept: CookieConsent
  reject: CookieConsent
  acceptSelected: CookieConsent
}
